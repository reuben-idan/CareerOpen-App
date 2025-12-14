from django.db import models
from core.models import BaseModel
from authentication.models import User

class Skill(BaseModel):
    """Skills taxonomy for users and jobs."""
    name = models.CharField(max_length=100, unique=True, db_index=True)
    category = models.CharField(max_length=50, db_index=True)
    description = models.TextField(blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name', 'category']),
            models.Index(fields=['category', 'created_at']),
        ]
    
    def __str__(self):
        return self.name

class UserSkill(BaseModel):
    """User skills with proficiency levels."""
    PROFICIENCY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    years_experience = models.IntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'skill']
        indexes = [
            models.Index(fields=['user', 'proficiency']),
            models.Index(fields=['skill', 'proficiency']),
        ]