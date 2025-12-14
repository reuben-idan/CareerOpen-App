from django.db import models
from django.utils import timezone
import uuid

class ActiveObjectsManager(models.Manager):
    """Manager to filter out soft-deleted objects."""
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class BaseModel(models.Model):
    """Base model with audit fields, soft deletes, and UUIDs."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    objects = ActiveObjectsManager()
    all_objects = models.Manager()
    
    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['created_at', 'is_active']),
            models.Index(fields=['updated_at', 'is_deleted']),
        ]
    
    def soft_delete(self):
        """Soft delete the object."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])
    
    def restore(self):
        """Restore soft deleted object."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])