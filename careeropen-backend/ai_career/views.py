from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CareerProfile, JobMatch, ResumeAnalysis
from .services import AICareerService
from jobs.models import Job


class AICareerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def analyze_resume(self, request):
        """Analyze uploaded resume"""
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({'error': 'Resume file required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Extract text from file (simplified)
        try:
            resume_text = resume_file.read().decode('utf-8')
        except:
            return Response({'error': 'Could not read resume file'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Analyze resume
        analysis = AICareerService.analyze_resume(resume_text)
        
        # Save analysis
        resume_analysis = ResumeAnalysis.objects.create(
            user=request.user,
            resume_file=resume_file,
            extracted_text=resume_text,
            analysis_results=analysis,
            suggestions=analysis.get('suggestions', []),
            score=analysis.get('score', 0.0)
        )
        
        return Response({
            'id': resume_analysis.id,
            'analysis': analysis,
            'score': analysis.get('score', 0.0),
            'suggestions': analysis.get('suggestions', [])
        })
    
    @action(detail=False, methods=['get'])
    def job_recommendations(self, request):
        """Get AI-powered job recommendations"""
        # Get or create user's career profile
        career_profile, created = CareerProfile.objects.get_or_create(
            user=request.user,
            defaults={'skills': [], 'career_goals': {}}
        )
        
        # Get recent jobs
        jobs = Job.objects.filter(status='published', is_active=True)[:20]
        
        recommendations = []
        for job in jobs:
            # Calculate match score
            match_data = AICareerService.calculate_job_match(
                {'skills': career_profile.skills, 'experience_level': career_profile.experience_level},
                job
            )
            
            # Save or update job match
            job_match, created = JobMatch.objects.get_or_create(
                user=request.user,
                job=job,
                defaults={
                    'match_score': match_data['score'],
                    'match_reasons': match_data['reasons'],
                    'skill_gaps': match_data['missing_skills']
                }
            )
            
            if not created:
                job_match.match_score = match_data['score']
                job_match.match_reasons = match_data['reasons']
                job_match.skill_gaps = match_data['missing_skills']
                job_match.save()
            
            recommendations.append({
                'job_id': job.id,
                'title': job.title,
                'company': job.company.name if job.company else 'Unknown',
                'match_score': match_data['score'],
                'reasons': match_data['reasons'],
                'skill_gaps': match_data['missing_skills']
            })
        
        # Sort by match score
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        return Response({
            'recommendations': recommendations[:10],
            'total_analyzed': len(jobs)
        })
    
    @action(detail=False, methods=['get'])
    def career_insights(self, request):
        """Get career insights and analytics"""
        career_profile = get_object_or_404(CareerProfile, user=request.user)
        
        # Get recent analyses
        recent_analyses = ResumeAnalysis.objects.filter(
            user=request.user
        ).order_by('-created_at')[:5]
        
        # Get top job matches
        top_matches = JobMatch.objects.filter(
            user=request.user
        ).order_by('-match_score')[:5]
        
        return Response({
            'profile': {
                'skills': career_profile.skills,
                'experience_level': career_profile.experience_level,
                'strengths': career_profile.strengths,
                'improvement_areas': career_profile.improvement_areas
            },
            'recent_analyses': [
                {
                    'id': analysis.id,
                    'score': analysis.score,
                    'created_at': analysis.created_at,
                    'suggestions_count': len(analysis.suggestions)
                }
                for analysis in recent_analyses
            ],
            'top_matches': [
                {
                    'job_title': match.job.title,
                    'company': match.job.company.name if match.job.company else 'Unknown',
                    'match_score': match.match_score,
                    'created_at': match.created_at
                }
                for match in top_matches
            ]
        })