"""
Enhanced logging configuration for debugging and monitoring.
This file provides comprehensive logging for all components of the application.
"""

import os
import logging
from pathlib import Path

# Ensure the logs directory exists in the project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Points to careeropen-backend's parent
log_dir = BASE_DIR / 'logs'
try:
    log_dir.mkdir(parents=True, exist_ok=True)
    print(f"Log directory created at: {log_dir}")
except Exception as e:
    print(f"Error creating log directory at {log_dir}: {e}")
    # Fall back to a directory in the system temp folder if needed
    import tempfile
    log_dir = Path(tempfile.gettempdir()) / 'careeropen_logs'
    log_dir.mkdir(exist_ok=True)
    print(f"Using fallback log directory at: {log_dir}")

# Clear existing log files
for filename in ['django_debug.log', 'django_error.log', 'accounts_debug.log', 
                'accounts_error.log', 'login_errors.log', 'request_errors.log']:
    try:
        log_file = log_dir / filename
        if log_file.exists():
            log_file.unlink()
        log_file.touch()
    except Exception as e:
        print(f"Warning: Could not reset log file {filename}: {e}")

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
        'detailed': {
            'format': '%(asctime)s [%(levelname)s] %(name)s.%(funcName)s:%(lineno)d - %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'request': {
            'format': '%(asctime)s [%(levelname)s] %(message)s\nRequest: %(request_method)s %(request_path)s\nUser: %(user)s\nIP: %(ip)s\n',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'detailed',
        },
        'debug_file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'django_debug.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'django_error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'accounts_debug': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'accounts_debug.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
        'accounts_error': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'accounts_error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'login_errors': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'login_errors.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'request_errors': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(log_dir / 'request_errors.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'request',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console', 'error_file', 'request_errors'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console', 'debug_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console', 'accounts_debug', 'accounts_error'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'jobs': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'network': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'core': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'login': {
            'handlers': ['console', 'login_errors'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console', 'debug_file', 'error_file'],
        'level': 'WARNING',
    },
}

# Test the logging configuration
try:
    logger = logging.getLogger('accounts')
    logger.info("=== ENHANCED LOGGING CONFIGURATION LOADED SUCCESSFULLY ===")
    logger.debug("Debug logging is enabled")
    logger.info("Info logging is enabled")
    logger.warning("Warning logging is enabled")
    logger.error("Error logging is enabled")
    logger.critical("Critical logging is enabled")
    
    # Log the log file paths
    for handler in logging.getLogger('accounts').handlers:
        if hasattr(handler, 'baseFilename'):
            logger.info(f"Logging to file: {handler.baseFilename}")
            
except Exception as e:
    print(f"Error setting up logging: {e}")
