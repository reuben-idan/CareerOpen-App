#!/usr/bin/env bash
# Exit on error
set -o errexit

# Start Gunicorn with the application
# Using 2 workers for the free tier (adjust based on your needs)
exec gunicorn --worker-tmp-dir /dev/shm \
  --workers=2 \
  --threads=4 \
  --worker-class=gthread \
  --log-file=- \
  --bind=0.0.0.0:${PORT:-10000} \
  careeropen_backend.wsgi:application
