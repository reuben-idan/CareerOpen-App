from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .job_matching import job_matching_service
from .profile_optimizer import profile_optimizer
from .resume_parser import resume_parser
from jobs.models import Job
from profiles.models import Profile
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='10/m', method='POST')
def analyze_job_match(request):
    """Analyze job match score for user and specific job."""
    try:
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get job
        try:
            job = Job.objects.get(id=job_id, is_published=True)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get user profile
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Prepare profile data
        profile_data = {
            'bio': profile.bio,
            'skills': profile.skills,
            'current_position': profile.current_position,
            'experience_years': profile.experience_years,
        }
        
        # Prepare job data
        job_data = {
            'title': job.title,
            'description': job.description,
            'requirements': job.requirements,
            'skills_required': job.skills_required,
            'experience_level': job.experience_level,
        }
        
        # Calculate match score
        match_result = job_matching_service.calculate_job_match_score(profile_data, job_data)
        
        return Response(match_result)
    
    except Exception as e:
        logger.error(f"Job match analysis error: {e}")
        return Response({'error': 'Analysis failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='5/m', method='POST')
def analyze_skill_gaps(request):
    """Analyze skill gaps for a specific job."""
    try:
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get job and profile (similar to above)
        job = Job.objects.get(id=job_id, is_published=True)
        profile = Profile.objects.get(user=request.user)
        
        profile_data = {'skills': profile.skills}
        job_data = {'skills_required': job.skills_required}
        
        # Analyze skill gaps
        gap_analysis = job_matching_service.analyze_skill_gaps(profile_data, job_data)
        
        return Response(gap_analysis)
    
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Skill gap analysis error: {e}")
        return Response({'error': 'Analysis failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='3/m', method='GET')
def suggest_career_paths(request):
    """Get AI-powered career path suggestions."""
    try:
        # Get user profile
        profile = Profile.objects.get(user=request.user)
        
        profile_data = {
            'current_position': profile.current_position,
            'skills': profile.skills,
            'experience_years': profile.experience_years,
        }
        
        # Generate career suggestions
        suggestions = job_matching_service.suggest_career_paths(profile_data)
        
        return Response(suggestions)
    
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Career path suggestion error: {e}")
        return Response({'error': 'Suggestion failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='5/m', method='GET')
def optimize_profile(request):
    """Get AI-powered profile optimization suggestions."""
    try:
        # Get user profile with related data
        profile = Profile.objects.select_related('user').prefetch_related('experiences', 'education').get(user=request.user)
        
        # Prepare profile data
        profile_data = {
            'bio': profile.bio,
            'current_position': profile.current_position,
            'skills': profile.skills,
            'experience_years': profile.experience_years,
            'website': profile.website,
            'linkedin_url': profile.linkedin_url,
            'location': profile.location,
            'avatar': bool(request.user.avatar),
            'experiences': [
                {
                    'title': exp.title,
                    'company': exp.company,
                    'description': exp.description,
                }
                for exp in profile.experiences.all()
            ],
            'education': [
                {
                    'degree': edu.degree,
                    'institution': edu.institution,
                }
                for edu in profile.education.all()
            ]
        }
        
        # Get target roles from query params
        target_roles = request.GET.get('target_roles', '').split(',') if request.GET.get('target_roles') else None
        
        # Generate optimization suggestions
        optimization = profile_optimizer.optimize_profile(profile_data, target_roles)
        
        return Response(optimization)
    
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Profile optimization error: {e}")
        return Response({'error': 'Optimization failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='2/h', method='POST')
def parse_resume(request):
    """Parse uploaded resume file."""
    try:
        if 'resume' not in request.FILES:
            return Response({'error': 'Resume file required'}, status=status.HTTP_400_BAD_REQUEST)
        
        resume_file = request.FILES['resume']
        
        # Validate file type
        allowed_types = ['.pdf', '.docx']
        if not any(resume_file.name.lower().endswith(ext) for ext in allowed_types):
            return Response({'error': 'Only PDF and DOCX files supported'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save file temporarily
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(resume_file.name)[1]) as tmp_file:
            for chunk in resume_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
        
        try:
            # Parse resume
            parsed_data = resume_parser.parse_resume(tmp_file_path)
            
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
            return Response(parsed_data)
        
        except Exception as e:
            # Clean up on error
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
            raise e
    
    except Exception as e:
        logger.error(f"Resume parsing error: {e}")
        return Response({'error': 'Parsing failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_status(request):
    """Get AI services status."""
    from .openai_client import openai_client
    from .embeddings import embedding_service
    
    return Response({
        'openai_available': openai_client.is_available(),
        'embeddings_available': embedding_service.is_loaded,
        'features': {
            'job_matching': True,
            'skill_analysis': True,
            'career_suggestions': openai_client.is_available(),
            'profile_optimization': openai_client.is_available(),
            'resume_parsing': True,
        }
    })