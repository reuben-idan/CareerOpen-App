from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Post, Reaction, Comment
from .serializers import PostSerializer, ReactionSerializer, CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Post.objects.filter(
            Q(is_public=True) | Q(author=self.request.user)
        ).select_related('author').prefetch_related('reactions', 'comments')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        if not reaction_type:
            return Response({'error': 'reaction_type required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        reaction, created = Reaction.objects.get_or_create(
            user=request.user,
            post=post,
            defaults={'reaction_type': reaction_type}
        )
        
        if not created:
            if reaction.reaction_type == reaction_type:
                reaction.delete()
                return Response({'message': 'Reaction removed'})
            else:
                reaction.reaction_type = reaction_type
                reaction.save()
        
        return Response(ReactionSerializer(reaction).data)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Comment.objects.filter(
            post__is_public=True
        ).select_related('author', 'post')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)