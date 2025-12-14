import openai
from decouple import config
import logging

logger = logging.getLogger(__name__)

class OpenAIClient:
    def __init__(self):
        self.api_key = config('OPENAI_API_KEY', default='')
        if self.api_key:
            openai.api_key = self.api_key
        else:
            logger.warning("OpenAI API key not configured")
    
    def is_available(self):
        return bool(self.api_key)
    
    async def generate_completion(self, prompt, max_tokens=500, temperature=0.7):
        """Generate text completion using OpenAI."""
        if not self.is_available():
            return {"error": "OpenAI not configured"}
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return {"error": str(e)}
    
    def generate_completion_sync(self, prompt, max_tokens=500, temperature=0.7):
        """Synchronous version for non-async contexts."""
        if not self.is_available():
            return {"error": "OpenAI not configured"}
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return {"error": str(e)}

# Global instance
openai_client = OpenAIClient()