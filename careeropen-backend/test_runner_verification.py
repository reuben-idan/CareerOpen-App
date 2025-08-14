"""
Test script to verify the custom test runner setup.
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to the Python path
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.test_settings')
django.setup()

from django.test import TestCase
from django.conf import settings

class TestRunnerVerification(TestCase):
    """Test case to verify the test runner setup."""
    
    def test_python_path(self):
        ""Test that the project root is in the Python path."""
        project_root = str(Path(__file__).parent)
        self.assertIn(project_root, sys.path, 
                     f"Project root {project_root} not in Python path")
        print("\nPython Path:")
        for i, path in enumerate(sys.path, 1):
            print(f"{i}. {path}")
    
    def test_settings(self):
        ""Test that the test settings are loaded correctly."""
        self.assertEqual(settings.TEST_RUNNER, 'core.test_runner.CustomTestRunner',
                        "Custom test runner not configured correctly")
        self.assertEqual(settings.DATABASES['default']['ENGINE'],
                       'django.db.backends.sqlite3',
                       "Test database engine not set to SQLite")
        print("\nTest settings loaded correctly")
    
    def test_import_serializers(self):
        ""Test that we can import the serializers module."""
        try:
            from accounts.serializers import UserRegistrationSerializer, SimpleRegistrationSerializer
            print("\nSUCCESS: Successfully imported serializers:")
            print(f"- UserRegistrationSerializer: {UserRegistrationSerializer}")
            print(f"- SimpleRegistrationSerializer: {SimpleRegistrationSerializer}")
            self.assertTrue(True, "Successfully imported serializers")
        except ImportError as e:
            self.fail(f"Failed to import serializers: {e}")

if __name__ == "__main__":
    import unittest
    unittest.main()
