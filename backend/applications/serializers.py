from rest_framework import serializers
from .models import Application, ApplicationNote
from jobs.serializers import JobSerializer
from authentication.serializers import UserSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'created_at', 'updated_at']

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        exclude = ['applicant', 'created_at', 'updated_at']

class ApplicationNoteSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = ApplicationNote
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']