from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from django.core.validators import MinValueValidator, MaxValueValidator


class ConnectionStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    ACCEPTED = 'accepted', 'Accepted'
    DECLINED = 'declined', 'Declined'
    BLOCKED = 'blocked', 'Blocked'
    REMOVED = 'removed', 'Removed'


class Connection(models.Model):
    """
    Represents a connection request between two users.
    Connections are bidirectional once accepted.
    """
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_connections',
        help_text='The user who initiated the connection'
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_connections',
        help_text='The user who received the connection request'
    )
    status = models.CharField(
        max_length=20,
        choices=ConnectionStatus.choices,
        default=ConnectionStatus.PENDING,
        help_text='Status of the connection request'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    message = models.TextField(
        blank=True,
        null=True,
        help_text='Optional message sent with the connection request'
    )
    
    class Meta:
        unique_together = ('from_user', 'to_user')
        ordering = ['-updated_at']
        verbose_name = 'Connection'
        verbose_name_plural = 'Connections'
    
    def __str__(self):
        return f'{self.from_user} -> {self.to_user} ({self.status})'
    
    def accept(self):
        """Accept the connection request."""
        self.status = ConnectionStatus.ACCEPTED
        self.save(update_fields=['status', 'updated_at'])
    
    def decline(self):
        """Decline the connection request."""
        self.status = ConnectionStatus.DECLINED
        self.save(update_fields=['status', 'updated_at'])
    
    def block(self):
        """Block the connection request."""
        self.status = ConnectionStatus.BLOCKED
        self.save(update_fields=['status', 'updated_at'])
    
    @classmethod
    def get_connections(cls, user):
        """Get all accepted connections for a user."""
        return cls.objects.filter(
            Q(from_user=user) | Q(to_user=user),
            status=ConnectionStatus.ACCEPTED
        )
    
    @classmethod
    def get_pending_requests(cls, user):
        """Get all pending connection requests for a user."""
        return cls.objects.filter(
            to_user=user,
            status=ConnectionStatus.PENDING
        )


class Follow(models.Model):
    """
    Represents a one-way following relationship between users.
    Users can follow other users without requiring approval.
    """
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='following',
        help_text='The user who is following'
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='followers',
        help_text='The user being followed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        verbose_name = 'Follow'
        verbose_name_plural = 'Follows'
    
    def __str__(self):
        return f'{self.follower} follows {self.following}'


class Message(models.Model):
    """
    Represents a direct message between two users.
    Messages are only allowed between connected users.
    """
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        help_text='The user who sent the message'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages',
        help_text='The user who received the message'
    )
    content = models.TextField(help_text='The message content')
    is_read = models.BooleanField(default=False, help_text='Whether the message has been read')
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True, help_text='When the message was read')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
    
    def __str__(self):
        return f'Message from {self.sender} to {self.recipient}'
    
    def mark_as_read(self):
        """Mark the message as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class Notification(models.Model):
    """
    Represents a notification for a user.
    Notifications can be for various events like new messages, connection requests, etc.
    """
    class NotificationType(models.TextChoices):
        CONNECTION_REQUEST = 'connection_request', 'Connection Request'
        CONNECTION_ACCEPTED = 'connection_accepted', 'Connection Accepted'
        NEW_MESSAGE = 'new_message', 'New Message'
        JOB_APPLICATION = 'job_application', 'Job Application'
        JOB_APPLICATION_UPDATE = 'job_application_update', 'Job Application Update'
        MENTION = 'mention', 'Mention'
        SYSTEM = 'system', 'System Notification'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text='The user who will receive the notification'
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        help_text='The type of notification'
    )
    title = models.CharField(max_length=200, help_text='The notification title')
    message = models.TextField(help_text='The notification message')
    is_read = models.BooleanField(default=False, help_text='Whether the notification has been read')
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True, help_text='When the notification was read')
    
    # Generic foreign key fields to link to the related object
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    
    # Additional data as JSON
    data = models.JSONField(default=dict, blank=True, help_text='Additional data for the notification')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
    
    def __str__(self):
        return f'{self.notification_type} - {self.title}'
    
    def mark_as_read(self):
        """Mark the notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    @classmethod
    def create_notification(cls, user, notification_type, title, message, content_object=None, data=None):
        """Helper method to create a new notification."""
        notification = cls(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            data=data or {}
        )
        
        if content_object is not None:
            notification.content_object = content_object
        
        notification.save()
        return notification
