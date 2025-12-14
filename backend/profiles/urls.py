from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProfileDetailView.as_view(), name='profile-detail'),
    path('experiences/', views.ExperienceListCreateView.as_view(), name='experience-list-create'),
    path('experiences/<uuid:pk>/', views.ExperienceDetailView.as_view(), name='experience-detail'),
    path('education/', views.EducationListCreateView.as_view(), name='education-list-create'),
    path('education/<uuid:pk>/', views.EducationDetailView.as_view(), name='education-detail'),
]