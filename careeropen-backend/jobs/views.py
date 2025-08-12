import logging
from typing import Any, Dict, List, Optional, Type, Union, TypeVar
from datetime import datetime

from django.core.cache import cache
from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample,
    OpenApiResponse, OpenApiTypes, extend_schema_serializer
)
from rest_framework import viewsets, status, filters, generics
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import BaseFilterBackend
from rest_framework.exceptions import NotAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated, IsAdminUser, BasePermission, IsAuthenticatedOrReadOnly
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.pagination import PageNumberPagination

# Local imports
from .models import Job, JobApplication, Category, Company
from .serializers import (
    JobSerializer, JobApplicationSerializer, JobSearchSerializer,
    CategorySerializer, CompanySerializer
)
from .permissions import (
    IsJobOwnerOrReadOnly, IsApplicationOwnerOrReadOnly,
    IsAdminOrReadOnly, IsCompanyOwnerOrReadOnly
)
from accounts.views import IsEmployer

# Configure logger
logger = logging.getLogger(__name__)

# Type variables for generic type hints
_MT = TypeVar('_MT')  # Model type
_ST = TypeVar('_ST')  # Serializer type

from .models import Job, JobApplication, Category, Company
from .serializers import (
    JobSerializer, JobApplicationSerializer, JobSearchSerializer,
    CategorySerializer, CompanySerializer
)
from .permissions import IsJobOwnerOrReadOnly, IsApplicationOwnerOrReadOnly, IsAdminOrReadOnly, IsCompanyOwnerOrReadOnly

