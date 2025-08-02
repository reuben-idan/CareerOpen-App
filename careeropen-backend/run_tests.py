#!/usr/bin/env python
"""
Simple test runner script to diagnose test execution issues.
"""
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

def run_tests():
    # Configure Django settings for testing
    os.environ['DJANGO_SETTINGS_MODULE'] = 'core.test_settings'
    django.setup()
    
    # Get the test runner
    TestRunner = get_runner(settings)
    
    # Run tests with increased verbosity
    test_runner = TestRunner(verbosity=2, interactive=True)
    failures = test_runner.run_tests(['accounts', 'jobs'])
    
    # Exit with non-zero code if tests failed
    sys.exit(bool(failures))

if __name__ == '__main__':
    run_tests()
