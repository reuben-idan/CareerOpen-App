from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from core.models import BaseModel
from authentication.models import User
from companies.models import Company

class Job(BaseModel):
    """Job posting model."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    location = models.CharField(max_length=200)
    job_type = models.CharField(max_length=50, choices=[
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    ])
    experience_level = models.CharField(max_length=50, choices=[
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('lead', 'Lead'),
        ('executive', 'Executive'),
    ])
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    skills_required = models.JSONField(default=list)
    is_published = models.BooleanField(default=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    search_vector = SearchVectorField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['company', 'is_published', 'created_at']),
            models.Index(fields=['job_type', 'experience_level']),
            models.Index(fields=['location', 'is_published']),
            models.Index(fields=['salary_min', 'salary_max']),
            models.Index(fields=['expires_at', 'is_published']),
            GinIndex(fields=['skills_required']),
            GinIndex(fields=['search_vector']),
        ]
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"

class JobView(BaseModel):
    """Track job views for analytics."""
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    
    class Meta:
        unique_together = ['job', 'user', 'ip_address']