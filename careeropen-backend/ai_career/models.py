from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField


class CareerProfile(models.Model):
    """AI-generated career profile and insights"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='career_profile')
    skills = JSONField(default=list)  # Extracted and analyzed skills
    experience_level = models.CharField(max_length=20, choices=[
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive Level'),
    ], blank=True)
    career_goals = JSONField(default=dict)  # User's career aspirations
    strengths = JSONField(default=list)  # AI-identified strengths
    improvement_areas = JSONField(default=list)  # Areas for growth
    last_analyzed = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Career Profile - {self.user.email}"


class JobMatch(models.Model):
    """AI job matching results"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_matches')
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='ai_matches')
    match_score = models.FloatField()  # 0.0 to 1.0
    match_reasons = JSONField(default=list)  # Why this job matches
    skill_gaps = JSONField(default=list)  # Missing skills
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'job']
        ordering = ['-match_score', '-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.job.title} ({self.match_score:.2f})"


class ResumeAnalysis(models.Model):
    """AI resume analysis and feedback"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resume_analyses')
    resume_file = models.FileField(upload_to='resume_analysis/')
    extracted_text = models.TextField()
    analysis_results = JSONField(default=dict)  # Detailed analysis
    suggestions = JSONField(default=list)  # Improvement suggestions
    score = models.FloatField(null=True, blank=True)  # Overall resume score
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Resume Analysis - {self.user.email} ({self.created_at})"


class SkillAssessment(models.Model):
    """AI-powered skill assessments"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skill_assessments')
    skill_name = models.CharField(max_length=100)
    assessment_type = models.CharField(max_length=20, choices=[
        ('quiz', 'Quiz'),
        ('project', 'Project'),
        ('interview', 'Mock Interview'),
    ])
    questions = JSONField(default=list)
    answers = JSONField(default=list)
    score = models.FloatField(null=True, blank=True)
    feedback = JSONField(default=dict)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.skill_name} Assessment"