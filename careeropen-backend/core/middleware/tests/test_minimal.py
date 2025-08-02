"""Minimal test file to isolate the test collection issue."""
import pytest
from django.test import RequestFactory
from django.http import JsonResponse

def test_minimal():
    """A minimal test that should always pass."""
    assert 1 + 1 == 2

class TestMinimal:
    """Minimal test class to verify test discovery."""
    
    def test_minimal_class(self):
        """A minimal test method that should always pass."""
        assert 2 + 2 == 4
