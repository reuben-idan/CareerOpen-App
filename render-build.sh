#!/bin/bash
# Exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run database migrations
python manage.py migrate
