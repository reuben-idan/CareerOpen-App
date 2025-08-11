import sys
import os
from pathlib import Path

def fix_imports():
    """Fix Python import paths for CareerOpen development."""
    # Get the project root directory
    project_root = Path(__file__).parent.absolute()
    backend_dir = project_root / "careeropen-backend"
    
    print("🔧 Fixing Python import paths...")
    
    # Add the backend directory to PYTHONPATH
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))
        print(f"✅ Added {backend_dir} to Python path")
    
    # Verify the import
    try:
        import careeropen_backend
        print("✅ Successfully imported careeropen_backend")
        print(f"Module location: {careeropen_backend.__file__}")
        return True
    except ImportError as e:
        print(f"❌ Failed to import careeropen_backend: {e}")
        print("\nTroubleshooting steps:")
        print(f"1. Make sure you're running from the project root: {project_root}")
        print(f"2. Verify that {backend_dir} contains the backend code")
        print(f"3. Check that {backend_dir} contains an __init__.py file")
        return False

if __name__ == "__main__":
    if fix_imports():
        print("\n✨ Import paths fixed successfully! You can now run your tests.")
        print("\nTry running:")
        print("  python -m pytest")
        print("  python test_health.py")
    else:
        print("\n❌ Failed to fix import paths. Please check the error messages above.")
        sys.exit(1)
