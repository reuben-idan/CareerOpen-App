from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.JobViewSet, basename='job')

urlpatterns = [
    # Job search endpoint
    path('search/', views.JobSearchView.as_view(), name='job_search'),
    
    # Job application endpoints
    path('<int:job_id>/apply/', views.JobApplicationCreateView.as_view(), name='job_apply'),
    path('applications/', views.UserJobApplicationsView.as_view(), name='user_applications'),
    path('applications/<int:pk>/', views.JobApplicationDetailView.as_view(), name='application_detail'),
] + router.urls
