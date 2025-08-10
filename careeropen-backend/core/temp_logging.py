"""
Enhanced logging configuration to help debug login and application issues.
This file overrides the default Django logging configuration.
"""

import os
import logging
from pathlib import Path

# Ensure the logs directory exists
log_dir = Path('C:/Users/reube/CareerOpen-App/logs')
log_dir.mkdir(parents=True, exist_ok=True)

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
            'stream': 'ext://sys.stdout',
        },
        'debug_file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(log_dir, 'django_debug.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(log_dir, 'django_error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
        'accounts_debug': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(log_dir, 'accounts_debug.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
        'accounts_error': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(log_dir, 'accounts_error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'detailed',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console', 'debug_file'],
            'level': 'INFO',  # Set to DEBUG to see all SQL queries
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console', 'accounts_debug', 'accounts_error'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'accounts.views': {
            'handlers': ['console', 'accounts_debug', 'accounts_error'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'accounts.serializers': {
            'handlers': ['console', 'accounts_debug', 'accounts_error'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'core.middleware': {
            'handlers': ['console', 'debug_file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console', 'debug_file', 'error_file'],
        'level': 'DEBUG',
    },
}

# Add a test log message to verify logging is working
try:
    logger = logging.getLogger('accounts')
    logger.info("=== ACCOUNTS LOGGING CONFIGURATION LOADED SUCCESSFULLY ===")
    logger.debug("Debug logging is enabled")
    logger.info("Info logging is enabled")
    logger.warning("Warning logging is enabled")
    logger.error("Error logging is enabled")
    logger.critical("Critical logging is enabled")
except Exception as e:
    print(f"Error setting up logging: {e}")
