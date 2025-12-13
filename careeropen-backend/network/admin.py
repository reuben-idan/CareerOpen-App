from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Connection, Follow, Message, Notification


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    """Admin interface for Connection model."""
    list_display = ('id', 'from_user_link', 'to_user_link', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = (
        'from_user__email', 'from_user__first_name', 'from_user__last_name',
        'to_user__email', 'to_user__first_name', 'to_user__last_name',
        'message'
    )
    readonly_fields = ('created_at', 'updated_at', 'from_user_link', 'to_user_link')
    date_hierarchy = 'created_at'
    
    def from_user_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.from_user.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.from_user))
    from_user_link.short_description = 'From User'
    from_user_link.admin_order_field = 'from_user__email'
    
    def to_user_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.to_user.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.to_user))
    to_user_link.short_description = 'To User'
    to_user_link.admin_order_field = 'to_user__email'


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    """Admin interface for Follow model."""
    list_display = ('id', 'follower_link', 'following_link', 'created_at')
    search_fields = (
        'follower__email', 'follower__first_name', 'follower__last_name',
        'following__email', 'following__first_name', 'following__last_name'
    )
    readonly_fields = ('created_at', 'follower_link', 'following_link')
    date_hierarchy = 'created_at'
    
    def follower_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.follower.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.follower))
    follower_link.short_description = 'Follower'
    follower_link.admin_order_field = 'follower__email'
    
    def following_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.following.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.following))
    following_link.short_description = 'Following'
    following_link.admin_order_field = 'following__email'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin interface for Message model."""
    list_display = ('id', 'sender_link', 'recipient_link', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = (
        'sender__email', 'sender__first_name', 'sender__last_name',
        'recipient__email', 'recipient__first_name', 'recipient__last_name',
        'content'
    )
    readonly_fields = ('created_at', 'read_at', 'sender_link', 'recipient_link')
    date_hierarchy = 'created_at'
    
    def sender_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.sender.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.sender))
    sender_link.short_description = 'Sender'
    sender_link.admin_order_field = 'sender__email'
    
    def recipient_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.recipient.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.recipient))
    recipient_link.short_description = 'Recipient'
    recipient_link.admin_order_field = 'recipient__email'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin interface for Notification model."""
    list_display = ('id', 'user_link', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = (
        'user__email', 'user__first_name', 'user__last_name',
        'title', 'message', 'notification_type'
    )
    readonly_fields = ('created_at', 'read_at', 'user_link', 'content_object_link')
    date_hierarchy = 'created_at'
    
    def user_link(self, obj):
        url = reverse('admin:accounts_user_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, str(obj.user))
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user__email'
    
    def content_object_link(self, obj):
        if obj.content_object is None:
            return "-"
        
        # Get the admin change URL for the related object
        content_type = ContentType.objects.get_for_model(obj.content_object)
        app_label = content_type.app_label
        model_name = content_type.model
        
        try:
            url = reverse(f'admin:{app_label}_{model_name}_change', args=[obj.object_id])
            return format_html('<a href="{}">{}</a>', url, str(obj.content_object))
        except NoReverseMatch:
            return str(obj.content_object)
    content_object_link.short_description = 'Related Object'
