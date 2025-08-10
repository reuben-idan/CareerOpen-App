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
    API endpoint that allows jobs to be viewed or edited.
    Caching is applied to list and retrieve operations.
    """
    queryset = Job.objects.all().order_by('-created_at')
    # Cache page for the requested url for 15 minutes
    cache_timeout = 60 * 15  # 15 minutes
    serializer_class = JobSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'location', 'is_active']
    search_fields = ['title', 'description', 'company', 'location']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsEmployer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsJobOwnerOrReadOnly]
        elif self.action == 'apply':
            # For job applications, we'll handle the permission in the view method
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
        
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, *args, **kwargs):
        """
        List all jobs with caching.
        The cache key is based on the request URL and user authentication.
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
        Retrieve a job with caching.
        """
        # Generate a cache key based on the request
        cache_key = f'job_detail_{kwargs["pk"]}'
        
        # Try to get the response from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
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
    API endpoint that allows categories to be viewed or edited.
    Caching is applied to list and retrieve operations.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    cache_timeout = 60 * 30  # 30 minutes
    
    @method_decorator(cache_page(cache_timeout))
    def list(self, request, *args, **kwargs):
        """
        List all categories with caching.
        """
        cache_key = f'categories_list_{request.get_full_path()}'
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a category with caching.
        """
        cache_key = f'category_detail_{kwargs["slug"]}'
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.cache_timeout)
        return response


class CompanyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows companies to be viewed or edited.
    Only employers can create companies.
    Caching is applied to list and retrieve operations.
    """
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'industry', 'headquarters']
    filterset_fields = ['industry', 'company_size', 'is_verified']
    ordering_fields = ['name', 'created_at', 'founded_year']
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
            # Only employers can create companies
            permission_classes = [IsAuthenticated, IsEmployer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only company owners or admins can update/delete
            permission_classes = [IsAuthenticated, IsCompanyOwnerOrReadOnly]
        else:
            # Read permissions are allowed to any authenticated user
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
        
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, *args, **kwargs):
        """
        List all companies with caching.
        The cache key is based on the request URL and user authentication.
        """
        cache_key = f'companies_list_{request.get_full_path()}'
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a company with caching.
        """
        cache_key = f'company_detail_{kwargs["slug"]}'
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
    
    def get_queryset(self):
        """
        Filter companies based on user role.
        """
        queryset = super().get_queryset()
        
        # Non-admin users can only see verified companies
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_verified=True)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Set the creator of the company.
        """
        serializer.save(created_by=self.request.user)


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
