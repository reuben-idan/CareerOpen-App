from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListCreateView.as_view(), name='job-list-create'),
    path('<uuid:pk>/', views.JobDetailView.as_view(), name='job-detail'),
]