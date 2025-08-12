"""
Enhanced logging configuration for debugging and monitoring.
This file provides comprehensive logging for all components of the application.
"""

import os
import json
import logging
import traceback
from pathlib import Path
from datetime import datetime

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

# Clear existing log files only in development
if os.environ.get('DJANGO_DEVELOPMENT', 'False').lower() == 'true':
    for filename in ['django_debug.log', 'django_error.log', 'api_requests.log', 
                    'accounts.log', 'jobs.log', 'errors.log']:
        try:
            log_file = log_dir / filename
            if log_file.exists():
                log_file.unlink()
            log_file.touch()
        except Exception as e:
            print(f"Warning: Could not reset log file {filename}: {e}")

class JSONFormatter(logging.Formatter):
    """Custom formatter that outputs logs in JSON format."""
    def format(self, record):
        log_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
        
        # Add any extra fields
        if hasattr(record, 'data'):
            log_record.update(record.data)
            
        return json.dumps(log_record, default=str)

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
        'json': {
            '()': 'core.temp_logging_enhanced.JSONFormatter',
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
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple' if os.environ.get('DJANGO_DEVELOPMENT', 'False').lower() == 'true' else 'json',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'django_debug.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 10,
            'formatter': 'json',
            'encoding': 'utf-8',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'errors.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 10,
            'formatter': 'json',
            'encoding': 'utf-8',
        },
        'api_requests': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'api_requests.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 10,
            'formatter': 'json',
            'encoding': 'utf-8',
        },
        'accounts': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'accounts.log',
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'json',
            'encoding': 'utf-8',
        },
        'jobs': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'jobs.log',
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'json',
            'encoding': 'utf-8',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
            'formatter': 'detailed',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'error_file', 'api_requests'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # Set to DEBUG to log all SQL queries
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console', 'error_file', 'mail_admins'],
            'level': 'WARNING',
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console', 'accounts'],
            'level': 'INFO',
            'propagate': False,
        },
        'jobs': {
            'handlers': ['console', 'jobs', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'network': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'core': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'api': {
            'handlers': ['console', 'api_requests', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'security': {
            'handlers': ['console', 'error_file', 'mail_admins'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console', 'error_file'],
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
