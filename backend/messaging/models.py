from django.db import models
from core.models import BaseModel
from authentication.models import User

class Conversation(BaseModel):
    """Message conversations between users."""
    participants = models.ManyToManyField(User, related_name='conversations')
    title = models.CharField(max_length=200, blank=True)
    is_group = models.BooleanField(default=False)
    last_message_at = models.DateTimeField(null=True, blank=True, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['last_message_at', 'is_active']),
            models.Index(fields=['is_group', 'created_at']),
        ]

class Message(BaseModel):
    """Individual messages in conversations."""
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('system', 'System'),
    ]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    file_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender', 'created_at']),
            models.Index(fields=['is_read', 'created_at']),
        ]

class MessageRead(BaseModel):
    """Track message read status per user."""
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_by')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['message', 'user']
        indexes = [
            models.Index(fields=['user', 'read_at']),
            models.Index(fields=['message', 'read_at']),
        ]