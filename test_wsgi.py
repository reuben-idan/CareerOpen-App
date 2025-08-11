import os
import sys

def test_wsgi():
    # Add the project root to Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)
    
    # Add the backend directory to Python path
    backend_path = os.path.join(project_root, 'careeropen-backend')
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    try:
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        print("✅ WSGI application loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error loading WSGI application: {e}")
        return False

if __name__ == "__main__":
    test_wsgi()
