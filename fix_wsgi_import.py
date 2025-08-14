import os
import sys

def fix_wsgi_import():
    """Fix the WSGI import error by setting up the Python path correctly."""
    # Get the project root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
    
    # Add the project root to Python path
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    # Set the DJANGO_SETTINGS_MODULE environment variable
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    print(f"✅ Added to Python path: {project_root}")
    print(f"✅ Set DJANGO_SETTINGS_MODULE=core.settings")
    
    # Try to import the WSGI application
    try:
        from core.wsgi import application
        print("✅ Successfully imported WSGI application")
        return application
    except ImportError as e:
        print(f"❌ Failed to import WSGI application: {e}")
        return None

if __name__ == "__main__":
    fix_wsgi_import()
