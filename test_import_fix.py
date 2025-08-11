import sys
import os

# Add the backend directory to Python path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

print(f"Python version: {sys.version}")
print(f"Python path: {sys.path}")
print(f"Current working directory: {os.getcwd()}")

# Try to import the module
try:
    import careeropen_backend
    print(f"✅ Successfully imported careeropen_backend from: {careeropen_backend.__file__}")
except ImportError as e:
    print(f"❌ Failed to import careeropen_backend: {e}")
    print("\nTroubleshooting steps:")
    print(f"1. Make sure the directory contains __init__.py: {os.path.join(backend_path, 'careeropen_backend', '__init__.py')}")
    print(f"2. Check directory structure:")
    for root, dirs, files in os.walk(backend_path):
        level = root.replace(backend_path, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            if f.endswith('.py') or f == '__init__.py':
                print(f"{subindent}{f}")
