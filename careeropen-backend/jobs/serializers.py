from datetime import datetime
from typing import Any, Dict, List, Optional, Union

from django.core.files.base import File
from django.core.files.uploadedfile import UploadedFile
from django.utils import timezone
from drf_spectacular.utils import extend_schema_field, extend_schema_serializer
from rest_framework import serializers

from accounts.serializers import UserProfileSerializer
from .models import Job, JobApplication, Category, Company


@extend_schema_serializer(
    examples=[
        {
            'name': 'Software Development',
            'description': 'Jobs in software development and engineering',
            'icon': 'code',
            'is_active': True
        },
        {
            'name': 'Design',
            'description': 'Design and creative roles',
            'icon': 'palette',
            'is_active': True
        }
    ]
)
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    
    This serializer handles the serialization and deserialization of Category instances,
    including validation of input data and conversion to/from Python data types.
    
    Fields:
        id: Auto-generated unique identifier (read-only)
        name: Name of the category (required, unique)
        slug: URL-friendly version of the name (auto-generated, read-only)
        description: Detailed description of the category (optional)
        icon: Icon identifier for the category (optional)
        is_active: Boolean indicating if the category is active
        created_at: Timestamp of when the category was created (auto-generated, read-only)
        updated_at: Timestamp of when the category was last updated (auto-generated, read-only)
    """
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
        extra_kwargs = {
            'name': {
                'help_text': 'Name of the category (must be unique)',
                'max_length': 100,
                'required': True
            },
            'description': {
                'help_text': 'Detailed description of the category',
                'allow_blank': True,
                'required': False
            },
            'icon': {
                'help_text': 'Icon identifier (e.g., from a frontend icon library)',
                'allow_blank': True,
                'required': False,
                'max_length': 50
            },
            'is_active': {
                'help_text': 'Whether the category is active and visible',
                'default': True
            }
        }


@extend_schema_serializer(
    examples=[
        {
            'name': 'TechCorp',
            'description': 'A leading technology company',
            'website': 'https://techcorp.example.com',
            'industry': 'Information Technology',
            'founded_year': 2010,
            'company_size': '51-200',
            'headquarters': 'San Francisco, CA',
            'is_verified': True
        }
    ]
)
class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for the Company model.
    
    This serializer handles the serialization and deserialization of Company instances,
    including validation of input data and conversion to/from Python data types.
    
    Fields:
        id: Auto-generated unique identifier (read-only)
        name: Name of the company (required)
        slug: URL-friendly version of the name (auto-generated, read-only)
        description: Detailed description of the company (optional)
        website: Company website URL (optional)
        logo: Company logo image file (optional, max 2MB)
        industry: Industry the company operates in (optional)
        founded_year: Year the company was founded (optional)
        company_size: Size category of the company (optional)
        headquarters: Location of company headquarters (optional)
        is_verified: Whether the company has been verified (read-only)
        created_at: Timestamp of when the company was created (auto-generated, read-only)
        updated_at: Timestamp of when the company was last updated (auto-generated, read-only)
    """
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'slug', 'description', 'website', 'logo', 'industry',
            'founded_year', 'company_size', 'headquarters', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'is_verified', 'created_at', 'updated_at']
        extra_kwargs = {
            'name': {
                'help_text': 'Name of the company',
                'max_length': 200,
                'required': True
            },
            'description': {
                'help_text': 'Detailed description of the company',
                'allow_blank': True,
                'required': False
            },
            'website': {
                'help_text': 'Company website URL',
                'allow_blank': True,
                'required': False
            },
            'industry': {
                'help_text': 'Industry the company operates in',
                'allow_blank': True,
                'required': False,
                'max_length': 100
            },
            'founded_year': {
                'help_text': 'Year the company was founded',
                'min_value': 1800,
                'max_value': 2100,
                'required': False
            },
            'company_size': {
                'help_text': 'Size category of the company (e.g., 1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001+)',
                'allow_blank': True,
                'required': False,
                'max_length': 20
            },
            'headquarters': {
                'help_text': 'Location of company headquarters',
                'allow_blank': True,
                'required': False,
                'max_length': 200
            }
        }
    
    @extend_schema_field(serializers.ImageField(required=False, allow_null=True))
    def validate_logo(self, value: Optional[UploadedFile]) -> Optional[UploadedFile]:
        """
        Validate the uploaded logo file.
        
        Args:
            value: The uploaded file to validate
            
        Returns:
            Optional[UploadedFile]: The validated file if it passes all checks
            
        Raises:
            serializers.ValidationError: If the file is too large or has an invalid format
        """
        if value and isinstance(value, UploadedFile):
            # Check file size (2MB max)
            max_size = 2 * 1024 * 1024  # 2MB in bytes
            if value.size > max_size:
                raise serializers.ValidationError("Logo file too large (max 2MB).")
            
            # Check file type
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg']
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    "Unsupported file type. Please upload an image file (JPG, PNG, GIF, or SVG)."
                )
        
        return value
    
    def create(self, validated_data: Dict[str, Any]) -> Company:
        """
        Create a new company with the current user as the creator.
        
        Args:
            validated_data: The validated data for creating the company
            
        Returns:
            Company: The newly created company instance
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance: Company, validated_data: Dict[str, Any]) -> Company:
        """
        Update a company instance with the provided data.
        
        Args:
            instance: The company instance to update
            validated_data: The validated data for updating the company
            
        Returns:
            Company: The updated company instance
        """
        return super().update(instance, validated_data)

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

    @extend_schema_field(serializers.BooleanField)
    def get_has_applied(self, obj: Job) -> bool:
        """
        Check if the current user has applied to this job.
        
        Args:
            obj: The Job instance being serialized
            
        Returns:
            bool: True if the current user has applied to this job, False otherwise
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(applicant=request.user).exists()
        return False

    @extend_schema_field(serializers.URLField(required=False, allow_null=True))
    def get_company_logo(self, obj: Job) -> Optional[str]:
        """
        Get the absolute URL of the company logo if it exists.
        
        Args:
            obj: The Job instance being serialized
            
        Returns:
            Optional[str]: The absolute URL of the company logo or None if not available
        """
        if obj.company and obj.company.logo:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.company.logo.url)
            return obj.company.logo.url
        return None

    @extend_schema_field(serializers.BooleanField)
    def get_is_owner(self, obj: Job) -> bool:
        """
        Check if the current user is the owner of the job.
        
        Args:
            obj: The Job instance being serialized
            
        Returns:
            bool: True if the current user is the owner of the job, False otherwise
        """
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
    
    @extend_schema_field(serializers.FileField(required=False, allow_null=True))
    def validate_resume(self, value: Optional[File]) -> Optional[File]:
        """
        Validate the uploaded resume file.

        Args:
            value: The uploaded file to validate

        Returns:
            Optional[File]: The validated file if it passes all checks

        Raises:
            serializers.ValidationError: If the file is too large or has an invalid extension
        """
        import os
        from django.core.exceptions import ValidationError
        from django.core.files.uploadedfile import UploadedFile
        
        if value and isinstance(value, UploadedFile):
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

    def create(self, validated_data: Dict[str, Any]) -> JobApplication:
        """
        Create and return a new JobApplication instance, given the validated data.
        The 'applicant' is automatically set to the current user if not provided.

        Args:
            validated_data: The validated data for creating the JobApplication

        Returns:
            JobApplication: The newly created JobApplication instance

        Raises:
            serializers.ValidationError: If the user has already applied to this job
        """
        # Ensure the applicant is set to the current user if not already set
        if 'applicant' not in validated_data and 'request' in self.context:
            validated_data['applicant'] = self.context['request'].user
        
        # Check if the user has already applied to this job
        job = validated_data.get('job')
        applicant = validated_data.get('applicant')
        
        if job and applicant and JobApplication.objects.filter(
            job=job, applicant=applicant
        ).exists():
            raise serializers.ValidationError(
                "You have already applied to this job."
            )
        
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


