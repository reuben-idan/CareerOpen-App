"""
Script to check Python imports and paths.
"""
import sys
import os

print("Python version:", sys.version)
print("\nPython path:")
for p in sys.path:
    print(f"- {p}")

print("\nCurrent working directory:", os.getcwd())
print("\nContents of accounts directory:")
print(os.listdir(os.path.join(os.path.dirname(__file__), 'accounts')))
print("\nContents of accounts/tests directory:")
print(os.listdir(os.path.join(os.path.dirname(__file__), 'accounts', 'tests')))
