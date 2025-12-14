import json
from .embeddings import embedding_service
from .openai_client import openai_client
import logging

logger = logging.getLogger(__name__)

class JobMatchingService:
    def __init__(self):
        self.embedding_service = embedding_service
        self.openai_client = openai_client
    
    def calculate_job_match_score(self, user_profile, job_description):
        """Calculate comprehensive job match score."""
        try:
            # Extract relevant text from profile and job
            profile_text = self._extract_profile_text(user_profile)
            job_text = self._extract_job_text(job_description)
            
            # Calculate semantic similarity
            semantic_score = self.embedding_service.calculate_similarity(profile_text, job_text)
            
            # Calculate skill overlap
            skill_score = self._calculate_skill_overlap(user_profile, job_description)
            
            # Calculate experience match
            experience_score = self._calculate_experience_match(user_profile, job_description)
            
            # Weighted final score
            final_score = (
                semantic_score * 0.4 +
                skill_score * 0.4 +
                experience_score * 0.2
            )
            
            return {
                'overall_score': round(final_score * 100, 1),
                'semantic_similarity': round(semantic_score * 100, 1),
                'skill_match': round(skill_score * 100, 1),
                'experience_match': round(experience_score * 100, 1),
                'explanation': self._generate_match_explanation(final_score)
            }
        except Exception as e:
            logger.error(f"Job matching error: {e}")
            return {'overall_score': 0, 'error': str(e)}
    
    def analyze_skill_gaps(self, user_profile, job_description):
        """Identify missing skills and provide recommendations."""
        try:
            user_skills = set(user_profile.get('skills', []))
            required_skills = set(job_description.get('skills_required', []))
            
            missing_skills = required_skills - user_skills
            matching_skills = required_skills & user_skills
            
            # Generate AI recommendations if OpenAI is available
            recommendations = []
            if self.openai_client.is_available() and missing_skills:
                prompt = f"""
                User has skills: {', '.join(user_skills)}
                Job requires: {', '.join(required_skills)}
                Missing skills: {', '.join(missing_skills)}
                
                Provide 3 specific, actionable recommendations to acquire the missing skills.
                Format as JSON array of strings.
                """
                
                ai_response = self.openai_client.generate_completion_sync(prompt, max_tokens=300)
                if not isinstance(ai_response, dict):
                    try:
                        recommendations = json.loads(ai_response)
                    except:
                        recommendations = [ai_response] if ai_response else []
            
            return {
                'missing_skills': list(missing_skills),
                'matching_skills': list(matching_skills),
                'skill_match_percentage': round((len(matching_skills) / len(required_skills)) * 100, 1) if required_skills else 100,
                'recommendations': recommendations[:3]  # Limit to 3 recommendations
            }
        except Exception as e:
            logger.error(f"Skill gap analysis error: {e}")
            return {'error': str(e)}
    
    def suggest_career_paths(self, user_profile):
        """Generate AI-powered career path suggestions."""
        if not self.openai_client.is_available():
            return {'suggestions': [], 'note': 'AI suggestions unavailable'}
        
        try:
            current_role = user_profile.get('current_position', 'Professional')
            skills = user_profile.get('skills', [])
            experience_years = user_profile.get('experience_years', 0)
            
            prompt = f"""
            Current role: {current_role}
            Skills: {', '.join(skills[:10])}  # Limit skills for prompt
            Experience: {experience_years} years
            
            Suggest 3 realistic career advancement paths with:
            1. Next role title
            2. Skills to develop
            3. Timeline estimate
            
            Format as JSON array of objects with keys: role, skills_needed, timeline, description
            """
            
            ai_response = self.openai_client.generate_completion_sync(prompt, max_tokens=400)
            if not isinstance(ai_response, dict):
                try:
                    suggestions = json.loads(ai_response)
                    return {'suggestions': suggestions[:3]}
                except:
                    return {'suggestions': [], 'raw_response': ai_response}
            
            return {'suggestions': [], 'error': ai_response.get('error')}
        except Exception as e:
            logger.error(f"Career path suggestion error: {e}")
            return {'error': str(e)}
    
    def _extract_profile_text(self, profile):
        """Extract searchable text from user profile."""
        text_parts = []
        
        if profile.get('bio'):
            text_parts.append(profile['bio'])
        if profile.get('current_position'):
            text_parts.append(profile['current_position'])
        if profile.get('skills'):
            text_parts.append(' '.join(profile['skills']))
        
        return ' '.join(text_parts)
    
    def _extract_job_text(self, job):
        """Extract searchable text from job description."""
        text_parts = []
        
        if job.get('title'):
            text_parts.append(job['title'])
        if job.get('description'):
            text_parts.append(job['description'])
        if job.get('requirements'):
            text_parts.append(job['requirements'])
        if job.get('skills_required'):
            text_parts.append(' '.join(job['skills_required']))
        
        return ' '.join(text_parts)
    
    def _calculate_skill_overlap(self, profile, job):
        """Calculate skill overlap percentage."""
        user_skills = set(skill.lower() for skill in profile.get('skills', []))
        required_skills = set(skill.lower() for skill in job.get('skills_required', []))
        
        if not required_skills:
            return 1.0
        
        overlap = len(user_skills & required_skills)
        return overlap / len(required_skills)
    
    def _calculate_experience_match(self, profile, job):
        """Calculate experience level match."""
        user_years = profile.get('experience_years', 0)
        
        # Map experience levels to years
        level_mapping = {
            'entry': (0, 2),
            'mid': (2, 5),
            'senior': (5, 10),
            'lead': (8, 15),
            'executive': (10, 30)
        }
        
        job_level = job.get('experience_level', 'entry')
        min_years, max_years = level_mapping.get(job_level, (0, 2))
        
        if min_years <= user_years <= max_years:
            return 1.0
        elif user_years < min_years:
            return max(0, 1 - (min_years - user_years) / min_years)
        else:
            return max(0.7, 1 - (user_years - max_years) / max_years)
    
    def _generate_match_explanation(self, score):
        """Generate human-readable match explanation."""
        if score >= 0.8:
            return "Excellent match! Your profile aligns very well with this position."
        elif score >= 0.6:
            return "Good match. You meet most requirements for this role."
        elif score >= 0.4:
            return "Moderate match. Consider developing additional skills."
        else:
            return "Limited match. This role may require significant skill development."

# Global instance
job_matching_service = JobMatchingService()