from .openai_client import openai_client
from .embeddings import embedding_service
import json
import logging

logger = logging.getLogger(__name__)

class ProfileOptimizer:
    def __init__(self):
        self.openai_client = openai_client
        self.embedding_service = embedding_service
    
    def optimize_profile(self, user_profile, target_roles=None):
        """Generate AI-powered profile optimization suggestions."""
        try:
            suggestions = {
                'headline': self._optimize_headline(user_profile),
                'summary': self._optimize_summary(user_profile),
                'skills': self._suggest_skills(user_profile, target_roles),
                'experience': self._optimize_experience(user_profile),
                'overall_score': self._calculate_profile_score(user_profile)
            }
            
            return suggestions
        except Exception as e:
            logger.error(f"Profile optimization error: {e}")
            return {'error': str(e)}
    
    def _optimize_headline(self, profile):
        """Suggest optimized profile headline."""
        if not self.openai_client.is_available():
            return {'suggestion': '', 'note': 'AI optimization unavailable'}
        
        try:
            current_position = profile.get('current_position', '')
            skills = profile.get('skills', [])[:5]  # Top 5 skills
            experience_years = profile.get('experience_years', 0)
            
            prompt = f"""
            Create a compelling LinkedIn-style headline for:
            Current role: {current_position}
            Key skills: {', '.join(skills)}
            Experience: {experience_years} years
            
            Make it concise (under 120 characters), professional, and keyword-rich.
            Return only the headline text.
            """
            
            suggestion = self.openai_client.generate_completion_sync(prompt, max_tokens=50)
            
            if isinstance(suggestion, dict):
                return {'suggestion': '', 'error': suggestion.get('error')}
            
            return {
                'suggestion': suggestion.strip().replace('"', ''),
                'current': current_position,
                'improvement': 'More keyword-rich and compelling'
            }
        except Exception as e:
            logger.error(f"Headline optimization error: {e}")
            return {'error': str(e)}
    
    def _optimize_summary(self, profile):
        """Suggest optimized profile summary."""
        if not self.openai_client.is_available():
            return {'suggestion': '', 'note': 'AI optimization unavailable'}
        
        try:
            current_bio = profile.get('bio', '')
            current_position = profile.get('current_position', '')
            skills = profile.get('skills', [])[:8]
            experience_years = profile.get('experience_years', 0)
            
            prompt = f"""
            Write a professional summary for:
            Current bio: {current_bio[:200]}
            Role: {current_position}
            Skills: {', '.join(skills)}
            Experience: {experience_years} years
            
            Make it 2-3 sentences, achievement-focused, and include key skills.
            Return only the summary text.
            """
            
            suggestion = self.openai_client.generate_completion_sync(prompt, max_tokens=150)
            
            if isinstance(suggestion, dict):
                return {'suggestion': '', 'error': suggestion.get('error')}
            
            return {
                'suggestion': suggestion.strip(),
                'current': current_bio,
                'improvements': [
                    'More achievement-focused',
                    'Better keyword optimization',
                    'Clearer value proposition'
                ]
            }
        except Exception as e:
            logger.error(f"Summary optimization error: {e}")
            return {'error': str(e)}
    
    def _suggest_skills(self, profile, target_roles):
        """Suggest additional skills to add."""
        current_skills = set(skill.lower() for skill in profile.get('skills', []))
        
        # Industry-specific skill recommendations
        skill_recommendations = {
            'software': ['python', 'javascript', 'react', 'sql', 'git', 'aws', 'docker'],
            'marketing': ['seo', 'google analytics', 'social media', 'content marketing', 'ppc'],
            'sales': ['crm', 'lead generation', 'negotiation', 'salesforce', 'pipeline management'],
            'design': ['figma', 'adobe creative suite', 'ui/ux', 'prototyping', 'user research'],
            'data': ['python', 'sql', 'tableau', 'excel', 'statistics', 'machine learning']
        }
        
        suggested_skills = []
        
        # Suggest based on current role
        current_role = profile.get('current_position', '').lower()
        for category, skills in skill_recommendations.items():
            if category in current_role:
                for skill in skills:
                    if skill not in current_skills:
                        suggested_skills.append(skill.title())
        
        # AI-powered suggestions if available
        ai_suggestions = []
        if self.openai_client.is_available() and target_roles:
            try:
                prompt = f"""
                Current skills: {', '.join(profile.get('skills', [])[:10])}
                Target roles: {', '.join(target_roles[:3])}
                
                Suggest 5 additional skills that would be valuable.
                Return as JSON array of strings.
                """
                
                ai_response = self.openai_client.generate_completion_sync(prompt, max_tokens=100)
                if not isinstance(ai_response, dict):
                    try:
                        ai_suggestions = json.loads(ai_response)
                    except:
                        pass
            except Exception as e:
                logger.error(f"AI skill suggestion error: {e}")
        
        return {
            'trending_skills': suggested_skills[:5],
            'ai_suggestions': ai_suggestions[:5],
            'current_count': len(profile.get('skills', [])),
            'recommended_total': 15
        }
    
    def _optimize_experience(self, profile):
        """Suggest experience section improvements."""
        experiences = profile.get('experiences', [])
        
        suggestions = []
        
        for exp in experiences[:3]:  # Analyze top 3 experiences
            description = exp.get('description', '')
            
            # Check for quantifiable achievements
            has_numbers = any(char.isdigit() for char in description)
            has_action_words = any(word in description.lower() for word in 
                                 ['led', 'managed', 'increased', 'improved', 'developed', 'created'])
            
            exp_suggestions = []
            
            if not has_numbers:
                exp_suggestions.append('Add quantifiable achievements (numbers, percentages)')
            
            if not has_action_words:
                exp_suggestions.append('Use strong action verbs (led, managed, improved)')
            
            if len(description) < 50:
                exp_suggestions.append('Expand description with specific accomplishments')
            
            if exp_suggestions:
                suggestions.append({
                    'title': exp.get('title', 'Experience'),
                    'improvements': exp_suggestions
                })
        
        return {
            'suggestions': suggestions,
            'general_tips': [
                'Use bullet points for readability',
                'Focus on achievements, not just responsibilities',
                'Include relevant keywords for your industry'
            ]
        }
    
    def _calculate_profile_score(self, profile):
        """Calculate overall profile completeness score."""
        score = 0
        max_score = 100
        
        # Basic information (30 points)
        if profile.get('bio'):
            score += 10
        if profile.get('current_position'):
            score += 10
        if profile.get('location'):
            score += 5
        if profile.get('website') or profile.get('linkedin_url'):
            score += 5
        
        # Skills (25 points)
        skills_count = len(profile.get('skills', []))
        if skills_count >= 10:
            score += 25
        elif skills_count >= 5:
            score += 15
        elif skills_count >= 1:
            score += 5
        
        # Experience (25 points)
        experiences = profile.get('experiences', [])
        if len(experiences) >= 3:
            score += 15
        elif len(experiences) >= 1:
            score += 10
        
        # Check experience descriptions
        for exp in experiences[:3]:
            if exp.get('description') and len(exp['description']) > 50:
                score += 3
        
        # Education (10 points)
        education = profile.get('education', [])
        if len(education) >= 1:
            score += 10
        
        # Professional photo/avatar (10 points)
        if profile.get('avatar'):
            score += 10
        
        return {
            'score': min(score, max_score),
            'level': self._get_score_level(score),
            'next_milestone': self._get_next_milestone(score)
        }
    
    def _get_score_level(self, score):
        """Get profile level based on score."""
        if score >= 90:
            return 'Expert'
        elif score >= 70:
            return 'Advanced'
        elif score >= 50:
            return 'Intermediate'
        elif score >= 30:
            return 'Beginner'
        else:
            return 'Getting Started'
    
    def _get_next_milestone(self, score):
        """Get next milestone to reach."""
        milestones = [
            (30, 'Complete basic profile information'),
            (50, 'Add more skills and experience details'),
            (70, 'Optimize descriptions with achievements'),
            (90, 'Perfect your professional summary'),
            (100, 'Profile fully optimized!')
        ]
        
        for milestone_score, description in milestones:
            if score < milestone_score:
                return {
                    'target_score': milestone_score,
                    'description': description,
                    'points_needed': milestone_score - score
                }
        
        return {'description': 'Profile fully optimized!'}

# Global instance
profile_optimizer = ProfileOptimizer()