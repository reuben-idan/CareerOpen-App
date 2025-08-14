"""
Test script to import Django settings and identify any import errors.
"""
import os
import sys

# Add the project directory to the Python path
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
sys.path.append(project_path)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

# Try to import Django settings
try:
    print("Attempting to import Django settings...")
    from django.conf import settings
    print("✅ Successfully imported Django settings")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"DATABASES: {settings.DATABASES['default']['ENGINE']}")
except Exception as e:
    print(f"❌ Error importing Django settings: {e}")
    import traceback
    traceback.print_exc()
