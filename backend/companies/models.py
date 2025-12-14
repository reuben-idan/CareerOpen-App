from django.db import models
from core.models import BaseModel
from authentication.models import User

class Company(BaseModel):
    """Company model for recruiters and job postings."""
    name = models.CharField(max_length=200)
    description = models.TextField()
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    industry = models.CharField(max_length=100)
    size = models.CharField(max_length=50, choices=[
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1000+', '1000+ employees'),
    ])
    location = models.CharField(max_length=200)
    founded_year = models.IntegerField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = 'companies'
    
    def __str__(self):
        return self.name

class CompanyMember(BaseModel):
    """Company membership for users."""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='company_memberships')
    role = models.CharField(max_length=50, default='employee')
    is_admin = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['company', 'user']