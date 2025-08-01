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
    Serializer for job search queries with advanced filtering options.
    """
    # Search and filter fields
    search = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text="Search term to filter jobs by title, description, company, or location"
    )
    location = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text="Filter by job location (exact match or contains)"
    )
    job_type = serializers.MultipleChoiceField(
        choices=Job.JOB_TYPE_CHOICES,
        required=False,
        help_text="Filter by one or more job types (comma-separated)"
    )
    salary_min = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        min_value=0,
        help_text="Filter by minimum salary"
    )
    salary_max = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        min_value=0,
        help_text="Filter by maximum salary"
    )
    is_remote = serializers.BooleanField(
        required=False,
        allow_null=True,
        help_text="Filter remote jobs (true/false)"
    )
    posted_after = serializers.DateField(
        required=False,
        help_text="Filter jobs posted after this date (YYYY-MM-DD)"
    )
    company = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Filter by company name (exact match or contains)"
    )
    skills = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Comma-separated list of skills to search for"
    )
    ordering = serializers.ChoiceField(
        choices=[
            ('created_at', 'Created At (ascending)'),
            ('-created_at', 'Created At (descending)'),
            ('title', 'Title (A-Z)'),
            ('-title', 'Title (Z-A)'),
            ('company', 'Company (A-Z)'),
            ('-company', 'Company (Z-A)'),
            ('salary_min', 'Salary (low to high)'),
            ('-salary_min', 'Salary (high to low)')
        ],
        required=False,
        default='-created_at',
        help_text="Field to order results by (prefix with '-' for descending)"
    )
    page = serializers.IntegerField(
        required=False,
        min_value=1,
        default=1,
        help_text="Page number for pagination"
    )
    page_size = serializers.IntegerField(
        required=False,
        min_value=1,
        max_value=100,
        default=10,
        help_text="Number of results per page (max 100)"
    )

    def validate_job_type(self, value):
        """Convert comma-separated string to list if needed."""
        if isinstance(value, str):
            return [v.strip() for v in value.split(',') if v.strip()]
        return value

    def validate_skills(self, value):
        """Convert comma-separated skills to list."""
        if isinstance(value, str):
            return [v.strip().lower() for v in value.split(',') if v.strip()]
        return value

    def validate(self, data):
        """
        Validate the search parameters.
        """
        validated_data = super().validate(data)
        
        # Validate salary range
        salary_min = validated_data.get('salary_min')
        salary_max = validated_data.get('salary_max')
        
        if salary_min is not None and salary_max is not None and salary_min > salary_max:
            raise serializers.ValidationError({
                'salary_min': 'Minimum salary cannot be greater than maximum salary.'
            })
            
        # Validate posted_after date
        posted_after = validated_data.get('posted_after')
        if posted_after and hasattr(posted_after, 'strftime'):
            from django.utils import timezone
            if posted_after > timezone.now().date():
                raise serializers.ValidationError({
                    'posted_after': 'Cannot filter by future dates.'
                })
        
        return validated_data
        return data
