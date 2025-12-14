from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

def api_root(request):
    return JsonResponse({
        'message': 'CareerOpen API is running!',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'auth': '/api/auth/',
        }
    })

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            
            # Validation
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)
            
            if User.objects.filter(username=email).exists():
                return JsonResponse({'error': 'User already exists'}, status=400)
            
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            return JsonResponse({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'name': f"{user.first_name} {user.last_name}".strip() or email.split('@')[0],
                    'avatar': None,
                    'title': 'Professional',
                    'company': 'CareerOpen',
                    'location': 'Remote',
                    'bio': 'Welcome to CareerOpen!',
                    'skills': ['Communication', 'Leadership'],
                    'connections': 0,
                    'profileViews': 0,
                    'isVerified': False,
                },
                'tokens': {
                    'access': 'mock-access-token',
                    'refresh': 'mock-refresh-token'
                }
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Registration failed: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            user = authenticate(username=email, password=password)
            if user:
                return JsonResponse({
                    'message': 'Login successful',
                    'user': {
                        'id': str(user.id),
                        'email': user.email,
                        'name': f"{user.first_name} {user.last_name}".strip(),
                        'avatar': None,
                        'title': 'Professional',
                        'company': 'CareerOpen',
                        'location': 'Remote',
                        'bio': 'Welcome to CareerOpen!',
                        'skills': ['Communication', 'Leadership'],
                        'connections': 0,
                        'profileViews': 0,
                        'isVerified': False,
                    },
                    'tokens': {
                        'access': 'mock-access-token',
                        'refresh': 'mock-refresh-token'
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/auth/register/', register, name='register'),
    path('api/auth/login/', login, name='login'),
    path('', api_root, name='home'),
]