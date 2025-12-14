from django.urls import path
from . import views

urlpatterns = [
    path('', views.ApplicationListCreateView.as_view(), name='application-list-create'),
    path('<uuid:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
]