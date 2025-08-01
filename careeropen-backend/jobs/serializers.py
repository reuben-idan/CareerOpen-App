from rest_framework import serializers
from .models import Job, JobApplication
from accounts.serializers import UserProfileSerializer

class JobSerializer(serializers.ModelSerializer):
    """
    Serializer for the Job model.
    """
    poster = UserProfileSerializer(read_only=True)
    has_applied = serializers.SerializerMethodField()
    application_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'company', 'location', 'job_type',
            'salary_min', 'salary_max', 'is_active', 'created_at', 'updated_at',
            'poster', 'has_applied', 'application_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'poster', 'has_applied', 'application_count']

    def get_has_applied(self, obj):
        """
        Check if the current user has applied to this job.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(applicant=request.user).exists()
        return False

    def create(self, validated_data):
        """
        Create and return a new Job instance, given the validated data.
        """
        # The poster is set to the current user
        validated_data['poster'] = self.context['request'].user
        return super().create(validated_data)


class JobApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for the JobApplication model.
    """
    applicant = UserProfileSerializer(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'applicant', 'cover_letter', 'status', 'applied_at',
            'updated_at', 'job_title', 'company_name'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'updated_at', 'job_title', 'company_name']

    def create(self, validated_data):
        """
        Create and return a new JobApplication instance, given the validated data.
        """
        # The applicant is set to the current user
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)


class JobSearchSerializer(serializers.Serializer):
    """
    Serializer for job search queries.
    """
    query = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    job_type = serializers.ChoiceField(
        choices=Job.JOB_TYPE_CHOICES,
        required=False,
        allow_blank=True
    )
    salary_min = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=0
    )
    salary_max = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=0
    )

    def validate(self, data):
        """
        Validate that salary_min is less than salary_max if both are provided.
        """
        salary_min = data.get('salary_min')
        salary_max = data.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError(
                "Minimum salary cannot be greater than maximum salary."
            )
            
        return data
