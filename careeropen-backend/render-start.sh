#!/usr/bin/env bash
# Exit on error
set -o errexit
set -x  # Enable debugging

# Change to the project root directory
cd "$(dirname "$0")/.." || exit 1

# Set Python path to include the project root
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Print debug information
echo "=== Debug Information ==="
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Contents of current directory:"
ls -la
echo "Contents of careeropen-backend directory:"
ls -la careeropen-backend/

# Start Gunicorn with the application
# Using 2 workers for the free tier (adjust based on your needs)
echo "Starting Gunicorn..."
exec gunicorn --worker-tmp-dir /dev/shm \
  --workers=2 \
  --threads=4 \
  --worker-class=gthread \
  --log-file=- \
  --bind=0.0.0.0:${PORT:-10000} \
  --pythonpath . \
  careeropen_backend.core.wsgi:application
