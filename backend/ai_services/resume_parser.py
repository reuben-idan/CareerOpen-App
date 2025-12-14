import PyPDF2
import docx
import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import logging

logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    pass

class ResumeParser:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        
        # Common skill keywords
        self.skill_patterns = {
            'programming': ['python', 'javascript', 'java', 'react', 'node.js', 'sql', 'html', 'css'],
            'frameworks': ['django', 'flask', 'express', 'angular', 'vue', 'spring', 'laravel'],
            'databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite'],
            'tools': ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins'],
            'soft_skills': ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical']
        }
    
    def parse_resume(self, file_path):
        """Parse resume and extract structured information."""
        try:
            # Extract text based on file type
            if file_path.endswith('.pdf'):
                text = self._extract_pdf_text(file_path)
            elif file_path.endswith('.docx'):
                text = self._extract_docx_text(file_path)
            else:
                return {'error': 'Unsupported file format'}
            
            if not text:
                return {'error': 'Could not extract text from file'}
            
            # Parse structured information
            parsed_data = {
                'raw_text': text,
                'contact_info': self._extract_contact_info(text),
                'skills': self._extract_skills(text),
                'experience': self._extract_experience(text),
                'education': self._extract_education(text),
                'summary': self._generate_summary(text)
            }
            
            return parsed_data
        except Exception as e:
            logger.error(f"Resume parsing error: {e}")
            return {'error': str(e)}
    
    def _extract_pdf_text(self, file_path):
        """Extract text from PDF file."""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ''
                for page in reader.pages:
                    text += page.extract_text() + '\n'
                return text
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            return ''
    
    def _extract_docx_text(self, file_path):
        """Extract text from DOCX file."""
        try:
            doc = docx.Document(file_path)
            text = ''
            for paragraph in doc.paragraphs:
                text += paragraph.text + '\n'
            return text
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}")
            return ''
    
    def _extract_contact_info(self, text):
        """Extract contact information using regex patterns."""
        contact_info = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Phone pattern
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info['phone'] = ''.join(phones[0])
        
        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            contact_info['linkedin'] = f"https://{linkedin[0]}"
        
        return contact_info
    
    def _extract_skills(self, text):
        """Extract skills from resume text."""
        text_lower = text.lower()
        found_skills = []
        
        # Check for predefined skill patterns
        for category, skills in self.skill_patterns.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills.append(skill)
        
        # Look for skills section
        skills_section = self._find_section(text, ['skills', 'technical skills', 'competencies'])
        if skills_section:
            # Extract additional skills from skills section
            words = word_tokenize(skills_section.lower())
            for word in words:
                if len(word) > 2 and word not in self.stop_words:
                    if word not in [s.lower() for s in found_skills]:
                        found_skills.append(word.title())
        
        return list(set(found_skills))[:20]  # Limit to 20 skills
    
    def _extract_experience(self, text):
        """Extract work experience information."""
        experience = []
        
        # Look for experience section
        exp_section = self._find_section(text, ['experience', 'work experience', 'employment'])
        if not exp_section:
            return experience
        
        # Split by common delimiters
        entries = re.split(r'\n\s*\n|\n(?=[A-Z][a-z])', exp_section)
        
        for entry in entries[:5]:  # Limit to 5 entries
            if len(entry.strip()) > 20:  # Filter out short entries
                # Extract dates
                date_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|present|current)'
                dates = re.findall(date_pattern, entry, re.IGNORECASE)
                
                # Extract company/title (first line usually)
                lines = entry.strip().split('\n')
                title_line = lines[0] if lines else ''
                
                exp_entry = {
                    'title': title_line[:100],  # Limit length
                    'description': entry[:500],  # Limit description
                    'dates': dates[0] if dates else None
                }
                experience.append(exp_entry)
        
        return experience
    
    def _extract_education(self, text):
        """Extract education information."""
        education = []
        
        # Look for education section
        edu_section = self._find_section(text, ['education', 'academic background'])
        if not edu_section:
            return education
        
        # Common degree patterns
        degree_patterns = [
            r'(bachelor|master|phd|doctorate|associate).*?(degree|of|in)\s+([^\n,]+)',
            r'(b\.?s\.?|m\.?s\.?|m\.?a\.?|ph\.?d\.?)\s+([^\n,]+)',
        ]
        
        for pattern in degree_patterns:
            matches = re.findall(pattern, edu_section, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    degree_info = ' '.join(match).strip()
                else:
                    degree_info = match.strip()
                
                if degree_info and len(degree_info) > 5:
                    education.append({'degree': degree_info[:200]})
        
        return education[:3]  # Limit to 3 entries
    
    def _find_section(self, text, section_names):
        """Find and extract a specific section from resume text."""
        text_lines = text.split('\n')
        section_start = -1
        
        for i, line in enumerate(text_lines):
            for section_name in section_names:
                if section_name.lower() in line.lower() and len(line.strip()) < 50:
                    section_start = i
                    break
            if section_start != -1:
                break
        
        if section_start == -1:
            return ''
        
        # Find section end (next section or end of document)
        section_end = len(text_lines)
        for i in range(section_start + 1, len(text_lines)):
            line = text_lines[i].strip()
            if (line.isupper() and len(line) < 30) or \
               (line.endswith(':') and len(line) < 30):
                section_end = i
                break
        
        return '\n'.join(text_lines[section_start:section_end])
    
    def _generate_summary(self, text):
        """Generate a brief summary of the resume."""
        sentences = sent_tokenize(text)
        
        # Take first few meaningful sentences
        summary_sentences = []
        for sentence in sentences[:10]:
            if len(sentence) > 20 and len(sentence) < 200:
                summary_sentences.append(sentence)
                if len(summary_sentences) >= 3:
                    break
        
        return ' '.join(summary_sentences)

# Global instance
resume_parser = ResumeParser()