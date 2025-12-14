from django.db import models
from core.models import BaseModel
from authentication.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Notification(BaseModel):
    """User notifications system."""
    NOTIFICATION_TYPES = [
        ('connection_request', 'Connection Request'),
        ('connection_accepted', 'Connection Accepted'),
        ('job_application', 'Job Application'),
        ('application_status', 'Application Status Update'),
        ('message', 'New Message'),
        ('post_like', 'Post Liked'),
        ('post_comment', 'Post Comment'),
        ('job_match', 'Job Match'),
        ('profile_view', 'Profile View'),
        ('system', 'System Notification'),
    ]
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, db_index=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Generic foreign key for related objects
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.UUIDField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    class Meta:
        indexes = [
            models.Index(fields=['recipient', 'is_read', 'created_at']),
            models.Index(fields=['notification_type', 'created_at']),
            models.Index(fields=['sender', 'created_at']),
        ]

class NotificationPreference(BaseModel):
    """User notification preferences."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    connection_requests = models.BooleanField(default=True)
    job_alerts = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)
    post_interactions = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)