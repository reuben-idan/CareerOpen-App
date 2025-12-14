from django.urls import path
from . import views

urlpatterns = [
    path('job-match/', views.analyze_job_match, name='ai-job-match'),
    path('skill-gaps/', views.analyze_skill_gaps, name='ai-skill-gaps'),
    path('career-paths/', views.suggest_career_paths, name='ai-career-paths'),
    path('optimize-profile/', views.optimize_profile, name='ai-optimize-profile'),
    path('parse-resume/', views.parse_resume, name='ai-parse-resume'),
    path('status/', views.ai_status, name='ai-status'),
]