import json
import re
from typing import Dict, List, Any
from django.conf import settings


class AICareerService:
    """AI-powered career intelligence service"""
    
    @staticmethod
    def analyze_resume(resume_text: str) -> Dict[str, Any]:
        """Analyze resume and extract insights"""
        # Mock AI analysis - replace with actual AI service
        skills = AICareerService._extract_skills(resume_text)
        experience = AICareerService._analyze_experience(resume_text)
        
        return {
            'skills': skills,
            'experience_level': experience['level'],
            'years_experience': experience['years'],
            'education': AICareerService._extract_education(resume_text),
            'suggestions': AICareerService._generate_suggestions(resume_text),
            'score': AICareerService._calculate_resume_score(resume_text)
        }
    
    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common tech skills - expand this list
        skill_keywords = [
            'python', 'javascript', 'react', 'django', 'node.js', 'sql',
            'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'java',
            'c++', 'machine learning', 'data analysis', 'project management'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return found_skills
    
    @staticmethod
    def _analyze_experience(text: str) -> Dict[str, Any]:
        """Analyze experience level from resume"""
        # Simple heuristic - count years mentioned
        years_pattern = r'(\d+)\s*(?:years?|yrs?)'
        years_matches = re.findall(years_pattern, text.lower())
        
        total_years = sum(int(year) for year in years_matches) if years_matches else 0
        
        if total_years < 2:
            level = 'entry'
        elif total_years < 5:
            level = 'mid'
        elif total_years < 10:
            level = 'senior'
        else:
            level = 'executive'
        
        return {'years': total_years, 'level': level}
    
    @staticmethod
    def _extract_education(text: str) -> List[Dict[str, str]]:
        """Extract education information"""
        # Simple pattern matching for degrees
        degree_patterns = [
            r'(bachelor|master|phd|doctorate).*?(?:in|of)\s*([^\n,]+)',
            r'(b\.?s\.?|m\.?s\.?|ph\.?d\.?)\s*(?:in|of)?\s*([^\n,]+)'
        ]
        
        education = []
        for pattern in degree_patterns:
            matches = re.findall(pattern, text.lower())
            for match in matches:
                education.append({
                    'degree': match[0].title(),
                    'field': match[1].strip().title()
                })
        
        return education
    
    @staticmethod
    def _generate_suggestions(text: str) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        if 'objective' not in text.lower() and 'summary' not in text.lower():
            suggestions.append("Add a professional summary or objective statement")
        
        if len(re.findall(r'\b\d{4}\b', text)) < 2:
            suggestions.append("Include specific dates for your work experience")
        
        if 'achievement' not in text.lower() and 'accomplish' not in text.lower():
            suggestions.append("Highlight specific achievements and accomplishments")
        
        return suggestions
    
    @staticmethod
    def _calculate_resume_score(text: str) -> float:
        """Calculate overall resume score"""
        score = 0.0
        
        # Length check
        if 200 <= len(text) <= 2000:
            score += 0.2
        
        # Skills mentioned
        skills = AICareerService._extract_skills(text)
        score += min(len(skills) * 0.1, 0.3)
        
        # Experience mentioned
        if 'experience' in text.lower():
            score += 0.2
        
        # Education mentioned
        if any(word in text.lower() for word in ['university', 'college', 'degree']):
            score += 0.15
        
        # Contact info
        if '@' in text and any(char.isdigit() for char in text):
            score += 0.15
        
        return min(score, 1.0)
    
    @staticmethod
    def calculate_job_match(user_profile, job) -> Dict[str, Any]:
        """Calculate job match score and reasons"""
        # Mock implementation - replace with actual AI
        user_skills = set(skill.lower() for skill in user_profile.get('skills', []))
        job_requirements = set(job.requirements.lower().split()) if job.requirements else set()
        
        # Simple skill matching
        matching_skills = user_skills.intersection(job_requirements)
        match_score = len(matching_skills) / max(len(job_requirements), 1) if job_requirements else 0.5
        
        return {
            'score': min(match_score, 1.0),
            'matching_skills': list(matching_skills),
            'missing_skills': list(job_requirements - user_skills),
            'reasons': [
                f"You have {len(matching_skills)} matching skills",
                f"Job matches your {user_profile.get('experience_level', 'current')} level"
            ]
        }