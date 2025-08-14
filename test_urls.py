"""
Test script to check Django URL configuration and identify any issues.
"""
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

def setup_django():
    """Set up Django environment."""
    # Add the project directory to the Python path
    project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
    sys.path.append(project_path)
    
    # Set the DJANGO_SETTINGS_MODULE environment variable
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    # Initialize Django
    django.setup()

def test_urls():
    """Test URL configuration."""
    from django.urls import get_resolver
    
    try:
        print("Testing URL configuration...")
        resolver = get_resolver()
        print("✅ URL configuration is valid")
        
        # Print all registered URLs
        print("\nRegistered URLs:")
        for url_pattern in resolver.url_patterns:
            print(f"- {url_pattern.pattern}")
            
    except Exception as e:
        print(f"❌ Error in URL configuration: {e}")
        import traceback
        traceback.print_exc()

def test_middleware():
    """Test middleware configuration."""
    try:
        print("\nTesting middleware configuration...")
        from django.core.handlers.wsgi import WSGIHandler
        
        # Create a WSGI handler to test middleware
        handler = WSGIHandler()
        print("✅ Middleware configuration is valid")
        
        # Print all middleware classes
        print("\nMiddleware classes:")
        for middleware in settings.MIDDLEWARE:
            print(f"- {middleware}")
            
    except Exception as e:
        print(f"❌ Error in middleware configuration: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    setup_django()
    test_urls()
    test_middleware()
