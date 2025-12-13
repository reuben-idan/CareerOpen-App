"""
Custom test runner for the CareerOpen project.
"""
import os
import sys
from pathlib import Path

from django.test.runner import DiscoverRunner

class CustomTestRunner(DiscoverRunner):
    """Custom test runner that ensures the project root is in the Python path."""
    
    def setup_test_environment(self, **kwargs):
        """Set up the test environment."""
        # Add the project root to the Python path if it's not already there
        project_root = str(Path(__file__).parent.parent)
        if project_root not in sys.path:
            sys.path.insert(0, project_root)
        
        # Set the DJANGO_SETTINGS_MODULE if it's not already set
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
        
        # Print debug information
        print("\n=== Test Runner Setup ===")
        print(f"Project root: {project_root}")
        print(f"Python path: {sys.path}")
        print(f"Current working directory: {os.getcwd()}")
        print("========================\n")
        
        # Call the parent's setup
        super().setup_test_environment(**kwargs)
