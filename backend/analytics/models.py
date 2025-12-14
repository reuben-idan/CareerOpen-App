from django.db import models
from core.models import BaseModel
from authentication.models import User
from jobs.models import Job
from companies.models import Company

class AIInsight(BaseModel):
    """AI-generated insights for users."""
    INSIGHT_TYPES = [
        ('career_recommendation', 'Career Recommendation'),
        ('skill_gap', 'Skill Gap Analysis'),
        ('salary_insight', 'Salary Insight'),
        ('job_match', 'Job Match Score'),
        ('market_trend', 'Market Trend'),
        ('profile_optimization', 'Profile Optimization'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_insights')
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPES, db_index=True)
    title = models.CharField(max_length=200)
    content = models.JSONField()
    confidence_score = models.FloatField(db_index=True)
    is_viewed = models.BooleanField(default=False, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'insight_type', 'created_at']),
            models.Index(fields=['confidence_score', 'is_viewed']),
            models.Index(fields=['expires_at', 'is_active']),
        ]

class UserActivity(BaseModel):
    """Track user activities for analytics."""
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('profile_view', 'Profile View'),
        ('job_view', 'Job View'),
        ('job_search', 'Job Search'),
        ('application_submit', 'Application Submit'),
        ('connection_request', 'Connection Request'),
        ('post_create', 'Post Create'),
        ('message_send', 'Message Send'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES, db_index=True)
    metadata = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'activity_type', 'created_at']),
            models.Index(fields=['activity_type', 'created_at']),
            models.Index(fields=['ip_address', 'created_at']),
        ]

class JobAnalytics(BaseModel):
    """Job posting analytics."""
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='analytics')
    views_count = models.IntegerField(default=0, db_index=True)
    applications_count = models.IntegerField(default=0, db_index=True)
    unique_viewers = models.IntegerField(default=0)
    avg_time_on_page = models.FloatField(default=0)
    conversion_rate = models.FloatField(default=0, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['views_count', 'applications_count']),
            models.Index(fields=['conversion_rate', 'created_at']),
        ]