class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class with configurable page size.
    
    Attributes:
        page_size: Default number of items per page
        page_size_query_param: Query parameter to control page size
        max_page_size: Maximum allowed page size
    """
    page_size: int = 10
    page_size_query_param: str = 'page_size'
    max_page_size: int = 100

@extend_schema_view(
    list=extend_schema(
        summary="List all jobs",
        description="""
        Returns a paginated list of jobs with filtering, searching, and ordering capabilities.
        Public endpoint, but some jobs may be restricted based on status and authentication.
        """,
        parameters=[
            OpenApiParameter(
                name='company',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Filter by company ID',
            ),
            OpenApiParameter(
                name='deadline_filter',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filter by application deadline (values: expired, upcoming)',
            ),
        ],
        examples=[
            OpenApiExample(
                'List all jobs',
                value={
                    'count': 42,
                    'next': 'https://api.example.com/jobs/?page=2',
                    'previous': None,
                    'results': [
                        {
                            'id': 1,
                            'title': 'Senior Software Engineer',
                            'company': {'id': 1, 'name': 'TechCorp'},
                            'location': 'Remote',
                            'job_type': 'full_time',
                            'salary_min': 100000,
                            'salary_max': 150000,
                            'is_remote': True,
                            'created_at': '2023-01-01T00:00:00Z',
                        }
                    ]
                }
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Retrieve a job",
        description="Retrieve detailed information about a specific job.",
        responses={
            200: JobSerializer,
            404: OpenApiResponse(description="Job not found"),
        }
    ),
    create=extend_schema(
        summary="Create a job",
        description="Create a new job listing. Requires employer authentication.",
        responses={
            201: JobSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Unauthorized"),
            403: OpenApiResponse(description="Forbidden - not an employer"),
        }
    ),
    update=extend_schema(
        summary="Update a job",
        description="Update an existing job. Only the job owner or admin can update.",
        responses={
            200: JobSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Unauthorized"),
            403: OpenApiResponse(description="Forbidden - not the owner"),
            404: OpenApiResponse(description="Job not found"),
        }
    ),
    partial_update=extend_schema(
        summary="Partially update a job",
        description="Partially update an existing job.",
        responses={
            200: JobSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Unauthorized"),
            403: OpenApiResponse(description="Forbidden - not the owner"),
            404: OpenApiResponse(description="Job not found"),
        }
    ),
    destroy=extend_schema(
        summary="Delete a job",
        description="Delete a job. Only the job owner or admin can delete.",
        responses={
            204: OpenApiResponse(description="No content"),
            401: OpenApiResponse(description="Unauthorized"),
            403: OpenApiResponse(description="Forbidden - not the owner"),
            404: OpenApiResponse(description="Job not found"),
        }
    )
)
class JobViewSet(viewsets.ModelViewSet):
    """
    Enhanced API endpoint for job management with comprehensive CRUD operations.
    
    This viewset provides the following actions:
    - list: List all jobs with filtering and pagination
    - retrieve: Get a single job by ID
    - create: Create a new job (employer only)
    - update: Update an existing job (owner or admin only)
    - partial_update: Partially update a job (owner or admin only)
    - destroy: Delete a job (owner or admin only)
    - apply: Apply for a job (job seeker only)
    - my_jobs: List jobs posted by the current user (employer only)
    - drafts: List draft jobs (employer only)
    """
    queryset: QuerySet[Job] = Job.objects.all().order_by('-created_at')
    serializer_class: Type[JobSerializer] = JobSerializer
    pagination_class: Type[StandardResultsSetPagination] = StandardResultsSetPagination
    filter_backends: List[Any] = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields: Dict[str, List[str]] = {
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
    search_fields: List[str] = [
        'title', 'description', 'requirements', 'responsibilities',
        'company__name', 'location', 'categories__name'
    ]
    ordering_fields: List[str] = [
        'created_at', 'updated_at', 'published_at', 'salary_min',
        'salary_max', 'title', 'company__name', 'application_deadline'
    ]
    ordering: List[str] = ['-created_at']
    cache_timeout: int = 60 * 15  # 15 minutes

    def get_permissions(self) -> List[BasePermission]:
        """
        Determine the list of permission classes required for the current action.
        
        Returns:
            List[BasePermission]: List of permission instances based on the action
            
        Permission Rules:
        - Create: Must be authenticated and an employer
        - Update/Delete: Must be the job owner or admin
        - Apply/My Applications: Must be authenticated and not an employer
        - My Jobs/Drafts: Must be authenticated and an employer
        - List/Retrieve: No authentication required (public access)
        """
        if self.action in ['create']:
            permission_classes: List[Type[BasePermission]] = [IsAuthenticated, IsEmployer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsJobOwnerOrReadOnly | IsAdminUser]
        elif self.action in ['apply', 'my_applications']:
            permission_classes = [IsAuthenticated, ~IsEmployer]
        elif self.action in ['my_jobs', 'drafts']:
            permission_classes = [IsAuthenticated, IsEmployer]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
    
    def get_queryset(self) -> QuerySet[Job]:
        """
        Get the queryset of jobs based on user role and request parameters.
        
        The queryset is filtered based on:
        - For non-authenticated users or non-employers: Only published and active jobs
        - For employers: Their own jobs (when viewing 'my_jobs' or 'drafts')
        - Additional filters from query parameters (company, deadline_filter)
        
        Returns:
            QuerySet[Job]: Filtered queryset of jobs
            
        Query Parameters:
            company (int): Filter by company ID
            deadline_filter (str): 'expired' or 'upcoming' to filter by application deadline
            
        Example:
            GET /jobs/?company=1&deadline_filter=upcoming
        """
        queryset: QuerySet[Job] = super().get_queryset()
        user = self.request.user
        
        # For non-authenticated users or non-employers, only show published and active jobs
        if not user.is_authenticated or not hasattr(user, 'is_employer') or not user.is_employer:
            queryset = queryset.filter(status=Job.PUBLISHED, is_active=True)
        # For employers, show their own jobs regardless of status
        elif self.action in ['my_jobs', 'drafts'] or 'my_jobs' in self.request.query_params:
            queryset = queryset.filter(poster=user)
        
        # Apply additional filters from query parameters
        company: Optional[str] = self.request.query_params.get('company')
        if company and company.isdigit():
            queryset = queryset.filter(company_id=int(company))
            
        # Filter by application deadline
        deadline_filter: Optional[str] = self.request.query_params.get('deadline_filter')
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
        
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='page',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='A page number within the paginated result set.'
            ),
            OpenApiParameter(
                name='page_size',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of results to return per page.'
            ),
        ],
        responses={
            200: JobSerializer(many=True),
            400: OpenApiResponse(description="Invalid input"),
        }
    )
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        List all jobs with caching, filtering, and pagination.
        
        This endpoint returns a paginated list of jobs with support for:
        - Filtering by various fields (job_type, location, etc.)
        - Full-text search across multiple fields
        - Custom sorting
        - Caching for improved performance
        
        Args:
            request: The HTTP request object
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: Paginated list of job objects
            
        Example Response:
            {
                "count": 42,
                "next": "https://api.example.com/jobs/?page=2",
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "title": "Senior Software Engineer",
                        "company": {"id": 1, "name": "TechCorp"},
                        "location": "Remote",
                        "job_type": "full_time",
                        "salary_min": 100000,
                        "salary_max": 150000,
                        "is_remote": true,
                        "created_at": "2023-01-01T00:00:00Z"
                    }
                ]
            }
        """
        # Generate a cache key based on the request
        cache_key: str = f'jobs_list_{request.get_full_path()}'
        
        # Try to get the response from cache
        cached_response: Optional[Dict[str, Any]] = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response: Response = super().list(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response
        
    @extend_schema(
        responses={
            200: JobSerializer,
            404: OpenApiResponse(description="Job not found"),
        }
    )
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Retrieve detailed information about a specific job.
        
        This endpoint returns detailed information about a single job, including:
        - Job title, description, and requirements
        - Company information
        - Salary range and job type
        - Application deadline
        - Creation and update timestamps
        
        The response is cached for improved performance.
        
        Args:
            request: The HTTP request object
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments, including the job 'pk' or 'slug'
            
        Returns:
            Response: Detailed job information
            
        Example Response:
            {
                "id": 1,
                "title": "Senior Software Engineer",
                "description": "We are looking for an experienced engineer...",
                "requirements": "5+ years of experience...",
                "job_type": "full_time",
                "location": "Remote",
                "salary_min": 100000,
                "salary_max": 150000,
                "is_remote": true,
                "is_active": true,
                "status": "published",
                "application_deadline": "2023-12-31T23:59:59Z",
                "company": {
                    "id": 1,
                    "name": "TechCorp",
                    "logo": "https://example.com/media/company_logos/techcorp.png"
                },
                "categories": [
                    {"id": 1, "name": "Software Development"},
                    {"id": 2, "name": "Engineering"}
                ],
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z"
            }
        """
        # Generate a cache key based on the job ID
        cache_key: str = f'job_detail_{kwargs["pk"]}'
        
        # Try to get the response from cache
        cached_response: Optional[Dict[str, Any]] = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
            
        # If not in cache, get the response from the parent class
        response: Response = super().retrieve(request, *args, **kwargs)
        
        # Cache the response
        cache.set(cache_key, response.data, self.cache_timeout)
        return response

    def perform_create(self, serializer: JobSerializer) -> None:
        """
        Create a new job instance and set the poster to the current user.
        
        This method is called when creating a new job and automatically sets:
        - The job poster to the currently authenticated user
        - The creation timestamp
        
        Args:
            serializer: The job serializer instance with validated data
            
        Raises:
            ValidationError: If the serializer data is invalid
            PermissionDenied: If the user doesn't have permission to create jobs
            
        Note:
            This method is called automatically by DRF's CreateModelMixin.
            The user must be authenticated and have employer privileges.
        """
        serializer.save(poster=self.request.user)
        logger.info(f"New job created by user {self.request.user.id}")

    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'cover_letter': {
                        'type': 'string',
                        'description': 'Cover letter for the job application',
                        'nullable': True
                    },
                    'resume': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Resume file (PDF, DOC, DOCX, TXT)',
                        'nullable': True
                    }
                }
            }
        },
        responses={
            201: JobApplicationSerializer,
            400: OpenApiResponse(description="Invalid input or already applied"),
            403: OpenApiResponse(description="Permission denied"),
            404: OpenApiResponse(description="Job not found"),
        }
    )
    @action(detail=True, methods=['post'])
    def apply(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        Apply for a job posting.
        
        This endpoint allows job seekers to apply for a job by submitting:
        - An optional cover letter
        - An optional resume file
        
        Only authenticated job seekers can apply for jobs. Each user can only apply once per job.
        
        Args:
            request: The HTTP request object containing application data
            pk: The primary key of the job to apply for
            
        Returns:
            Response: The created job application on success, or an error message
            
        Raises:
            PermissionDenied: If the user is an employer
            ValidationError: If the job is not active or the user has already applied
            
        Example Request:
            POST /api/jobs/1/apply/
            Content-Type: multipart/form-data
            
            {
                "cover_letter": "I'm excited to apply for this position...",
                "resume": [binary file data]
            }
            
        Example Response (201 Created):
            {
                "id": 1,
                "job": 1,
                "applicant": 42,
                "status": "applied",
                "cover_letter": "I'm excited to apply for this position...",
                "resume": "/media/resumes/john_doe_resume.pdf",
                "applied_at": "2023-01-01T12:00:00Z",
                "updated_at": "2023-01-01T12:00:00Z"
            }
        """
        # Ensure the user is a job seeker
        if not hasattr(request.user, 'is_employer') or request.user.is_employer:
            logger.warning(f"Employer {request.user.id} attempted to apply for job {pk}")
            return Response(
                {"detail": "Employers cannot apply for jobs. Please use a job seeker account."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        job: Job = self.get_object()
        
        # Check if job is accepting applications
        if not job.is_active:
            logger.warning(f"Inactive job application attempt for job {job.id} by user {request.user.id}")
            return Response(
                {"detail": "This job is no longer accepting applications."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check application deadline if set
        if job.application_deadline and job.application_deadline < timezone.now():
            logger.warning(f"Application after deadline for job {job.id} by user {request.user.id}")
            return Response(
                {"detail": "The application deadline for this job has passed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for existing application
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            logger.warning(f"Duplicate application attempt for job {job.id} by user {request.user.id}")
            return Response(
                {"detail": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create the application with safe data access
            application_data: Dict[str, Any] = {
                'job': job,
                'applicant': request.user,
                'status': 'applied',
                'cover_letter': request.data.get('cover_letter', ''),
                'resume': request.FILES.get('resume')  # Get uploaded file if provided
            }
            
            # Validate and create the application
            serializer: JobApplicationSerializer = JobApplicationSerializer(
                data=application_data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                application: JobApplication = serializer.save()
                logger.info(f"New application {application.id} created for job {job.id} by user {request.user.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            # Handle validation errors
            logger.warning(f"Invalid application data from user {request.user.id}: {serializer.errors}")
            return Response(
                {"detail": "Invalid application data", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error creating application: {str(e)}", exc_info=True)
            return Response(
                {"detail": "An error occurred while processing your application."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class JobSearchView(APIView):
    """
    Advanced job search endpoint with filtering, sorting, and pagination.
    
    This view provides a comprehensive search interface for job listings with support for:
    - Full-text search across multiple fields
    - Filtering by various job attributes
    - Custom sorting and pagination
    - Skills-based filtering
    - Date range filtering
    
    Authentication: Public endpoint (no authentication required)
    
    Query Parameters:
        search (str): Search term to filter jobs by title, description, company, or location
        job_type (str): Filter by job type (e.g., 'full_time', 'part_time', 'contract')
        location (str): Filter by job location (case-insensitive contains)
        salary_min (float): Filter by minimum salary
        salary_max (float): Filter by maximum salary
        is_remote (bool): Filter remote jobs (true/false)
        posted_after (date): Filter jobs posted after this date (YYYY-MM-DD)
        company (str): Filter by company name (case-insensitive contains)
        skills (str): Comma-separated list of skills to search for in job requirements
        ordering (str): Field to order by (prefix with '-' for descending order)
        page (int): Page number for pagination
        page_size (int): Number of items per page (default: 10, max: 100)
        
    Example Request:
        GET /api/jobs/search/?search=python&location=remote&salary_min=80000&is_remote=true
        
    Response Format:
    {
        "count": 42,
        "next": "https://api.example.com/jobs/search/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "title": "Senior Python Developer",
                "company": "TechCorp",
                "location": "Remote",
                "job_type": "full_time",
                "salary_min": 100000,
                "salary_max": 150000,
                "is_remote": true,
                "created_at": "2023-01-01T00:00:00Z"
            }
        ]
    }
    """
    serializer_class: Type[JobSearchSerializer] = JobSearchSerializer
    pagination_class: Type[PageNumberPagination] = StandardResultsSetPagination
    filter_backends: List[Type[BaseFilterBackend]] = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_fields: Dict[str, List[str]] = {
        'job_type': ['exact', 'in'],
        'location': ['exact', 'icontains'],
        'is_active': ['exact'],
        'is_remote': ['exact'],
        'salary_min': ['gte', 'lte', 'exact'],
        'salary_max': ['gte', 'lte', 'exact'],
        'created_at': ['gte', 'lte', 'date'],
        'company': ['exact', 'icontains'],
    }
    search_fields: List[str] = [
        'title', 'description', 'company', 'location', 'requirements',
        'responsibilities', 'categories__name', 'required_skills'
    ]
    ordering_fields: List[str] = [
        'created_at', 'updated_at', 'salary_min', 'salary_max', 
        'title', 'company', 'application_deadline'
    ]
    ordering: List[str] = ['-created_at']

    @property
    def paginator(self) -> Optional[PageNumberPagination]:
        """
        Lazy-load and return the paginator instance associated with the view.
        
        The paginator is created on first access and cached for subsequent calls.
        
        Returns:
            Optional[PageNumberPagination]: Configured paginator instance or None if pagination is disabled
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset: QuerySet) -> Optional[List[Any]]:
        """
        Return a single page of results from the given queryset.
        
        Args:
            queryset: The base queryset to paginate
            
        Returns:
            Optional[List[Any]]: A list of model instances for the current page, 
                               or None if pagination is disabled
            
        Example:
            >>> page = self.paginate_queryset(queryset)
            >>> if page is not None:
            ...     serializer = self.get_serializer(page, many=True)
            ...     return self.get_paginated_response(serializer.data)
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data: List[Dict[str, Any]]) -> Response:
        """
        Return a paginated style `Response` object for the given output data.
        
        This wraps the paginator's get_paginated_response method with additional type safety.
        
        Args:
            data: The serialized data for the current page
            
        Returns:
            Response: Paginated response with metadata including count, next/previous links, and results
            
        Raises:
            AssertionError: If the paginator is not properly initialized
            
        Example Response:
            {
                "count": 42,
                "next": "https://api.example.com/jobs/?page=2",
                "previous": null,
                "results": [...]
            }
        """
        assert self.paginator is not None, "Paginator not initialized"
        return self.paginator.get_paginated_response(data)

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        Apply all registered filter backends to the given queryset.
        
        This method chains together the filtering logic from all filter backends
        defined in `self.filter_backends`. Each backend's `filter_queryset` method
        is called in sequence with the filtered queryset from the previous backend.
        
        Args:
            queryset: The base queryset to be filtered
            
        Returns:
            QuerySet: The filtered queryset after applying all filter backends
            
        Note:
            The order of filter backends in `self.filter_backends` matters, as each
            backend receives the queryset as modified by previous backends.
            
        Example:
            # With filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
            # 1. DjangoFilterBackend applies model field filters
            # 2. SearchFilter applies full-text search
            # 3. OrderingFilter applies sorting
            filtered_queryset = self.filter_queryset(queryset)
        """
        for backend_class in self.filter_backends:
            backend = backend_class()
            queryset = backend.filter_queryset(self.request, queryset, self)
        return queryset

    def get_queryset(self) -> QuerySet[Job]:
        """
        Get the filtered and ordered queryset of jobs based on request parameters.
        
        This method applies all the custom filtering logic that isn't handled by
        the filter backends, including:
        - Active status filtering
        - Job type filtering
        - Company and location filtering
        - Salary range filtering
        - Skills-based filtering
        - Date-based filtering
        - Custom ordering
        
        Returns:
            QuerySet[Job]: The filtered and ordered queryset of jobs
            
        Notes:
            - All string comparisons are case-insensitive
            - Multiple job types can be provided as comma-separated values
            - Skills are matched using partial string matching on required_skills
            - Invalid values for numeric fields are silently ignored
        """
        # Start with all jobs and apply base filters
        queryset: QuerySet[Job] = Job.objects.select_related('company').prefetch_related('categories')
        params: QueryDict = self.request.query_params
        
        # Filter by active status (default to showing only active jobs if not specified)
        is_active: Optional[str] = params.get('is_active')
        if is_active is not None:
            is_active_bool: bool = is_active.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_active=is_active_bool)
        else:
            # Default to showing only active jobs if not specified
            queryset = queryset.filter(is_active=True)
        
        # Filter by job type (support for multiple types)
        job_type: Optional[str] = params.get('job_type')
        if job_type:
            job_types: List[str] = [jt.strip() for jt in job_type.split(',') if jt.strip()]
            if job_types:  # Only apply filter if we have valid job types
                queryset = queryset.filter(job_type__in=job_types)
        
        # Filter by company name (case-insensitive contains)
        company: Optional[str] = params.get('company')
        if company:
            queryset = queryset.filter(company__name__icontains=company)
        
        # Filter by location (case-insensitive contains)
        location: Optional[str] = params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by remote status
        is_remote: Optional[str] = params.get('is_remote')
        if is_remote is not None:
            is_remote_bool: bool = is_remote.lower() in ('true', '1', 't')
            queryset = queryset.filter(is_remote=is_remote_bool)
        
        # Filter by salary range
        min_salary: Optional[str] = params.get('min_salary')
        if min_salary:
            try:
                min_salary_float: float = float(min_salary)
                queryset = queryset.filter(salary_min__gte=min_salary_float)
            except (ValueError, TypeError) as e:
                logger.warning(f"Invalid min_salary value: {min_salary}", exc_info=True)
        
        max_salary: Optional[str] = params.get('max_salary')
        if max_salary:
            try:
                max_salary_float: float = float(max_salary)
                queryset = queryset.filter(salary_max__lte=max_salary_float)
            except (ValueError, TypeError) as e:
                logger.warning(f"Invalid max_salary value: {max_salary}", exc_info=True)
        
        # Filter by skills (comma-separated list)
        skills: Optional[str] = params.get('skills')
        if skills:
            skills_list: List[str] = [skill.strip().lower() for skill in skills.split(',') if skill.strip()]
            for skill in skills_list:
                queryset = queryset.filter(required_skills__icontains=skill)
        
        # Filter by posted date
        posted_after: Optional[str] = params.get('posted_after')
        if posted_after:
            try:
                from django.utils.dateparse import parse_date
                date: Optional[date] = parse_date(posted_after)
                if date:
                    queryset = queryset.filter(created_at__date__gte=date)
            except (ValueError, TypeError) as e:
                logger.warning(f"Invalid posted_after date: {posted_after}", exc_info=True)
        
        # Apply ordering
        ordering: Optional[str] = params.get('ordering')
        if ordering:
            # Validate ordering fields to prevent SQL injection
            valid_ordering_fields: List[str] = [
                'created_at', '-created_at', 'updated_at', '-updated_at',
                'salary_min', '-salary_min', 'salary_max', '-salary_max',
                'title', '-title', 'company__name', '-company__name',
                'application_deadline', '-application_deadline'
            ]
            
            if ordering in valid_ordering_fields:
                queryset = queryset.order_by(ordering)
        else:
            # Default ordering by most recent first
            queryset = queryset.order_by('-created_at')
                
        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Search term for full-text search across job titles, descriptions, etc.'
            ),
            OpenApiParameter(
                name='job_type',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Filter by job type (comma-separated for multiple, e.g., 'full_time,part_time')"
            ),
            OpenApiParameter(
                name='location',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filter by job location (case-insensitive contains)'
            ),
            OpenApiParameter(
                name='is_remote',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Filter for remote jobs (true/false)'
            ),
            OpenApiParameter(
                name='company',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filter by company name (case-insensitive contains)'
            ),
            OpenApiParameter(
                name='skills',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Comma-separated list of skills to filter by'
            ),
            OpenApiParameter(
                name='min_salary',
                type=OpenApiTypes.NUMBER,
                location=OpenApiParameter.QUERY,
                description='Filter by minimum salary'
            ),
            OpenApiParameter(
                name='max_salary',
                type=OpenApiTypes.NUMBER,
                location=OpenApiParameter.QUERY,
                description='Filter by maximum salary'
            ),
            OpenApiParameter(
                name='posted_after',
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description='Filter jobs posted after this date (YYYY-MM-DD)'
            ),
            OpenApiParameter(
                name='ordering',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Field to order by (prefix with - for descending)'
            ),
            OpenApiParameter(
                name='page',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='A page number within the paginated result set.'
            ),
            OpenApiParameter(
                name='page_size',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of results to return per page.'
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=JobSerializer(many=True),
                description='Paginated list of jobs matching the search criteria',
                examples={
                    'application/json': {
                        'count': 42,
                        'next': 'https://api.example.com/jobs/search/?page=2',
                        'previous': None,
                        'results': [
                            {
                                'id': 1,
                                'title': 'Senior Python Developer',
                                'company': 'TechCorp',
                                'location': 'Remote',
                                'job_type': 'full_time',
                                'salary_min': 100000,
                                'salary_max': 150000,
                                'is_remote': True,
                                'created_at': '2023-01-01T00:00:00Z'
                            }
                        ]
                    }
                }
            ),
            400: OpenApiResponse(description='Invalid input parameters'),
            500: OpenApiResponse(description='Internal server error')
        }
    )
    def get(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Handle GET requests to search and filter jobs.
        
        This endpoint allows searching and filtering jobs based on various criteria.
        It supports pagination, filtering by multiple fields, and custom ordering.
        
        Args:
            request: The HTTP request object containing query parameters
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: Paginated list of jobs matching the search criteria
            
        Example:
            GET /api/jobs/search/?search=python&location=remote&salary_min=80000
            
        Notes:
            - All string searches are case-insensitive
            - Multiple values for filters like job_type should be comma-separated
            - Invalid filter values are silently ignored
        """
        try:
            # Apply all filters to the base queryset
            queryset: QuerySet[Job] = self.filter_queryset(self.get_queryset())
            
            # Apply pagination if configured
            page: Optional[List[Job]] = self.paginate_queryset(queryset)
            if page is not None:
                # Use the appropriate serializer based on the context
                serializer: JobSerializer = JobSerializer(
                    page, 
                    many=True,
                    context={'request': request}
                )
                return self.get_paginated_response(serializer.data)
            
            # If no pagination, return all results (not recommended for large datasets)
            serializer = JobSerializer(
                queryset, 
                many=True,
                context={'request': request}
            )
            return Response({
                'count': queryset.count(),
                'next': None,
                'previous': None,
                'results': serializer.data
            })
            
        except Exception as e:
            logger.error(
                f"Error in JobSearchView: {str(e)}", 
                exc_info=True,
                extra={
                    'request': {
                        'method': request.method,
                        'path': request.path,
                        'query_params': dict(request.query_params)
                    }
                }
            )
            return Response(
                {'detail': 'An error occurred while processing your request.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobApplicationCreateView(APIView):
    """
    API endpoint for job seekers to apply for jobs.
    
    This endpoint allows authenticated job seekers to submit applications for job postings.
    Each application includes a cover letter and an optional resume upload.
    
    ### Authentication
    - User must be authenticated
    - User must be a job seeker (not an employer)
    
    ### Request Format
    ```
    POST /api/jobs/{job_id}/apply/
    Content-Type: multipart/form-data
    
    {
        "cover_letter": "My qualifications and interest in this position...",
        "resume": <binary_file_data>
    }
    ```
    
    ### Response Format (Success)
    ```
    HTTP 201 Created
    {
        "id": 123,
        "job": 456,
        "applicant": 789,
        "status": "applied",
        "cover_letter": "My qualifications and interest in this position...",
        "resume": "/media/resumes/2023/01/01/resume_123.pdf",
        "applied_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z"
    }
    ```
    
    ### Error Responses
    - 400 Bad Request: Invalid input data or already applied
    - 401 Unauthorized: Authentication credentials not provided
    - 403 Forbidden: User is an employer (not allowed to apply)
    - 404 Not Found: Job not found or not active
    - 500 Internal Server Error: Server error during processing
    """
    
    # Only allow authenticated job seekers (non-employers) to apply for jobs
    permission_classes: List[Type[BasePermission]] = [IsAuthenticated, ~IsEmployer]
    serializer_class: Type[JobApplicationSerializer] = JobApplicationSerializer
    
    @extend_schema(
        operation_id="job_application_create",
        summary="Apply for a job",
        description="Submit an application for the specified job posting.",
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'cover_letter': {
                        'type': 'string',
                        'description': 'The cover letter content',
                        'example': 'I am excited to apply for this position because...'
                    },
                    'resume': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Resume file (PDF, DOC, or DOCX)'
                    }
                },
                'required': ['cover_letter']
            }
        },
        responses={
            201: OpenApiResponse(
                response=JobApplicationSerializer,
                description="Application submitted successfully"
            ),
            400: OpenApiResponse(
                description="Invalid input or already applied",
                examples={
                    'application/json': {
                        'detail': 'You have already applied to this job.'
                    }
                }
            ),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(
                description="User is an employer",
                examples={
                    'application/json': {
                        'detail': 'Employers cannot apply for jobs.'
                    }
                }
            ),
            404: OpenApiResponse(
                description="Job not found or not active",
                examples={
                    'application/json': {
                        'detail': 'Job not found or not accepting applications.'
                    }
                }
            ),
            500: OpenApiResponse(description="Internal server error")
        },
        tags=["Job Applications"]
    )
    def post(self, request: Request, job_id: int, *args: Any, **kwargs: Any) -> Response:
        """
        Handle POST request to create a new job application.
        
        Args:
            request: The HTTP request object containing application data
            job_id: The ID of the job to apply for
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: The created job application or error details
            
        Raises:
            Http404: If the job doesn't exist or is not active
            PermissionDenied: If the user is not allowed to apply
            ValidationError: If the application data is invalid
            Exception: For unexpected errors during processing
        """
        # Log the incoming request
        logger.info(
            "Job application request received",
            extra={
                'job_id': job_id,
                'user_id': request.user.id,
                'has_resume': 'resume' in request.FILES
            }
        )
        
        # Get the job or return 404 if not found/inactive
        try:
            job: Job = Job.objects.select_related('company').get(id=job_id, is_active=True)
            logger.info("Found active job", {'job_id': job.id, 'title': job.title})
        except Job.DoesNotExist:
            error_msg = f"Job not found or not active. Job ID: {job_id}"
            logger.warning(error_msg)
            return Response(
                {"detail": "Job not found or not accepting applications."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check application deadline
        current_time = timezone.now()
        if job.application_deadline and current_time > job.application_deadline:
            error_msg = f"Application deadline has passed for job {job.id}"
            logger.warning(error_msg)
            return Response(
                {"detail": "The application deadline for this job has passed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            error_msg = f"User {request.user.id} already applied to job {job.id}"
            logger.warning(error_msg)
            return Response(
                {"detail": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare application data
        application_data: Dict[str, Any] = {
            'job': job.id,
            'applicant': request.user.id,
            'status': 'applied',
            'cover_letter': request.data.get('cover_letter', '').strip(),
            'resume': request.FILES.get('resume')
        }
        
        # Log the application data (safely)
        log_data = {
            'job_id': job.id,
            'applicant_id': request.user.id,
            'has_resume': bool(application_data['resume']),
            'cover_letter_length': len(application_data['cover_letter'])
        }
        logger.info("Processing job application", log_data)
        
        # Validate and save the application
        serializer: JobApplicationSerializer = self.serializer_class(
            data=application_data,
            context={
                'request': request,
                'job': job,
                'user': request.user
            }
        )
        
        if not serializer.is_valid():
            logger.warning(
                "Validation failed for job application",
                {'errors': serializer.errors, 'user_id': request.user.id, 'job_id': job.id}
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Save the application
            application: JobApplication = serializer.save(
                job=job,
                applicant=request.user,
                status='applied'
            )
            
            # Log successful application
            logger.info(
                "Job application created successfully",
                {'application_id': application.id, 'job_id': job.id, 'user_id': request.user.id}
            )
            
            # Send notification to employer (in background task)
            self._notify_employer(application)
            
            # Return the created application
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
            
        except Exception as e:
            # Log the error with full context
            logger.error(
                f"Error creating job application: {str(e)}",
                exc_info=True,
                extra={
                    'job_id': job.id,
                    'user_id': request.user.id,
                    'error_type': type(e).__name__
                }
            )
            
            # Return a generic error message (don't expose internal details)
            return Response(
                {"detail": "An unexpected error occurred while processing your application."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _notify_employer(self, application: JobApplication) -> None:
        """
        Send notification to employer about the new application.
        
        This method is called asynchronously after a successful application.
        
        Args:
            application: The created JobApplication instance
        """
        try:
            # In a production environment, this would trigger an email or notification
            # For now, just log the notification
            logger.info(
                "Sending notification to employer about new application",
                {
                    'application_id': application.id,
                    'job_id': application.job.id,
                    'job_title': application.job.title,
                    'applicant_name': str(application.applicant.get_full_name() or application.applicant.email),
                    'employer_id': application.job.company.owner.id
                }
            )
            
            # Example of sending an email (commented out for reference)
            # from django.core.mail import send_mail
            # send_mail(
            #     subject=f"New Application for {application.job.title}",
            #     message=f"{application.applicant.get_full_name()} has applied to your job.",
            #     from_email="noreply@careeropen.com",
            #     recipient_list=[application.job.company.owner.email],
            #     fail_silently=True
            # )
            
        except Exception as e:
            # Don't fail the application if notification fails
            logger.error(
                "Failed to send employer notification",
                exc_info=True,
                extra={'application_id': application.id if application else None}
            )
    
    def get_success_headers(self, data: Dict[str, Any]) -> Dict[str, str]:
        """
        Return the Location header for the newly created resource.
        
        Args:
            data: The serialized data of the created resource
            
        Returns:
            Dict containing the Location header
        """
        try:
            return {'Location': str(data.get('url', ''))}
        except (TypeError, KeyError):
            return {}


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing job categories with comprehensive CRUD operations.
    
    This viewset provides a complete interface for managing job categories with features including:
    - Full CRUD operations (admin only)
    - Advanced filtering, search, and ordering
    - Caching for improved performance
    - Featured categories functionality
    - Job listings by category
    
    ### Authentication
    - Read operations: Public (no authentication required)
    - Write operations: Admin users only
    
    ### Filtering
    - `is_active` (bool): Filter by active status
    - `is_featured` (bool): Filter featured categories
    - `created_at` (date): Filter by creation date
    - `updated_at` (date): Filter by last update date
    - `include_job_count` (bool): Include job count in response
    
    ### Searching
    Search is available on these fields:
    - `name`: Category name
    - `description`: Category description
    - `keywords`: Associated keywords
    
    ### Ordering
    Results can be ordered by:
    - `name`: Alphabetical order
    - `created_at`: Creation date
    - `updated_at`: Last update date
    - `display_order`: Custom display order
    - `job_count`: Number of active jobs (if included)
    """
    
    # Class attributes with type hints
    queryset: QuerySet[Category] = Category.objects.all().order_by('name')
    serializer_class: Type[CategorySerializer] = CategorySerializer
    pagination_class: Type[PageNumberPagination] = StandardResultsSetPagination
    filter_backends: List[Type[BaseFilterBackend]] = [
        filters.SearchFilter, 
        filters.OrderingFilter, 
        DjangoFilterBackend
    ]
    search_fields: List[str] = ['name', 'description', 'keywords']
    filterset_fields: Dict[str, List[str]] = {
        'is_active': ['exact'],
        'created_at': ['date', 'gte', 'lte'],
        'updated_at': ['date', 'gte', 'lte'],
    }
    ordering_fields: List[str] = [
        'name', 'created_at', 'updated_at', 'display_order', 'job_count'
    ]
    ordering: List[str] = ['display_order', 'name']
    permission_classes: List[Type[BasePermission]] = [IsAdminOrReadOnly]
    lookup_field: str = 'slug'
    lookup_url_kwarg: str = 'slug'
    cache_timeout: int = 60 * 60 * 24  # 24 hours (categories don't change often)
    
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
    API endpoint for managing companies with comprehensive CRUD operations.
    
    This viewset provides a complete interface for managing company profiles with features including:
    - Full CRUD operations with proper permission checks
    - Advanced filtering, search, and ordering
    - Caching for improved performance
    - Company verification system
    - Featured companies functionality
    
    ### Authentication
    - Read operations: Public for verified companies
    - Create: Authenticated employers only
    - Update/Delete: Company owners or admin only
    - Verification: Admin only
    
    ### Filtering
    - `industry` (str): Filter by industry (exact match or contains)
    - `company_size` (str): Filter by company size (exact match or in list)
    - `is_verified` (bool): Filter by verification status
    - `is_featured` (bool): Filter featured companies
    - `founded_year` (int): Filter by year founded (exact, gte, lte)
    - `headquarters` (str): Filter by headquarters location (exact or contains)
    - `created_at` (date): Filter by creation date (date, gte, lte)
    
    ### Searching
    Search is available on these fields:
    - `name`: Company name
    - `description`: Company description
    - `industry`: Industry sector
    - `headquarters`: Location of headquarters
    - `website`: Company website
    - `tagline`: Company tagline
    - `specialties`: Company specialties
    
    ### Ordering
    Results can be ordered by:
    - `name`: Company name (default)
    - `created_at`: Creation date
    - `updated_at`: Last update date
    - `founded_year`: Year company was founded
    - `company_size`: Size of the company
    
    ### Example Requests
    ```
    # List all verified companies
    GET /api/companies/?is_verified=true
    
    # Search for companies in the tech industry
    GET /api/companies/?search=technology&industry=Technology
    
    # Get featured companies
    GET /api/companies/featured/
    
    # Get companies created by the current user
    GET /api/companies/my_companies/
    ```
    """
    
    # Class attributes with type hints
    queryset: QuerySet[Company] = Company.objects.all().order_by('name')
    serializer_class: Type[CompanySerializer] = CompanySerializer
    pagination_class: Type[PageNumberPagination] = StandardResultsSetPagination
    filter_backends: List[Type[BaseFilterBackend]] = [
        filters.SearchFilter, 
        filters.OrderingFilter, 
        DjangoFilterBackend
    ]
    search_fields: List[str] = [
        'name', 'description', 'industry', 'headquarters', 'website',
        'tagline', 'specialties'
    ]
    filterset_fields: Dict[str, List[str]] = {
        'industry': ['exact', 'icontains'],
        'company_size': ['exact', 'in'],
        'is_verified': ['exact'],
        'founded_year': ['exact', 'gte', 'lte'],
        'created_at': ['date', 'gte', 'lte'],
        'headquarters': ['exact', 'icontains']
    }
    ordering_fields: List[str] = [
        'name', 'created_at', 'updated_at', 'founded_year', 'company_size'
    ]
    ordering: List[str] = ['name']
    permission_classes: List[Type[BasePermission]] = [IsAuthenticated, IsCompanyOwnerOrReadOnly]
    lookup_field: str = 'slug'
    lookup_url_kwarg: str = 'slug'
    cache_timeout: int = 60 * 30  # 30 minutes

    def get_permissions(self) -> List[BasePermission]:
        """
        Get the list of permissions required for different actions.
        
        Returns:
            List[BasePermission]: List of permission instances based on the action
            
        Permission Rules:
        - Create: Authenticated employers only
        - Update/Delete: Company owners or admin only
        - My Companies/Verify/Unverify: Authenticated employers or admin
        - Featured: Public endpoint (no authentication required)
        - All other actions: Authenticated users only
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
    
    def get_queryset(self) -> QuerySet[Company]:
        """
        Get the queryset of companies with filtering based on user role and request parameters.
        
        Returns:
            QuerySet[Company]: Filtered queryset of companies
            
        Filtering Rules:
        - Non-authenticated users: Only see verified and active companies
        - Admin users: See all companies
        - Employers: See their own companies and all verified companies
        - Regular users: See only verified and active companies
        
        Query Parameters:
        - is_featured (bool): Filter by featured status
        - Other filters defined in filterset_fields
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
    
    def get_serializer_context(self) -> Dict[str, Any]:
        """
        Get the serializer context with additional data.
        
        Returns:
            Dict containing the serializer context with the current request
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @extend_schema(
        operation_id="company_list",
        summary="List all companies",
        description="Returns a paginated list of companies with optional filtering and search.",
        parameters=[
            OpenApiParameter(
                name='is_featured',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Filter by featured status',
                required=False
            ),
            OpenApiParameter(
                name='is_verified',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Filter by verification status',
                required=False
            ),
            OpenApiParameter(
                name='industry',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filter by industry (exact match or contains)',
                required=False
            ),
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Search term for name, description, industry, etc.',
                required=False
            ),
            OpenApiParameter(
                name='ordering',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Which field to use when ordering the results',
                required=False
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=CompanySerializer(many=True),
                description="List of companies"
            ),
            400: OpenApiResponse(description="Invalid filter parameters"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
        },
        tags=["Companies"]
    )
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        List all companies with caching and advanced filtering.
        
        This endpoint returns a paginated list of companies with support for:
        - Full-text search across multiple fields
        - Filtering by various company attributes
        - Custom ordering
        - Caching for improved performance
        
        Args:
            request: The HTTP request object
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: Paginated list of companies
            
        Example:
            GET /api/companies/?is_verified=true&ordering=-created_at
        """
        try:
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
            
        except Exception as e:
            logger.error(
                f"Error listing companies: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while fetching companies.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_retrieve",
        summary="Retrieve a company",
        description="Returns the details of a specific company by its slug.",
        responses={
            200: CompanySerializer,
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="Not authorized to view this company"),
            404: OpenApiResponse(description="Company not found"),
        },
        tags=["Companies"]
    )
    @method_decorator(cache_page(cache_timeout))
    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Retrieve a company with caching and permission checks.
        
        Args:
            request: The HTTP request object
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments including the company slug
            
        Returns:
            Response: The requested company details
            
        Raises:
            Http404: If the company is not found or not accessible
        """
        try:
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
            
        except Company.DoesNotExist:
            logger.warning(
                f"Company not found: {kwargs.get('slug')}",
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            raise Http404("Company not found")
        except PermissionDenied as e:
            logger.warning(
                f"Permission denied accessing company {kwargs.get('slug')}: {str(e)}",
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            raise
        except Exception as e:
            logger.error(
                f"Error retrieving company {kwargs.get('slug')}: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while fetching the company details.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_my_companies",
        summary="List companies created by the current user",
        description="Returns a list of companies created by the currently authenticated employer.",
        responses={
            200: CompanySerializer(many=True),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="User is not an employer"),
        },
        tags=["Companies"]
    )
    @action(detail=False, methods=['get'])
    def my_companies(self, request: Request) -> Response:
        """
        List all companies created by the current authenticated employer.
        
        This endpoint is only accessible to employers and returns a paginated list 
        of companies they have created.
        
        Args:
            request: The HTTP request object
            
        Returns:
            Response: Paginated list of companies created by the current user
            
        Raises:
            PermissionDenied: If the user is not an employer
        """
        try:
            if not hasattr(request.user, 'is_employer') or not request.user.is_employer:
                raise PermissionDenied("Only employers can view their companies.")
                
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
                
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(
                f"Error fetching user's companies: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while fetching your companies.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_verify",
        summary="Verify a company",
        description="Mark a company as verified (admin only).",
        responses={
            200: CompanySerializer,
            400: OpenApiResponse(description="Company is already verified"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="User is not authorized to verify companies"),
            404: OpenApiResponse(description="Company not found"),
        },
        tags=["Companies"]
    )
    @action(detail=True, methods=['post'])
    def verify(self, request: Request, slug: Optional[str] = None) -> Response:
        """
        Mark a company as verified.
        
        This action can only be performed by admin users. It updates the company's
        verification status and records who verified it and when.
        
        Args:
            request: The HTTP request object
            slug: The slug of the company to verify
            
        Returns:
            Response: The updated company data
            
        Raises:
            Http404: If the company is not found
            PermissionDenied: If the user is not authorized to verify companies
        """
        try:
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
            
            logger.info(
                f"Company '{company.name}' verified by {request.user.email}",
                extra={'company_id': company.id, 'user_id': request.user.id}
            )
            
            serializer = self.get_serializer(company)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(
                f"Error verifying company {slug}: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while verifying the company.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_unverify",
        summary="Unverify a company",
        description="Mark a company as unverified (admin only).",
        responses={
            200: CompanySerializer,
            400: OpenApiResponse(description="Company is not verified"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="User is not authorized to unverify companies"),
            404: OpenApiResponse(description="Company not found"),
        },
        tags=["Companies"]
    )
    @action(detail=True, methods=['post'])
    def unverify(self, request: Request, slug: Optional[str] = None) -> Response:
        """
        Mark a company as unverified.
        
        This action can only be performed by admin users. It revokes the company's
        verified status and clears the verification metadata.
        
        Args:
            request: The HTTP request object
            slug: The slug of the company to unverify
            
        Returns:
            Response: The updated company data
            
        Raises:
            Http404: If the company is not found
            PermissionDenied: If the user is not authorized to unverify companies
        """
        try:
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
            
            logger.info(
                f"Company '{company.name}' unverified by {request.user.email}",
                extra={'company_id': company.id, 'user_id': request.user.id}
            )
            
            serializer = self.get_serializer(company)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(
                f"Error unverifying company {slug}: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while unverifying the company.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_feature",
        summary="Feature a company",
        description="Mark a company as featured (admin only).",
        responses={
            200: CompanySerializer,
            400: OpenApiResponse(description="Company is already featured"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="User is not authorized to feature companies"),
            404: OpenApiResponse(description="Company not found"),
        },
        tags=["Companies"]
    )
    @action(detail=True, methods=['post'])
    def feature(self, request: Request, slug: Optional[str] = None) -> Response:
        """
        Mark a company as featured.
        
        This action can only be performed by admin users. It marks the company as
        featured and records who featured it and when.
        
        Args:
            request: The HTTP request object
            slug: The slug of the company to feature
            
        Returns:
            Response: The updated company data
            
        Raises:
            Http404: If the company is not found
            PermissionDenied: If the user is not authorized to feature companies
        """
        try:
            company = self.get_object()
            
            if company.is_featured:
                return Response(
                    {'detail': 'This company is already featured.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            company.is_featured = True
            company.featured_at = timezone.now()
            company.featured_by = request.user
            company.save()
            
            # Clear cache for this company and featured list
            cache.delete(f'company_detail_{company.slug}')
            cache.delete('featured_companies')
            
            logger.info(
                f"Company '{company.name}' featured by {request.user.email}",
                extra={'company_id': company.id, 'user_id': request.user.id}
            )
            
            serializer = self.get_serializer(company)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(
                f"Error featuring company {slug}: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while featuring the company.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_unfeature",
        summary="Unfeature a company",
        description="Remove a company from the featured list (admin only).",
        responses={
            200: CompanySerializer,
            400: OpenApiResponse(description="Company is not featured"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            403: OpenApiResponse(description="User is not authorized to unfeature companies"),
            404: OpenApiResponse(description="Company not found"),
        },
        tags=["Companies"]
    )
    @action(detail=True, methods=['post'])
    def unfeature(self, request: Request, slug: Optional[str] = None) -> Response:
        """
        Remove a company from the featured list.
        
        This action can only be performed by admin users. It removes the company's
        featured status and clears the featured metadata.
        
        Args:
            request: The HTTP request object
            slug: The slug of the company to unfeature
            
        Returns:
            Response: The updated company data
            
        Raises:
            Http404: If the company is not found
            PermissionDenied: If the user is not authorized to unfeature companies
        """
        try:
            if not request.user.is_staff:
                raise PermissionDenied("Only administrators can perform this action.")
                
            company = self.get_object()
            
            if not company.is_featured:
                return Response(
                    {'detail': 'This company is not featured.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            company.is_featured = False
            company.featured_at = None
            company.featured_by = None
            company.save()
            
            # Clear cache for this company and featured list
            cache.delete(f'company_detail_{company.slug}')
            cache.delete('featured_companies')
            
            logger.info(
                f"Company '{company.name}' unfeatured by {request.user.email}",
                extra={'company_id': company.id, 'user_id': request.user.id}
            )
            
            serializer = self.get_serializer(company)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(
                f"Error unfeaturing company {slug}: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while unfeaturing the company.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        operation_id="company_featured_list",
        summary="List featured companies",
        description="Returns a list of featured and verified companies (public endpoint).",
        parameters=[
            OpenApiParameter(
                name='page',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Page number',
                required=False
            ),
            OpenApiParameter(
                name='page_size',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of results per page',
                required=False
            ),
        ],
        responses={
            200: CompanySerializer(many=True),
        },
        tags=["Companies"]
    )
    @method_decorator(cache_page(60 * 60 * 2))  # Cache for 2 hours
    @action(detail=False, methods=['get'])
    def featured(self, request: Request) -> Response:
        """
        List all featured and verified companies.
        
        This is a public endpoint that returns a paginated list of companies
        that are both featured and verified. The results are cached for 2 hours.
        
        Args:
            request: The HTTP request object
            
        Returns:
            Response: Paginated list of featured companies
        """
        try:
            # Try to get from cache first
            cache_key = 'featured_companies_list'
            cached_response = cache.get(cache_key)
            
            if cached_response is not None:
                return Response(cached_response)
            
            queryset = self.filter_queryset(
                self.get_queryset().filter(
                    is_featured=True, 
                    is_verified=True, 
                    is_active=True
                )
            )
            
            # Apply pagination
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response_data = self.get_paginated_response(serializer.data).data
                # Cache the paginated response
                cache.set(cache_key, response_data, 60 * 60 * 2)  # 2 hours
                return Response(response_data)
                
            serializer = self.get_serializer(queryset, many=True)
            response_data = serializer.data
            # Cache the response
            cache.set(cache_key, response_data, 60 * 60 * 2)  # 2 hours
            return Response(response_data)
            
        except Exception as e:
            logger.error(
                f"Error listing featured companies: {str(e)}",
                exc_info=True,
                extra={'user_id': request.user.id if request.user.is_authenticated else None}
            )
            return Response(
                {'detail': 'An error occurred while fetching featured companies.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def perform_create(self, serializer: CompanySerializer) -> None:
        """
        Create a new company with the current user as the creator.
        
        This method is called when a new company is created through the API.
        It sets the created_by field to the current user and optionally
        auto-verifies the company if the user is an admin.
        
        Args:
            serializer: The company serializer instance
            
        Returns:
            None
        """
        try:
            company = serializer.save(created_by=self.request.user)
            
            # If the user is an admin, auto-verify the company
            if self.request.user.is_staff:
                company.is_verified = True
                company.verified_at = timezone.now()
                company.verified_by = self.request.user
                company.save()
                
                logger.info(
                    f"Admin-created company '{company.name}' auto-verified by {self.request.user.email}",
                    extra={'company_id': company.id, 'user_id': self.request.user.id}
                )
                
        except Exception as e:
            logger.error(
                f"Error creating company: {str(e)}",
                exc_info=True,
                extra={'user_id': self.request.user.id if self.request.user.is_authenticated else None}
            )
            raise
    
    def perform_update(self, serializer: CompanySerializer) -> None:
        """
        Update a company with proper cache invalidation.
        
        This method is called when a company is updated through the API.
        It clears the company's cache to ensure fresh data is served.
        
        Args:
            serializer: The company serializer instance
            
        Returns:
            None
        """
        try:
            instance = serializer.save()
            
            # Clear cache for this company and featured list
            cache.delete(f'company_detail_{instance.slug}')
            cache.delete('featured_companies')
            
            logger.info(
                f"Company '{instance.name}' updated by {self.request.user.email}",
                extra={'company_id': instance.id, 'user_id': self.request.user.id}
            )
            
        except Exception as e:
            logger.error(
                f"Error updating company: {str(e)}",
                exc_info=True,
                extra={'user_id': self.request.user.id if self.request.user.is_authenticated else None}
            )
            raise
    
    def perform_destroy(self, instance: Company) -> None:
        """
        Delete a company and clear its cache.
        
        This method is called when a company is deleted through the API.
        It clears the company's cache and logs the deletion.
        
        Args:
            instance: The company instance being deleted
            
        Returns:
            None
        """
        try:
            company_slug = instance.slug
            company_name = instance.name
            user_email = self.request.user.email if self.request.user.is_authenticated else 'anonymous'
            
            # Clear cache for this company and featured list
            cache.delete(f'company_detail_{company_slug}')
            cache.delete('featured_companies')
            
            instance.delete()
            
            logger.info(
                f"Company '{company_name}' deleted by {user_email}",
                extra={'company_slug': company_slug}
            )
            
        except Exception as e:
            logger.error(
                f"Error deleting company: {str(e)}",
                exc_info=True,
                extra={'user_id': self.request.user.id if self.request.user.is_authenticated else None}
            )
            raise


class UserJobApplicationsView(generics.ListAPIView):
    """
    API endpoint that allows users to view their job applications.
    
    This endpoint requires authentication and will return a paginated list of 
    job applications for the currently authenticated user.
    
    ### Permissions
    - User must be authenticated
    
    ### Query Parameters
    - `status` (str, optional): Filter applications by status (e.g., 'applied', 'interview', 'offer', 'rejected')
    - `job` (int, optional): Filter by job ID
    - `applied_at` (date, optional): Filter by application date (supports exact date, gte, lte)
    - `ordering` (str, optional): Order results by field (e.g., 'applied_at', '-applied_at')
    - `page` (int, optional): Page number for pagination
    - `page_size` (int, optional): Number of results per page (default: 10, max: 100)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
            'status': ['exact', 'in'],
            'job': ['exact'],
            'applied_at': ['date', 'gte', 'lte'],
        }
    ordering_fields = ['applied_at', 'updated_at', 'status']
    ordering = ['-applied_at']

    @extend_schema(
        operation_id='list_user_job_applications',
        description='List all job applications for the current user',
        parameters=[
            OpenApiParameter(
                name='status', 
                type=OpenApiTypes.STR, 
                location=OpenApiParameter.QUERY,
                description='Filter by application status',
                required=False
            ),
            OpenApiParameter(
                name='job', 
                type=OpenApiTypes.INT, 
                location=OpenApiParameter.QUERY,
                description='Filter by job ID',
                required=False
            ),
            OpenApiParameter(
                name='applied_at', 
                type=OpenApiTypes.DATE, 
                location=OpenApiParameter.QUERY,
                description='Filter by application date (YYYY-MM-DD)',
                required=False
            ),
            OpenApiParameter(
                name='ordering', 
                type=OpenApiTypes.STR, 
                location=OpenApiParameter.QUERY,
                description='Which field to use when ordering the results',
                required=False
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=JobApplicationSerializer(many=True),
                description='List of job applications',
                examples={
                    'application/json': [
                        {
                            'id': 1,
                            'job': 1,
                            'applicant': 1,
                            'status': 'applied',
                            'cover_letter': 'I am very interested in this position...',
                            'resume': '/media/resumes/example.pdf',
                            'applied_at': '2023-01-01T12:00:00Z',
                            'updated_at': '2023-01-01T12:00:00Z'
                        }
                    ]
                }
            ),
            401: OpenApiResponse(
                response={"detail": "Authentication credentials were not provided."},
                description="Authentication credentials were not provided"
            ),
            403: OpenApiResponse(
                response={"detail": "You do not have permission to access this resource."},
                description="You do not have permission to access this resource"
            ),
        }
    )
    def get(self, request, *args, **kwargs):
        """
        Handle GET request to list job applications.
        
        Returns a paginated list of job applications for the current user,
        with optional filtering and ordering.
        """
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """
        Get the list of job applications for the current user.
        
        Returns:
            QuerySet: Filtered and ordered queryset of job applications
            
        Raises:
            NotAuthenticated: If user is not authenticated
        """
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
            
        try:
            # Only return applications for the current user
            queryset = JobApplication.objects.filter(
                applicant_id=self.request.user.id
            ).select_related(
                'job',
                'job__company',
                'resume'  # If using a resume model
            ).order_by('-applied_at')
            
            # Apply additional filters from query parameters
            status = self.request.query_params.get('status')
            if status:
                queryset = queryset.filter(status__iexact=status)
                
            job_id = self.request.query_params.get('job')
            if job_id:
                queryset = queryset.filter(job_id=job_id)
                
            return queryset
            
        except Exception as e:
            logger.error(f"Error retrieving job applications: {str(e)}", 
                       exc_info=True, 
                       extra={
                           'user_id': self.request.user.id if self.request.user.is_authenticated else None,
                           'status': self.request.query_params.get('status'),
                           'job_id': self.request.query_params.get('job')
                       })
            # Return an empty queryset on error rather than raising an exception
            return JobApplication.objects.none()


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
