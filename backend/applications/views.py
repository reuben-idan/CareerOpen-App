from rest_framework import generics, permissions
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer
from core.permissions import IsOwnerOrReadOnly

class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'recruiter':
            return Application.objects.filter(job__posted_by=user)
        return Application.objects.filter(applicant=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsOwnerOrReadOnly]