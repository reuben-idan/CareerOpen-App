from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from . import views

# API Info
API_TITLE = 'CareerOpen Network API'
API_DESCRIPTION = 'API endpoints for managing professional network connections, messages, and notifications.'
API_VERSION = '1.0.0'

# API Router
router = DefaultRouter()
router.register(r'connections', views.ConnectionViewSet, basename='connection')
router.register(r'follows', views.FollowViewSet, basename='follow')
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Custom URL patterns
urlpatterns = [
    # Default router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('connections/pending/', 
         views.ConnectionViewSet.as_view({'get': 'pending'}), 
         name='connection_pending'),
    path('connections/connections/', 
         views.ConnectionViewSet.as_view({'get': 'connections'}), 
         name='connection_connections'),
    path('follows/followers/', 
         views.FollowViewSet.as_view({'get': 'followers'}), 
         name='follow_followers'),
    path('follows/following/', 
         views.FollowViewSet.as_view({'get': 'following'}), 
         name='follow_following'),
    path('messages/conversations/', 
         views.MessageViewSet.as_view({'get': 'conversations'}), 
         name='message_conversations'),
    path('messages/with_user/<int:user_id>/', 
         views.MessageViewSet.as_view({'get': 'with_user'}), 
         name='message_with_user'),
    path('notifications/unread_count/', 
         views.NotificationViewSet.as_view({'get': 'unread_count'}), 
         name='notification_unread_count'),
    path('notifications/mark_as_read/', 
         views.NotificationViewSet.as_view({'post': 'mark_as_read'}), 
         name='notification_mark_as_read'),
    path('notifications/mark_all_as_read/', 
         views.NotificationViewSet.as_view({'post': 'mark_all_as_read'}), 
         name='notification_mark_all_as_read'),
]
