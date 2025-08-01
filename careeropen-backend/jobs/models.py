from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse
from django.utils.text import slugify

User = get_user_model()


class Company(models.Model):
    """
    Model representing a company that can post jobs.
    """
    name = models.CharField(_('company name'), max_length=200, unique=True)
    slug = models.SlugField(_('slug'), max_length=200, unique=True, blank=True)
    description = models.TextField(_('company description'), blank=True)
    website = models.URLField(_('website'), blank=True)
    logo = models.ImageField(
        _('company logo'),
        upload_to='company_logos/',
        blank=True,
        null=True,
        help_text=_('Upload the company logo')
    )
    industry = models.CharField(_('industry'), max_length=100, blank=True)
    founded_year = models.PositiveIntegerField(
        _('founded year'),
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(timezone.now().year)
        ]
    )
    company_size = models.CharField(
        _('company size'),
        max_length=20,
        blank=True,
        choices=[
            ('1-10', '1-10 employees'),
            ('11-50', '11-50 employees'),
            ('51-200', '51-200 employees'),
            ('201-500', '201-500 employees'),
            ('501-1000', '501-1,000 employees'),
            ('1001-5000', '1,001-5,000 employees'),
            ('5001-10000', '5,001-10,000 employees'),
            ('10001+', '10,000+ employees'),
        ]
    )
    headquarters = models.CharField(_('headquarters'), max_length=200, blank=True)
    is_verified = models.BooleanField(_('is verified'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('company')
        verbose_name_plural = _('companies')
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('company_detail', kwargs={'slug': self.slug})


class Category(models.Model):
    """
    Model representing job categories (e.g., Software Development, Design, Marketing).
    """
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=100, unique=True, blank=True)
    description = models.TextField(_('description'), blank=True)
    icon = models.CharField(
        _('icon'),
        max_length=50,
        blank=True,
        help_text=_('Font Awesome icon class (e.g., "fas fa-code" for development)')
    )
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('category_jobs', kwargs={'slug': self.slug})


class Job(models.Model):
    """
    Model representing a job posting.
    """
    # Job type choices
    FULL_TIME = 'full_time'
    PART_TIME = 'part_time'
    CONTRACT = 'contract'
    INTERNSHIP = 'internship'
    TEMPORARY = 'temporary'

    JOB_TYPE_CHOICES = [
        (FULL_TIME, _('Full Time')),
        (PART_TIME, _('Part Time')),
        (CONTRACT, _('Contract')),
        (INTERNSHIP, _('Internship')),
        (TEMPORARY, _('Temporary')),
    ]

    # Status choices
    DRAFT = 'draft'
    PUBLISHED = 'published'
    CLOSED = 'closed'

    STATUS_CHOICES = [
        (DRAFT, _('Draft')),
        (PUBLISHED, _('Published')),
        (CLOSED, _('Closed')),
    ]

    # Job fields
    title = models.CharField(_('job title'), max_length=200)
    description = models.TextField(_('job description'))
    requirements = models.TextField(_('job requirements'), blank=True)
    responsibilities = models.TextField(_('job responsibilities'), blank=True)

    # Company and category
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='jobs',
        verbose_name=_('company'),
        null=True,  # Temporarily allow null for data migration
        blank=True
    )
    categories = models.ManyToManyField(
        Category,
        related_name='jobs',
        verbose_name=_('categories'),
        blank=True
    )

    # Job details
    job_type = models.CharField(
        _('job type'),
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default=FULL_TIME
    )
    location = models.CharField(_('job location'), max_length=200)
    is_remote = models.BooleanField(_('remote position'), default=False)
    
    # Salary information
    salary_min = models.DecimalField(
        _('minimum salary'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_max = models.DecimalField(
        _('maximum salary'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_currency = models.CharField(
        _('salary currency'),
        max_length=3,
        default='USD',
        help_text=_('ISO 4217 currency code (e.g., USD, EUR, GBP)')
    )
    
    # Status and metadata
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default=DRAFT
    )
    is_active = models.BooleanField(_('is active'), default=True)
    poster = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posted_jobs',
        verbose_name=_('poster')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    published_at = models.DateTimeField(_('published at'), null=True, blank=True)
    closed_at = models.DateTimeField(_('closed at'), null=True, blank=True)
    
    # Application information
    application_deadline = models.DateTimeField(
        _('application deadline'),
        null=True,
        blank=True
    )
    application_url = models.URLField(
        _('application URL'),
        blank=True,
        help_text=_('External URL for job applications if not using the built-in system')
    )
    
    # Metadata
    slug = models.SlugField(_('slug'), max_length=255, unique=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('job')
        verbose_name_plural = _('jobs')
    
    def __str__(self):
        return f"{self.title} at {self.company}"
    
    def save(self, *args, **kwargs):
        # Set published_at when status changes to published
        if self.status == self.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        
        # Set closed_at when status changes to closed
        if self.status == self.CLOSED and not self.closed_at:
            self.closed_at = timezone.now()
        
        # Set is_active based on status
        self.is_active = self.status == self.PUBLISHED
        
        # Generate slug if not provided
        if not self.slug:
            from django.utils.text import slugify
            from django.utils.crypto import get_random_string
            base_slug = slugify(f"{self.title} {self.company}")
            self.slug = f"{base_slug}-{get_random_string(4, '0123456789')}"
        
        super().save(*args, **kwargs)


class JobApplication(models.Model):
    """
    Model representing a job application.
    """
    # Application status choices
    APPLIED = 'applied'
    REVIEWING = 'reviewing'
    INTERVIEWING = 'interviewing'
    SHORTLISTED = 'shortlisted'
    OFFERED = 'offered'
    HIRED = 'hired'
    REJECTED = 'rejected'
    WITHDRAWN = 'withdrawn'
    
    STATUS_CHOICES = [
        (APPLIED, _('Applied')),
        (REVIEWING, _('Under Review')),
        (INTERVIEWING, _('Interviewing')),
        (SHORTLISTED, _('Shortlisted')),
        (OFFERED, _('Job Offered')),
        (HIRED, _('Hired')),
        (REJECTED, _('Rejected')),
        (WITHDRAWN, _('Withdrawn')),
    ]
    
    # Application fields
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name=_('job')
    )
    applicant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_applications',
        verbose_name=_('applicant')
    )
    
    # Application details
    cover_letter = models.TextField(
        _('cover letter'),
        blank=True,
        help_text=_('Why are you a good fit for this position?')
    )
    resume = models.FileField(
        _('resume'),
        upload_to='resumes/%Y/%m/%d/',
        null=True,
        blank=True,
        help_text=_('Upload your resume (PDF, DOC, or DOCX)')
    )
    status = models.CharField(
        _('application status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default=APPLIED
    )
    
    # Metadata
    applied_at = models.DateTimeField(_('applied at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    # Additional notes (for internal use by recruiters/employers)
    notes = models.TextField(_('internal notes'), blank=True)
    
    class Meta:
        ordering = ['-applied_at']
        verbose_name = _('job application')
        verbose_name_plural = _('job applications')
        unique_together = ['job', 'applicant']
    
    def __str__(self):
        return f"{self.applicant.get_full_name() or self.applicant.email} - {self.job.title}"
    
    def save(self, *args, **kwargs):
        # Update timestamps
        if not self.pk:  # New instance
            self.applied_at = timezone.now()
        self.updated_at = timezone.now()
        
        super().save(*args, **kwargs)


class SavedJob(models.Model):
    """
    Model for users to save jobs they're interested in.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='saved_jobs',
        verbose_name=_('user')
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='saved_by',
        verbose_name=_('job')
    )
    saved_at = models.DateTimeField(_('saved at'), auto_now_add=True)
    
    class Meta:
        ordering = ['-saved_at']
        verbose_name = _('saved job')
        verbose_name_plural = _('saved jobs')
        unique_together = ['user', 'job']
    
    def __str__(self):
        return f"{self.user} saved {self.job}"
