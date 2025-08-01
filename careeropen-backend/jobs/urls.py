from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

# Initialize the default router
router = DefaultRouter()

# Register viewsets with the router
router.register(r'jobs', views.JobViewSet, basename='job')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'companies', views.CompanyViewSet, basename='company')

# Additional URL patterns that don't fit the ViewSet pattern
urlpatterns = [
    # Job search endpoint
    path('jobs/search/', views.JobSearchView.as_view(), name='job_search'),
    
    # Job application endpoints
    path('jobs/<int:job_id>/apply/', views.JobApplicationCreateView.as_view(), name='job_apply'),
    path('applications/', views.UserJobApplicationsView.as_view(), name='user_applications'),
    path('applications/<int:pk>/', views.JobApplicationDetailView.as_view(), name='application_detail'),
]

# Include the router's URLs
urlpatterns += router.urls
