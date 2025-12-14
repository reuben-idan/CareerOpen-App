from rest_framework import generics
from .models import Company
from .serializers import CompanySerializer
from core.permissions import IsRecruiterOrReadOnly

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.filter(is_active=True)
    serializer_class = CompanySerializer
    permission_classes = [IsRecruiterOrReadOnly]

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsRecruiterOrReadOnly]