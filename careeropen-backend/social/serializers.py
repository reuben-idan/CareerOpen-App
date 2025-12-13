from rest_framework import serializers
from .models import Post, Reaction, Comment
from accounts.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    reactions_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'post_type', 'image', 'link_url', 
                 'link_title', 'is_public', 'created_at', 'updated_at', 
                 'reactions_count', 'comments_count', 'user_reaction']
        read_only_fields = ['author', 'created_at', 'updated_at']
    
    def get_reactions_count(self, obj):
        return obj.reactions.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.reaction_type if reaction else None
        return None


class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Reaction
        fields = ['id', 'user', 'post', 'reaction_type', 'created_at']
        read_only_fields = ['user', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']