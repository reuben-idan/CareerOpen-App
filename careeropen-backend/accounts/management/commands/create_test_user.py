from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Creates a test user with the specified email and password'

    def handle(self, *args, **options):
        User = get_user_model()
        email = 'test@example.com'
        password = 'testpass123'

        try:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': 'Test',
                    'last_name': 'User',
                    'is_employer': False,
                    'is_active': True
                }
            )

            if created or not user.check_password(password):
                user.set_password(password)
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created/updated user: {email}')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'User already exists with correct password: {email}')
                )

        except Exception as e:
            self.stderr.write(
                self.style.ERROR(f'Error creating/updating user: {str(e)}')
            )
