from rest_framework import generics, filters, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, JobView
from .serializers import JobSerializer, JobCreateSerializer
from core.permissions import IsRecruiterOrReadOnly

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(is_published=True)
    serializer_class = JobSerializer
    permission_classes = [IsRecruiterOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'company']
    search_fields = ['title', 'description', 'skills_required']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsRecruiterOrReadOnly]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Track job view
        JobView.objects.get_or_create(
            job=instance,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR', ''),
        )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)