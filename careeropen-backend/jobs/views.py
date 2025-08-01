from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer, JobSearchSerializer
from .permissions import IsJobOwnerOrReadOnly, IsApplicationOwnerOrReadOnly

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class JobViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows jobs to be viewed or edited.
    """
    queryset = Job.objects.all().order_by('-created_at')
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
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsJobOwnerOrReadOnly]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Set the job poster to the current user
        serializer.save(poster=self.request.user)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """
        Custom action to apply for a job.
        """
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
        
        # Create the application
        application = JobApplication.objects.create(
            job=job,
            applicant=request.user,
            status='applied',
            cover_letter=request.data.get('cover_letter', '')
        )
        
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class JobSearchView(APIView):
    """
    Advanced job search endpoint.
    """
    serializer_class = JobSearchSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'location', 'is_active']
    search_fields = ['title', 'description', 'company', 'location']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']

    def get_queryset(self):
        return Job.objects.filter(is_active=True)

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = JobSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class JobApplicationCreateView(APIView):
    """
    Create a job application.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response(
                {"detail": "Job not found or not accepting applications."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {"detail": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job, applicant=request.user, status='applied')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserJobApplicationsView(APIView):
    """
    List all job applications for the current user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return JobApplication.objects.filter(applicant=self.request.user)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


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
