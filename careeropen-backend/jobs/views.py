from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

# Import custom permissions
from .permissions import IsJobOwnerOrReadOnly, IsApplicationOwnerOrReadOnly, IsAdminOrReadOnly, IsCompanyOwnerOrReadOnly
from accounts.views import IsEmployer
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers

from .models import Job, JobApplication, Category, Company
from .serializers import (
    JobSerializer, JobApplicationSerializer, JobSearchSerializer,
    CategorySerializer, CompanySerializer
)
from .permissions import IsJobOwnerOrReadOnly, IsApplicationOwnerOrReadOnly, IsAdminOrReadOnly, IsCompanyOwnerOrReadOnly

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class JobViewSet(viewsets.ModelViewSet):
    """
    Enhanced API endpoint for job management with comprehensive CRUD operations.
    Includes advanced filtering, search, ordering, and caching capabilities.
    """
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'job_type': ['exact', 'in'],
        'location': ['exact', 'icontains'],
        'is_active': ['exact'],
        'is_remote': ['exact'],
        'company': ['exact'],
        'categories': ['exact', 'in'],
        'salary_min': ['gte', 'lte', 'exact'],
        'salary_max': ['gte', 'lte', 'exact'],
        'status': ['exact', 'in'],
        'created_at': ['date', 'gte', 'lte'],
        'application_deadline': ['date', 'gte', 'lte', 'isnull'],
    }
    search_fields = [
        'title', 'description', 'requirements', 'responsibilities',
        'company__name', 'location', 'categories__name'
    ]
    ordering_fields = [
        'created_at', 'updated_at', 'published_at', 'salary_min',
        'salary_max', 'title', 'company__name', 'application_deadline'
    ]
    ordering = ['-created_at']
    cache_timeout = 60 * 15  # 15 minutes

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsEmployer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsJobOwnerOrReadOnly | IsAdminUser]
        elif self.action in ['apply', 'my_applications']:
            permission_classes = [IsAuthenticated, ~IsEmployer]
        elif self.action in ['my_jobs', 'drafts']:
            permission_classes = [IsAuthenticated, IsEmployer]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Custom queryset to filter jobs based on user role and request parameters.
        """
        queryset = super().get_queryset()
        user = self.request.user
        
        # For non-authenticated users or non-employers, only show published and active jobs
        if not user.is_authenticated or not hasattr(user, 'is_employer') or not user.is_employer:
            queryset = queryset.filter(status=Job.PUBLISHED, is_active=True)
        # For employers, show their own jobs regardless of status
        elif self.action in ['my_jobs', 'drafts'] or 'my_jobs' in self.request.query_params:
            queryset = queryset.filter(poster=user)
        
        # Apply additional filters from query parameters
        company = self.request.query_params.get('company')
        if company:
            queryset = queryset.filter(company_id=company)
            
        # Filter by application deadline
        deadline_filter = self.request.query_params.get('deadline_filter')
        if deadline_filter == 'expired':
            queryset = queryset.filter(application_deadline__lt=timezone.now())
        elif deadline_filter == 'upcoming':
            queryset = queryset.filter(
                application_deadline__isnull=False,
                application_deadline__gte=timezone.now()
            )
            
        return queryset.select_related('company', 'poster').prefetch_related('categories')
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
        
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, *args, **kwargs):
        """
        List all jobs with caching and advanced filtering.
        """
        # Generate a cache key based on the request
        cache_key = f'jobs_list_{request.get_full_path()}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response = super().list(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a job with caching and permission checks.
        """
        # Generate a cache key based on the request
        cache_key = f'job_detail_{kwargs["pk"]}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
        response = super().retrieve(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response

    def perform_create(self, serializer):
        # Set the job poster to the current user
        serializer.save(poster=self.request.user)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """
        Custom action to apply for a job.
        Only job seekers can apply for jobs.
        """
        # Ensure the user is a job seeker
        if request.user.is_employer:
            return Response(
                {"detail": "Employers cannot apply for jobs. Please use a job seeker account."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        job = self.get_object()
        if not job.is_active:
            return Response(
                {"detail": "This job is no longer accepting applications."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already applied
        if JobApplication.objects.filter(
            job=job, 
            applicant=request.user
        ).exists():
            return Response(
                {"detail": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the application with safe data access
        application_data = {
            'job': job,
            'applicant': request.user,
            'status': 'applied',
            'cover_letter': request.data.get('cover_letter', ''),
            'resume': request.data.get('resume')  # Safely get resume if provided
        }
        
        # Remove None values to prevent overriding model defaults
        application_data = {k: v for k, v in application_data.items() if v is not None}
        
        application = JobApplication.objects.create(**application_data)
        
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class JobSearchView(APIView):
    """
    Advanced job search endpoint with filtering, sorting, and pagination.
    
    Query Parameters:
    - search: Search term to filter jobs by title, description, company, or location
    - job_type: Filter by job type (e.g., 'full_time', 'part_time', 'contract', 'internship', 'temporary')
    - location: Filter by job location
    - salary_min: Minimum salary
    - salary_max: Maximum salary
    - is_remote: Filter remote jobs (true/false)
    - posted_after: Filter jobs posted after a specific date (YYYY-MM-DD)
    - company: Filter by company name
    - skills: Comma-separated list of skills to search for
    - ordering: Field to order by (prefix with '-' for descending order)
    - page: Page number for pagination
    - page_size: Number of items per page
    """
    serializer_class = JobSearchSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'job_type': ['exact', 'in'],
        'location': ['exact', 'icontains'],
        'is_active': ['exact'],
        'is_remote': ['exact'],
        'salary_min': ['gte', 'lte', 'exact'],
        'salary_max': ['gte', 'lte', 'exact'],
        'created_at': ['gte', 'lte', 'date'],
        'company': ['exact', 'icontains'],
    }
    search_fields = ['title', 'description', 'company', 'location', 'requirements']
    ordering_fields = [
        'created_at', 'updated_at', 'salary_min', 'salary_max', 'title', 'company'
    ]
    ordering = ['-created_at']

    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or None.
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        """
        Return a single page of results, or `None` if pagination is disabled.
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        """
        Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)

    def filter_queryset(self, queryset):
        """
        Given a queryset, filter it with whichever filter backend is in use.
        """
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset

    def get_queryset(self):
        """
        Get the list of items for this view with filtering and search capabilities.
        """
        # Start with all jobs
        queryset = Job.objects.all()
        
        # Handle custom filtering
        params = self.request.query_params
        
        # Filter by active status (default to showing only active jobs if not specified)
        is_active = params.get('is_active')
        if is_active is not None:
            is_active = is_active.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_active=is_active)
        else:
            # Default to showing only active jobs if not specified
            queryset = queryset.filter(is_active=True)
        
        # Filter by job type
        job_type = params.get('job_type')
        if job_type:
            job_types = [jt.strip() for jt in job_type.split(',')]
            queryset = queryset.filter(job_type__in=job_types)
        
        # Filter by company
        company = params.get('company')
        if company:
            queryset = queryset.filter(company__icontains=company)
        
        # Filter by location
        location = params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by remote jobs
        is_remote = params.get('is_remote')
        if is_remote is not None:
            is_remote = is_remote.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_remote=is_remote)
        
        # Filter by salary range
        min_salary = params.get('min_salary')
        if min_salary:
            try:
                min_salary = float(min_salary)
                queryset = queryset.filter(salary_min__gte=min_salary)
            except (ValueError, TypeError):
                pass
        
        max_salary = params.get('max_salary')
        if max_salary:
            try:
                max_salary = float(max_salary)
                queryset = queryset.filter(salary_max__lte=max_salary)
            except (ValueError, TypeError):
                pass
        
        # Filter by skills if provided
        skills = params.get('skills')
        if skills:
            skills_list = [skill.strip().lower() for skill in skills.split(',')]
            for skill in skills_list:
                queryset = queryset.filter(required_skills__icontains=skill)
        
        # Filter by posted date
        posted_after = params.get('posted_after')
        if posted_after:
            from django.utils.dateparse import parse_date
            try:
                date = parse_date(posted_after)
                if date:
                    queryset = queryset.filter(created_at__date__gte=date)
            except (ValueError, TypeError):
                pass
        
        # Ordering
        ordering = params.get('ordering')
        if ordering:
            # Validate ordering fields to prevent SQL injection
            valid_ordering_fields = [
                'created_at', '-created_at', 'updated_at', '-updated_at',
                'salary_min', '-salary_min', 'salary_max', '-salary_max',
                'title', '-title', 'company', '-company'
            ]
            
            if ordering in valid_ordering_fields:
                queryset = queryset.order_by(ordering)
        else:
            # Default ordering
            queryset = queryset.order_by('-created_at')
                
        return queryset

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests, with optional filtering, searching, and pagination.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = JobSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        # If no pagination, return all results
        serializer = JobSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'next': None,
            'previous': None,
            'results': serializer.data
        })


class JobApplicationCreateView(APIView):
    """
    Create a job application.
    Only job seekers can apply for jobs.
    """
    permission_classes = [IsAuthenticated, ~IsEmployer]  # Only non-employers (job seekers) can apply
    serializer_class = JobApplicationSerializer

    def post(self, request, job_id):
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Job application request received. Job ID: {job_id}")
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request FILES: {request.FILES}")
        
        try:
            job = Job.objects.get(id=job_id, is_active=True)
            logger.info(f"Found job: {job.id} - {job.title}")
        except Job.DoesNotExist:
            error_msg = f"Job not found or not active. Job ID: {job_id}"
            logger.error(error_msg)
            return Response(
                {"detail": "Job not found or not accepting applications."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            error_msg = f"User {request.user.id} already applied to job {job.id}"
            logger.warning(error_msg)
            return Response(
                {"detail": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log incoming data (safely)
        logger.info("Creating serializer with data: %s", str(request.data)[:500])  # Limit log size
        logger.info("Files in request: %s", list(request.FILES.keys()) if hasattr(request, 'FILES') else 'No files')
        
        # Create a mutable copy of the request data with only the fields we expect
        data = {
            'job': job.id,
            'applicant': request.user.id,
            'status': 'applied',
            'cover_letter': request.data.get('cover_letter', ''),
            'resume': request.FILES.get('resume')  # Get file from FILES, not data
        }
        
        # Log the final data being passed to serializer (excluding file content)
        log_data = data.copy()
        if 'resume' in log_data and log_data['resume']:
            log_data['resume'] = f'<File: {log_data["resume"].name} ({log_data["resume"].size} bytes)>'
        logger.info("Final data being passed to serializer: %s", log_data)
        
        # Initialize serializer with the cleaned data
        serializer = self.serializer_class(data=data, context={'request': request, 'job': job})
        
        if serializer.is_valid():
            logger.info("Serializer is valid. Saving application...")
            try:
                application = serializer.save(job=job, applicant=request.user, status='applied')
                logger.info(f"Application created successfully. ID: {application.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving application: {str(e)}", exc_info=True)
                return Response(
                    {"detail": "An error occurred while processing your application."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.warning(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Enhanced API endpoint for category management with comprehensive CRUD operations.
    Includes advanced filtering, search, ordering, and caching capabilities.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'keywords']
    filterset_fields = {
        'is_active': ['exact'],
        'created_at': ['date', 'gte', 'lte'],
        'updated_at': ['date', 'gte', 'lte'],
    }
    ordering_fields = [
        'name', 'created_at', 'updated_at'
    ]
    ordering = ['name']
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    cache_timeout = 60 * 60 * 24  # 24 hours (categories don't change often)
    
    def get_queryset(self):
        """
        Custom queryset to filter categories based on user role and request parameters.
        """
        queryset = super().get_queryset()
        
        # For non-admin users, only return active categories
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
            
        # Annotate with job count if requested
        if 'include_job_count' in self.request.query_params:
            queryset = queryset.annotate(
                job_count=Count('job', filter=Q(job__is_active=True, job__status=Job.PUBLISHED))
            )
            
        return queryset
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
        
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, *args, **kwargs):
        """
        List all categories with caching and advanced filtering.
        """
        # Generate a cache key based on the request
        cache_key = f'categories_list_{request.get_full_path()}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response = super().list(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a category with caching and permission checks.
        """
        # Generate a cache key based on the request
        cache_key = f'category_detail_{kwargs["slug"]}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response = super().retrieve(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """List all featured categories (public endpoint)."""
        queryset = self.filter_queryset(
            self.get_queryset().filter(is_featured=True, is_active=True)
        ).order_by('display_order', 'name')
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def feature(self, request, slug=None):
        """Feature a category (admin only)."""
        category = self.get_object()
        
        if category.is_featured:
            return Response(
                {'detail': 'This category is already featured.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        category.is_featured = True
        category.featured_at = timezone.now()
        category.save()
        
        # Clear cache for this category
        cache.delete(f'category_detail_{category.slug}')
        
        serializer = self.get_serializer(category)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def unfeature(self, request, slug=None):
        """Remove category from featured list (admin only)."""
        category = self.get_object()
        
        if not category.is_featured:
            return Response(
                {'detail': 'This category is not featured.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        category.is_featured = False
        category.featured_at = None
        category.save()
        
        # Clear cache for this category
        cache.delete(f'category_detail_{category.slug}')
        
        serializer = self.get_serializer(category)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def jobs(self, request, slug=None):
        """List all jobs in this category (public endpoint)."""
        category = self.get_object()
        jobs = Job.objects.filter(
            categories=category,
            is_active=True,
            status=Job.PUBLISHED
        ).order_by('-created_at')
        
        # Apply pagination
        page = self.paginate_queryset(jobs)
        if page is not None:
            serializer = JobSerializer(
                page, many=True, context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """Create a new category with the current user as the creator."""
        category = serializer.save()
        
        # If the user is an admin and no display order is provided, set it to the next available
        if self.request.user.is_staff and not category.display_order:
            max_order = Category.objects.aggregate(Max('display_order'))['display_order__max'] or 0
            category.display_order = max_order + 1
            category.save()
    
    def perform_update(self, serializer):
        """Update a category with proper tracking."""
        instance = serializer.save()
        
        # Clear cache for this category
        cache.delete(f'category_detail_{instance.slug}')
    
    def perform_destroy(self, instance):
        """Delete a category and clear its cache."""
        category_slug = instance.slug
        instance.delete()
        # Clear cache for this category
        cache.delete(f'category_detail_{category_slug}')


class CompanyViewSet(viewsets.ModelViewSet):
    """
    Enhanced API endpoint for company management with comprehensive CRUD operations.
    Includes advanced filtering, search, ordering, and caching capabilities.
    """
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = [
        'name', 'description', 'industry', 'headquarters', 'website',
        'tagline', 'specialties'
    ]
    filterset_fields = {
        'industry': ['exact', 'icontains'],
        'company_size': ['exact', 'in'],
        'is_verified': ['exact'],
        'founded_year': ['exact', 'gte', 'lte'],
        'created_at': ['date', 'gte', 'lte'],
        'headquarters': ['exact', 'icontains']
    }
    ordering_fields = [
        'name', 'created_at', 'updated_at', 'founded_year', 'company_size'
    ]
    ordering = ['name']
    permission_classes = [IsAuthenticated, IsCompanyOwnerOrReadOnly]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    cache_timeout = 60 * 30  # 30 minutes

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsEmployer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCompanyOwnerOrReadOnly | IsAdminUser]
        elif self.action in ['my_companies', 'verify', 'unverify']:
            permission_classes = [IsAuthenticated, IsEmployer | IsAdminUser]
        elif self.action in ['featured']:
            permission_classes = []  # Public endpoint
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Custom queryset to filter companies based on user role and request parameters.
        """
        queryset = super().get_queryset()
        user = self.request.user
        
        # Apply filters from query parameters
        is_featured = self.request.query_params.get('is_featured')
        if is_featured is not None:
            queryset = queryset.filter(is_featured=is_featured.lower() == 'true')
        
        # For non-authenticated users, only return verified companies
        if not user.is_authenticated:
            return queryset.filter(is_verified=True, is_active=True)
            
        # If user is an admin, return all companies
        if user.is_staff:
            return queryset
            
        # If user is an employer, return their companies and verified companies
        if hasattr(user, 'is_employer') and user.is_employer:
            if self.action == 'my_companies':
                return queryset.filter(created_by=user)
            return queryset.filter(Q(created_by=user) | Q(is_verified=True))
            
        # For regular users, only return verified and active companies
        return queryset.filter(is_verified=True, is_active=True)
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, *args, **kwargs):
        """
        List all companies with caching and advanced filtering.
        """
        # Generate a cache key based on the request
        cache_key = f'companies_list_{request.get_full_path()}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response = super().list(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a company with caching and permission checks.
        """
        # Generate a cache key based on the request
        cache_key = f'company_detail_{kwargs["slug"]}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response = super().retrieve(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
    
    @action(detail=False, methods=['get'])
    def my_companies(self, request):
        """List all companies created by the current user (employer)."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, slug=None):
        """Mark a company as verified (admin only)."""
        company = self.get_object()
        
        if company.is_verified:
            return Response(
                {'detail': 'This company is already verified.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        company.is_verified = True
        company.verified_at = timezone.now()
        company.verified_by = request.user
        company.save()
        
        # Clear cache for this company
        cache.delete(f'company_detail_{company.slug}')
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def unverify(self, request, slug=None):
        """Mark a company as unverified (admin only)."""
        company = self.get_object()
        
        if not company.is_verified:
            return Response(
                {'detail': 'This company is not verified.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        company.is_verified = False
        company.verified_at = None
        company.verified_by = None
        company.save()
        
        # Clear cache for this company
        cache.delete(f'company_detail_{company.slug}')
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def feature(self, request, slug=None):
        """Feature a company (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only administrators can perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        company = self.get_object()
        
        if company.is_featured:
            return Response(
                {'detail': 'This company is already featured.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        company.is_featured = True
        company.featured_at = timezone.now()
        company.save()
        
        # Clear cache for this company
        cache.delete(f'company_detail_{company.slug}')
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def unfeature(self, request, slug=None):
        """Remove company from featured list (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only administrators can perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        company = self.get_object()
        
        if not company.is_featured:
            return Response(
                {'detail': 'This company is not featured.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        company.is_featured = False
        company.featured_at = None
        company.save()
        
        # Clear cache for this company
        cache.delete(f'company_detail_{company.slug}')
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """List all featured companies (public endpoint)."""
        queryset = self.filter_queryset(
            self.get_queryset().filter(is_featured=True, is_verified=True, is_active=True)
        )
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """Create a new company with the current user as the creator."""
        company = serializer.save(created_by=self.request.user)
        
        # If the user is an admin, auto-verify the company
        if self.request.user.is_staff:
            company.is_verified = True
            company.verified_at = timezone.now()
            company.verified_by = self.request.user
            company.save()
    
    def perform_update(self, serializer):
        """Update a company with proper tracking."""
        instance = serializer.save()
        
        # Clear cache for this company
        cache.delete(f'company_detail_{instance.slug}')
    
    def perform_destroy(self, instance):
        """Delete a company and clear its cache."""
        company_slug = instance.slug
        instance.delete()
        # Clear cache for this company
        cache.delete(f'company_detail_{company_slug}')


class UserJobApplicationsView(ListAPIView):
    """
    List all job applications for the current user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return JobApplication.objects.filter(applicant=self.request.user).order_by('-applied_at')


class JobApplicationDetailView(APIView):
    """
    Retrieve, update or delete a job application.
    """
    permission_classes = [IsAuthenticated, IsApplicationOwnerOrReadOnly]
    serializer_class = JobApplicationSerializer

    def get_object(self, pk):
        try:
            return JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        application = self.get_object(pk)
        self.check_object_permissions(request, application)
        serializer = self.serializer_class(application)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        application = self.get_object(pk)
        self.check_object_permissions(request, application)
        serializer = self.serializer_class(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        application = self.get_object(pk)
        self.check_object_permissions(request, application)
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
