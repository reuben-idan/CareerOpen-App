from datetime import datetime
from rest_framework import serializers
from django.utils import timezone
from .models import Job, JobApplication, Category, Company
from accounts.serializers import UserProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for the Company model.
    """
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'slug', 'description', 'website', 'logo', 'industry',
            'founded_year', 'company_size', 'headquarters', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'is_verified', 'created_at', 'updated_at']
    
    def validate_logo(self, value):
        """
        Validate the uploaded logo file.
        """
        if value and value.size > 2 * 1024 * 1024:  # 2MB max
            raise serializers.ValidationError("Logo file too large (max 2MB).")
        return value
    
    def create(self, validated_data):
        """
        Set the company creator to the current user.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)

class JobSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for the Job model with comprehensive validation and additional fields.
    """
    poster = UserProfileSerializer(read_only=True)
    has_applied = serializers.SerializerMethodField()
    application_count = serializers.IntegerField(read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.SerializerMethodField()
    categories_detail = CategorySerializer(source='categories', many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'slug', 'description', 'requirements', 'responsibilities',
            'company', 'company_name', 'company_logo', 'categories', 'categories_detail',
            'job_type', 'location', 'is_remote', 'salary_min', 'salary_max',
            'salary_currency', 'status', 'is_active', 'application_deadline',
            'application_url', 'created_at', 'updated_at', 'published_at', 'closed_at',
            'poster', 'has_applied', 'application_count', 'is_owner'
        ]
        read_only_fields = [
            'id', 'slug', 'created_at', 'updated_at', 'published_at', 'closed_at',
            'poster', 'has_applied', 'application_count', 'is_owner', 'company_name',
            'company_logo', 'categories_detail'
        ]
        extra_kwargs = {
            'company': {'required': True},
            'application_deadline': {
                'input_formats': ['%Y-%m-%dT%H:%M:%S', 'iso-8601'],
                'help_text': 'Format: YYYY-MM-DDTHH:MM:SS or ISO-8601'
            }
        }

    def get_has_applied(self, obj):
        """Check if the current user has applied to this job."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(applicant=request.user).exists()
        return False

    def get_company_logo(self, obj):
        """Get the absolute URL of the company logo if it exists."""
        if obj.company and obj.company.logo:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.company.logo.url)
            return obj.company.logo.url
        return None

    def get_is_owner(self, obj):
        """Check if the current user is the owner of the job."""
        request = self.context.get('request')
        return request and request.user == obj.poster

    def validate_application_deadline(self, value):
        """Ensure application deadline is in the future."""
        if value and value < timezone.now():
            raise serializers.ValidationError("Application deadline must be in the future.")
        return value

    def validate_salary(self, data):
        """Validate that salary_max is greater than or equal to salary_min."""
        if data.get('salary_min') and data.get('salary_max'):
            if data['salary_min'] > data['salary_max']:
                raise serializers.ValidationError({
                    'salary_max': 'Maximum salary must be greater than or equal to minimum salary.'
                })
        return data

    def create(self, validated_data):
        """Create a new job with the current user as the poster."""
        # Set the poster to the current user
        validated_data['poster'] = self.context['request'].user
        
        # Set published_at if the job is being published
        if validated_data.get('status') == Job.PUBLISHED:
            validated_data['published_at'] = timezone.now()
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update a job with proper status tracking."""
        # Handle status changes
        if 'status' in validated_data:
            new_status = validated_data['status']
            
            # If changing to published and not already published
            if new_status == Job.PUBLISHED and instance.status != Job.PUBLISHED:
                validated_data['published_at'] = timezone.now()
            
            # If changing to closed and not already closed
            elif new_status == Job.CLOSED and instance.status != Job.CLOSED:
                validated_data['closed_at'] = timezone.now()
        
        return super().update(instance, validated_data)


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
            'id', 'job', 'applicant', 'cover_letter', 'resume', 'status', 'applied_at',
            'updated_at', 'job_title', 'company_name'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'updated_at', 'job_title', 'company_name']
    
    def validate_resume(self, value):
        """
        Validate the uploaded resume file.
        """
        import os
        from django.core.exceptions import ValidationError
        
        if value:
            # Check file size (5MB max)
            max_size = 5 * 1024 * 1024  # 5MB in bytes
            if value.size > max_size:
                raise serializers.ValidationError("File size must be no more than 5MB.")
            
            # Check file extension
            valid_extensions = ['.pdf', '.doc', '.docx']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError("Unsupported file type. Please upload a PDF, DOC, or DOCX file.")
        
        return value

    def create(self, validated_data):
        """
        Create and return a new JobApplication instance, given the validated data.
        The 'applicant' should be provided in the validated_data by the view.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Creating JobApplication with validated_data: {validated_data}")
        
        # Log all required fields
        required_fields = ['job', 'applicant', 'status']
        for field in required_fields:
            field_value = validated_data.get(field, "NOT PROVIDED")
            logger.info(f"{field}: {field_value}")
        
        # Check for required fields
        missing_fields = [field for field in required_fields if field not in validated_data]
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.error(error_msg)
            raise serializers.ValidationError({"detail": error_msg})
        
        try:
            instance = super().create(validated_data)
            logger.info(f"Successfully created JobApplication with ID: {instance.id}")
            return instance
        except Exception as e:
            logger.error(f"Error creating JobApplication: {str(e)}", exc_info=True)
            raise


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
