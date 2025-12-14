from rest_framework import serializers
from .models import Job, JobView
from companies.serializers import CompanySerializer

class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    posted_by = serializers.StringRelatedField(read_only=True)
    applications_count = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['posted_by', 'created_at', 'updated_at']
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_views_count(self, obj):
        return obj.views.count()

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ['posted_by', 'created_at', 'updated_at']