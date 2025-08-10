from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from . import views, docs

# API Documentation Schema View
schema_view = get_schema_view(
    openapi.Info(
        title="CareerOpen API",
        default_version='v1',
        description="API documentation for CareerOpen",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# API Router
router = DefaultRouter()
router.register(r'connections', views.ConnectionViewSet, basename='connection')
router.register(r'follows', views.FollowViewSet, basename='follow')
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Custom URL patterns
urlpatterns = [
    # API Documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', 
            schema_view.without_ui(cache_timeout=0), 
            name='schema-json'),
    path('swagger/', 
         schema_view.with_ui('swagger', cache_timeout=0), 
         name='schema-swagger-ui'),
    path('redoc/', 
         schema_view.with_ui('redoc', cache_timeout=0), 
         name='schema-redoc'),
    
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
