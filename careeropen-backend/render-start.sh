#!/usr/bin/env bash
# Exit on error and enable debugging
set -o errexit
set -x

# Change to the directory containing the manage.py file
cd "$(dirname "$0")/.." || exit 1
cd careeropen-backend || exit 1

# Print debug information
echo "=== Debug Information ==="
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Contents of current directory:"
ls -la

# Verify Python can import the module
echo "Testing Python import..."
python -c "import sys; print('Python path:', sys.path); from core.wsgi import application; print('Successfully imported WSGI application')"

# Start Gunicorn with the application
echo "Starting Gunicorn..."
exec gunicorn --worker-tmp-dir /dev/shm \
  --workers=2 \
  --threads=4 \
  --worker-class=gthread \
  --log-file=- \
  --bind=0.0.0.0:${PORT:-10000} \
  core.wsgi:application
