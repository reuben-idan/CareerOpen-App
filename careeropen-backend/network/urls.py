from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from . import views, docs

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
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Default router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('connections/pending/', 
         views.ConnectionViewSet.as_view({'get': 'pending'}), 
         name='connection-pending'),
    path('connections/connections/', 
         views.ConnectionViewSet.as_view({'get': 'connections'}), 
         name='connection-list-connections'),
    path('follows/followers/', 
         views.FollowViewSet.as_view({'get': 'followers'}), 
         name='follow-followers'),
    path('follows/following/', 
         views.FollowViewSet.as_view({'get': 'following'}), 
         name='follow-following'),
    path('messages/conversations/', 
         views.MessageViewSet.as_view({'get': 'conversations'}), 
         name='message-conversations'),
    path('messages/with-user/<int:user_id>/', 
         views.MessageViewSet.as_view({'get': 'with_user'}), 
         name='message-with-user'),
    path('notifications/unread-count/', 
         views.NotificationViewSet.as_view({'get': 'unread_count'}), 
         name='notification-unread-count'),
    path('notifications/mark-as-read/', 
         views.NotificationViewSet.as_view({'post': 'mark_as_read'}), 
         name='notification-mark-as-read'),
    path('notifications/mark-all-as-read/', 
         views.NotificationViewSet.as_view({'post': 'mark_all_as_read'}), 
         name='notification-mark-all-as-read'),
]
