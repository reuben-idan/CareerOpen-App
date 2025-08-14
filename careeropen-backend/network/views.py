from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, F
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

from accounts.models import User
from .models import Connection, Follow, Message, Notification
from .serializers import (
    ConnectionRequestSerializer, ConnectionResponseSerializer,
    FollowSerializer, MessageSerializer, NotificationSerializer,
    MarkAsReadSerializer, UserBasicSerializer
)
from .permissions import IsOwnerOrReadOnly, IsAdminUser, IsAuthenticated


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ConnectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user connections.
    """
    serializer_class = ConnectionRequestSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        """Return connections for the current user."""
        user = self.request.user
        return Connection.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).select_related('from_user', 'to_user').order_by('-updated_at')
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == 'respond':
            return ConnectionResponseSerializer
        return super().get_serializer_class()
    
    def perform_create(self, serializer):
        """Set the from_user to the current user when creating a connection."""
        serializer.save(from_user=self.request.user)
        
        # Create a notification for the recipient
        Notification.objects.create(
            user=serializer.validated_data['to_user'],
            notification_type='connection_request',
            title='New Connection Request',
            message=f"{self.request.user.get_full_name()} wants to connect with you.",
            content_object=serializer.instance
        )
    
    @action(detail=True, methods=['post'])
    def respond(self, request, id=None):
        """Respond to a connection request (accept/decline/block)."""
        connection = self.get_object()
        
        # Only the recipient can respond to the connection request
        if connection.to_user != request.user:
            return Response(
                {"detail": "You do not have permission to respond to this connection request."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(connection, data=request.data)
        serializer.is_valid(raise_exception=True)
        connection = serializer.save()
        
        # Create appropriate notification
        if connection.status == 'accepted':
            Notification.objects.create(
                user=connection.from_user,
                notification_type='connection_accepted',
                title='Connection Accepted',
                message=f"{connection.to_user.get_full_name()} accepted your connection request.",
                content_object=connection
            )
        
        return Response(ConnectionRequestSerializer(connection).data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """List all pending connection requests for the current user."""
        pending_connections = Connection.objects.filter(
            to_user=request.user,
            status='pending'
        ).select_related('from_user').order_by('-created_at')
        
        page = self.paginate_queryset(pending_connections)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(pending_connections, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def connections(self, request):
        """List all accepted connections for the current user."""
        connections = Connection.objects.filter(
            (Q(from_user=request.user) | Q(to_user=request.user)),
            status='accepted'
        ).select_related('from_user', 'to_user').order_by('-updated_at')
        
        # Annotate with the other user in the connection
        connections = connections.annotate(
            other_user=Case(
                When(from_user=request.user, then=F('to_user')),
                default=F('from_user'),
                output_field=models.IntegerField()
            )
        ).select_related('other_user')
        
        page = self.paginate_queryset(connections)
        if page is not None:
            # Get user details for each connection
            users = [conn.other_user for conn in page]
            serializer = UserBasicSerializer(
                users, many=True, context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        users = [conn.other_user for conn in connections]
        serializer = UserBasicSerializer(
            users, many=True, context={'request': request}
        )
        return Response(serializer.data)


class FollowViewSet(mixins.CreateModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """
    ViewSet for managing user following relationships.
    """
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return follow relationships for the current user."""
        return Follow.objects.filter(follower=self.request.user)\
            .select_related('following')\
            .order_by('-created_at')
    
    def perform_create(self, serializer):
        """Set the follower to the current user when creating a follow."""
        serializer.save(follower=self.request.user)
    
    @action(detail=False, methods=['get'])
    def followers(self, request):
        """List all users who follow the current user."""
        followers = User.objects.filter(
            following__following=request.user
        ).order_by('-follower__created_at')
        
        page = self.paginate_queryset(followers)
        if page is not None:
            serializer = UserBasicSerializer(
                page, many=True, context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = UserBasicSerializer(
            followers, many=True, context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def following(self, request):
        """List all users that the current user is following."""
        following = User.objects.filter(
            followers__follower=request.user
        ).order_by('-followers__created_at')
        
        page = self.paginate_queryset(following)
        if page is not None:
            serializer = UserBasicSerializer(
                page, many=True, context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = UserBasicSerializer(
            following, many=True, context={'request': request}
        )
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user messages.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return messages for the current user's conversations."""
        user = self.request.user
        
        # Get all messages where the user is either the sender or recipient
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).select_related('sender', 'recipient').order_by('-created_at')
    
    def perform_create(self, serializer):
        """Set the sender to the current user when creating a message."""
        message = serializer.save(sender=self.request.user)
        
        # Create a notification for the recipient
        Notification.objects.create(
            user=message.recipient,
            notification_type='new_message',
            title='New Message',
            message=f"You have a new message from {message.sender.get_full_name()}",
            content_object=message
        )
    
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        """List all conversations for the current user."""
        # Get the most recent message from each conversation
        latest_messages = Message.objects.filter(
            Q(sender=request.user) | Q(recipient=request.user)
        ).values('sender', 'recipient').annotate(
            latest_id=Max('id')
        ).values_list('latest_id', flat=True)
        
        # Get the actual message objects
        conversations = Message.objects.filter(
            id__in=latest_messages
        ).select_related('sender', 'recipient').order_by('-created_at')
        
        page = self.paginate_queryset(conversations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(conversations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def with_user(self, request, user_id=None):
        """Get conversation with a specific user."""
        try:
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if users are connected (if required)
        if not Connection.objects.are_connected(request.user, other_user):
            return Response(
                {"detail": "You can only message your connections."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mark messages as read
        Message.objects.filter(
            sender=other_user,
            recipient=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        
        # Get the conversation
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(recipient=other_user)) |
            (Q(sender=other_user) & Q(recipient=request.user))
        ).select_related('sender', 'recipient').order_by('created_at')
        
        page = self.paginate_queryset(messages)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return notifications for the current user."""
        return Notification.objects.filter(user=self.request.user)\
            .order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get the count of unread notifications."""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"unread_count": count})
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        """Mark one or more notifications as read."""
        serializer = MarkAsReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Mark notifications as read
        updated = Notification.objects.filter(
            id__in=serializer.validated_data['ids'],
            user=request.user,
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        return Response({"marked_read": updated})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        updated = self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        return Response({"marked_read": updated})
