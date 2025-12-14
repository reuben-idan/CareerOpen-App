from rest_framework import serializers
from .models import Company, CompanyMember

class CompanySerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = '__all__'
    
    def get_jobs_count(self, obj):
        return obj.jobs.filter(is_published=True).count()

class CompanyMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    company = CompanySerializer(read_only=True)
    
    class Meta:
        model = CompanyMember
        fields = '__all__'