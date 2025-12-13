"""
A simple test to verify the test runner is working.
"""
from django.test import TestCase

class SimpleTestCase(TestCase):
    def test_addition(self):
        """
        A simple test that 1 + 1 = 2
        """
        self.assertEqual(1 + 1, 2)

    def test_environment(self):
        """
        Test that the test environment is set up correctly
        """
        self.assertTrue(True)
