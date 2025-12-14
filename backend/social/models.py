from django.db import models
from core.models import BaseModel
from authentication.models import User

class Connection(BaseModel):
    """User connections/network."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('blocked', 'Blocked'),
    ]
    
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_connections')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_connections')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    message = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['from_user', 'to_user']
        indexes = [
            models.Index(fields=['from_user', 'status']),
            models.Index(fields=['to_user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]

class Post(BaseModel):
    """User posts for feed."""
    POST_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('article', 'Article'),
        ('job_share', 'Job Share'),
    ]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='text', db_index=True)
    media_url = models.URLField(blank=True)
    likes_count = models.IntegerField(default=0, db_index=True)
    comments_count = models.IntegerField(default=0, db_index=True)
    shares_count = models.IntegerField(default=0, db_index=True)
    is_pinned = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['author', 'created_at']),
            models.Index(fields=['post_type', 'created_at']),
            models.Index(fields=['likes_count', 'created_at']),
            models.Index(fields=['is_pinned', 'created_at']),
        ]

class PostLike(BaseModel):
    """Post likes."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['post', 'user']
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

class Comment(BaseModel):
    """Post comments."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['author', 'created_at']),
            models.Index(fields=['parent', 'created_at']),
        ]