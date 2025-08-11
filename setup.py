from setuptools import setup, find_packages

setup(
    name="careeropen",
    version="0.1.0",
    packages=find_packages(include=['careeropen-backend', 'careeropen-backend.*']),
    install_requires=[
        # Core dependencies
        'Django>=5.2',
        'djangorestframework>=3.15',
        'psycopg2-binary>=2.9.9',
        'redis>=4.6.0',
        'gunicorn>=21.2.0',
        'whitenoise>=6.6.0',
        'boto3>=1.28.0',
        'django-storages>=1.14.0',
        'python-dotenv>=1.0.0',
    ],
    python_requires='>=3.8',
    author="CareerOpen Team",
    author_email="your.email@example.com",
    description="CareerOpen - Job application tracking system",
    url="https://github.com/yourusername/CareerOpen-App",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
