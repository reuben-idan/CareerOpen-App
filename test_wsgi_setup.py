"""
Test script to verify WSGI setup works correctly.
Run this to test if the WSGI application can be imported.
"""
import os
import sys
from pathlib import Path

def test_wsgi_import():
    print("=" * 50)
    print("Testing WSGI Import")
    print("=" * 50)
    
    # Get the project root directory
    project_root = Path(__file__).resolve().parent
    print(f"Project root: {project_root}")
    
    # Add the project root to Python path if not already there
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))
    
    # Add the backend directory to Python path if not already there
    backend_dir = project_root / 'careeropen-backend'
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))
    
    print("\nPython path:")
    for p in sys.path:
        print(f"- {p}")
    
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    print("\nAttempting to import WSGI application...")
    try:
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        print("✅ Successfully imported WSGI application!")
        return True
    except Exception as e:
        print(f"❌ Failed to import WSGI application: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if test_wsgi_import():
        print("\n✅ WSGI setup is correct!")
    else:
        print("\n❌ There was an issue with the WSGI setup.")
