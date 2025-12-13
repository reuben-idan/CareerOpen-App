from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of username.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user model that uses email as the unique identifier for authentication.
    """
    username = models.CharField(_('username'), max_length=30, blank=True, null=True)
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    is_employer = models.BooleanField(_('employer status'), default=False,
                                    help_text=_('Designates whether the user can post jobs.'))
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')


class UserProfile(models.Model):
    """
    Extended user profile with additional information.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)
    bio = models.TextField(_('bio'), blank=True)
    profile_picture = models.ImageField(
        _('profile picture'),
        upload_to='profile_pics/',
        blank=True,
        null=True
    )
    cover_image = models.ImageField(
        _('cover image'),
        upload_to='cover_images/',
        blank=True,
        null=True
    )
    location = models.CharField(_('location'), max_length=100, blank=True)
    website = models.URLField(_('website'), blank=True)
    github = models.URLField(_('GitHub profile'), blank=True)
    linkedin = models.URLField(_('LinkedIn profile'), blank=True)
    twitter = models.URLField(_('Twitter profile'), blank=True)
    
    # Professional info
    headline = models.CharField(_('professional headline'), max_length=200, blank=True)
    current_position = models.CharField(_('current position'), max_length=200, blank=True)
    current_company = models.CharField(_('current company'), max_length=200, blank=True)
    industry = models.CharField(_('industry'), max_length=100, blank=True)
    
    # For job seekers
    resume = models.FileField(
        _('resume'),
        upload_to='resumes/',
        blank=True,
        null=True,
        help_text=_('Upload your resume (PDF, DOC, or DOCX)')
    )
    skills = models.TextField(
        _('skills'),
        blank=True,
        help_text=_('List your skills separated by commas')
    )
    open_to_work = models.BooleanField(_('open to work'), default=False)
    
    # For employers
    company_name = models.CharField(_('company name'), max_length=100, blank=True)
    company_description = models.TextField(_('company description'), blank=True)
    company_website = models.URLField(_('company website'), blank=True)
    company_logo = models.ImageField(
        _('company logo'),
        upload_to='company_logos/',
        blank=True,
        null=True
    )
    
    # Privacy settings
    profile_visibility = models.CharField(
        _('profile visibility'),
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('connections', 'Connections Only'),
            ('private', 'Private'),
        ],
        default='public'
    )

    def __str__(self):
        return f"{self.user.email}'s profile"

    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')
