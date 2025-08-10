from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import (
    Connection, ConnectionStatus, Follow, Message, Notification,
    Notification as NotificationModel
)

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer for nested representations."""
    full_name = serializers.CharField(source='get_full_name')
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'profile_picture']
        read_only_fields = fields
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class ConnectionRequestSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating connection requests."""
    from_user = UserBasicSerializer(read_only=True)
    to_user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True
    )
    status = serializers.ChoiceField(
        choices=ConnectionStatus.choices,
        read_only=True
    )
    
    class Meta:
        model = Connection
        fields = ['id', 'from_user', 'to_user', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'from_user']
    
    def validate_to_user(self, value):
        request = self.context.get('request')
        if value == request.user:
            raise serializers.ValidationError("You cannot send a connection request to yourself.")
        
        # Check if a connection already exists between these users
        existing_connection = Connection.objects.filter(
            Q(from_user=request.user, to_user=value) |
            Q(from_user=value, to_user=request.user)
        ).first()
        
        if existing_connection:
            if existing_connection.status == ConnectionStatus.BLOCKED:
                raise serializers.ValidationError("This connection has been blocked.")
            raise serializers.ValidationError("A connection already exists with this user.")
            
        return value
    
    def create(self, validated_data):
        validated_data['from_user'] = self.context['request'].user
        return super().create(validated_data)


class ConnectionResponseSerializer(serializers.Serializer):
    """Serializer for responding to connection requests."""
    action = serializers.ChoiceField(
        choices=['accept', 'decline', 'block'],
        required=True
    )
    
    def update(self, instance, validated_data):
        action = validated_data.get('action')
        
        if action == 'accept':
            instance.accept()
        elif action == 'decline':
            instance.decline()
        elif action == 'block':
            instance.block()
            
        return instance


class FollowSerializer(serializers.ModelSerializer):
    """Serializer for follow relationships."""
    follower = UserBasicSerializer(read_only=True)
    following = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'created_at', 'follower']
    
    def validate_following(self, value):
        request = self.context.get('request')
        if value == request.user:
            raise serializers.ValidationError("You cannot follow yourself.")
        return value
    
    def create(self, validated_data):
        validated_data['follower'] = self.context['request'].user
        return super().create(validated_data)


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages."""
    sender = UserBasicSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'recipient', 'content', 'is_read',
            'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'sender', 'is_read', 'created_at', 'read_at']
    
    def validate_recipient(self, value):
        request = self.context.get('request')
        if value == request.user:
            raise serializers.ValidationError("You cannot send a message to yourself.")
        
        # Check if users are connected (optional, depending on your requirements)
        if not Connection.objects.filter(
            Q(from_user=request.user, to_user=value, status=ConnectionStatus.ACCEPTED) |
            Q(from_user=value, to_user=request.user, status=ConnectionStatus.ACCEPTED)
        ).exists():
            raise serializers.ValidationError(
                "You can only send messages to your connections."
            )
            
        return value
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""
    notification_type_display = serializers.CharField(
        source='get_notification_type_display',
        read_only=True
    )
    related_object = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display',
            'title', 'message', 'is_read', 'created_at', 'read_at',
            'related_object', 'data'
        ]
        read_only_fields = fields
    
    def get_related_object(self, obj):
        """Get a serialized representation of the related object if it exists."""
        if obj.content_object is None:
            return None
            
        # You can add more model-specific serialization here
        from jobs.serializers import JobSerializer  # Avoid circular import
        
        if hasattr(obj.content_object, 'to_dict'):
            return obj.content_object.to_dict()
        elif hasattr(obj.content_object, '__class__'):
            # Generic serialization for common models
            model_name = obj.content_object.__class__.__name__.lower()
            
            if model_name == 'job':
                return JobSerializer(
                    obj.content_object,
                    context=self.context
                ).data
            
            # Fallback to a simple dict representation
            return {
                'id': obj.content_object.id,
                'model': model_name,
                'str': str(obj.content_object)
            }
        
        return None


class MarkAsReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read."""
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="List of notification IDs to mark as read"
    )
    
    def validate_ids(self, value):
        """Validate that the user owns these notifications."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")
            
        # Check if all notification IDs belong to the current user
        invalid_ids = set(value) - set(
            NotificationModel.objects.filter(
                user=request.user,
                id__in=value
            ).values_list('id', flat=True)
        )
        
        if invalid_ids:
            raise serializers.ValidationError(
                f"Invalid notification IDs: {invalid_ids}"
            )
            
        return value
