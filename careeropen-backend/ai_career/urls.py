from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AICareerViewSet

router = DefaultRouter()
router.register(r'ai-career', AICareerViewSet, basename='ai-career')

urlpatterns = [
    path('', include(router.urls)),
]