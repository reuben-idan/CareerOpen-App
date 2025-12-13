import sys
import os

print("Python version:", sys.version)
print("\nPython path:")
for p in sys.path:
    print(f"- {p}")

print("\nCurrent working directory:", os.getcwd())
print("\nDirectory contents:")
for item in os.listdir('.'):
    print(f"- {item}")

print("\nBackend directory contents:")
for item in os.listdir('careeropen-backend'):
    print(f"- {item}")

print("\nAttempting to import careeropen_backend...")
try:
    import careeropen_backend
    print("✅ Successfully imported careeropen_backend")
    print("Module location:", careeropen_backend.__file__)
except ImportError as e:
    print("❌ Failed to import careeropen_backend:")
    print(e)
