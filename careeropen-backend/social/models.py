from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import FileExtensionValidator


class Post(models.Model):
    """Professional posts for the feed"""
    POST_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('link', 'Link'),
        ('career_update', 'Career Update'),
    ]
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=3000)
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='text')
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    link_url = models.URLField(blank=True)
    link_title = models.CharField(max_length=200, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.email} - {self.content[:50]}"


class Reaction(models.Model):
    """Reactions to posts (like, celebrate, support, etc.)"""
    REACTION_TYPES = [
        ('like', '👍'),
        ('celebrate', '🎉'),
        ('support', '💪'),
        ('love', '❤️'),
        ('insightful', '💡'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=20, choices=REACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'post']
    
    def __str__(self):
        return f"{self.user.email} {self.reaction_type} {self.post.id}"


class Comment(models.Model):
    """Comments on posts"""
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.author.email} on {self.post.id}"