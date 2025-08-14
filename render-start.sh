#!/bin/bash
# Exit on error
set -o errexit

# Start Gunicorn
if [[ -z "$PORT" ]]; then
    PORT=8000
fi

exec gunicorn wsgi:application \
     --bind 0.0.0.0:$PORT \
     --workers 3 \
     --worker-class gthread \
     --threads 3 \
     --timeout 120 \
     --keep-alive 5 \
     --log-level=info