@extend_schema_serializer(
    examples=[
        {
            'search': 'python developer',
            'location': 'New York',
            'job_type': ['full_time', 'part_time'],
            'salary_min': 50000,
            'salary_max': 120000,
            'is_remote': True,
            'page': 1,
            'page_size': 10,
            'ordering': '-created_at'
        }
    ]
)
class JobSearchSerializer(serializers.Serializer):
    """
    Serializer for job search queries with advanced filtering options.
    
    This serializer handles validation and processing of job search parameters,
    including text search, filtering by various criteria, and result ordering.
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

    def validate_job_type(self, value: Union[str, List[str], None]) -> List[str]:
        """
        Convert comma-separated string to list if needed.
        
        Args:
            value: Either a comma-separated string or a list of job types
            
        Returns:
            List[str]: A list of job type strings
            
        Example:
            Input: 'full_time,part_time' or ['full_time', 'part_time']
            Output: ['full_time', 'part_time']
        """
        if isinstance(value, str):
            return [v.strip() for v in value.split(',') if v.strip()]
        return value or []

    def validate_skills(self, value: Union[str, List[str], None]) -> List[str]:
        """
        Convert comma-separated skills to a normalized list of skills.
        
        Args:
            value: Either a comma-separated string or a list of skills
            
        Returns:
            List[str]: A list of normalized (lowercase, trimmed) skill strings
            
        Example:
            Input: 'Python, JavaScript, Django'
            Output: ['python', 'javascript', 'django']
        """
        if isinstance(value, str):
            return [v.strip().lower() for v in value.split(',') if v.strip()]
        return value or []

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate the search parameters and their relationships.
        
        Args:
            data: Dictionary of input data to validate
            
        Returns:
            Dict[str, Any]: The validated data
            
        Raises:
            serializers.ValidationError: If validation fails for any field
            
        Example:
            >>> data = {'salary_min': 60000, 'salary_max': 50000}
            >>> serializer = JobSearchSerializer(data=data)
            >>> serializer.is_valid()  # Raises ValidationError
            
            >>> data = {'posted_after': '2050-01-01'}
            >>> serializer = JobSearchSerializer(data=data)
            >>> serializer.is_valid()  # Raises ValidationError for future date
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
            if posted_after > timezone.now().date():
                raise serializers.ValidationError({
                    'posted_after': 'Cannot filter by future dates.'
                })
        
        return validated_data
