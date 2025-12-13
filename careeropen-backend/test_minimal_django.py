"""
Minimal Django test case to verify test runner.
"""
import os
import sys
import django
from django.test import SimpleTestCase

# Add the project root to the Python path
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class MinimalDjangoTest(SimpleTestCase):
    """Minimal test case to verify Django test runner."""
    
    def test_minimal_assertion(self):
        ""Test that 1 + 1 equals 2."""
        self.assertEqual(1 + 1, 2)

if __name__ == "__main__":
    import django
    from django.core.management import execute_from_command_line
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    # Run the tests
    execute_from_command_line([os.path.basename(__file__), 'test'])
    
    # If we get here, the test passed
    print("\nSUCCESS: Minimal Django test passed!")
