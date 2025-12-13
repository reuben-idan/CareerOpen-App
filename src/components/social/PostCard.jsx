import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

const PostCard = ({ post, onReact, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleReaction = (type) => {
    onReact(post.id, type);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const reactionEmojis = {
    like: '👍',
    celebrate: '🎉',
    support: '💪',
    love: '❤️',
    insightful: '💡',
  };

  return (
    <GlassCard className="p-6 mb-6">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <img
          src={post.author.profile_picture || '/default-avatar.png'}
          alt={post.author.first_name}
          className="w-12 h-12 rounded-full border-2 border-white/20"
        />
        <div className="ml-3">
          <h3 className="font-semibold text-white">
            {post.author.first_name} {post.author.last_name}
          </h3>
          <p className="text-sm text-white/60">
            {post.author.profile?.headline || 'Professional'}
          </p>
          <p className="text-xs text-white/40">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.content}</p>
        
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="mt-3 rounded-xl w-full max-h-96 object-cover"
          />
        )}
        
        {post.link_url && (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <a
              href={post.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              {post.link_title || post.link_url}
            </a>
          </div>
        )}
      </div>

      {/* Reactions Summary */}
      {post.reactions_count > 0 && (
        <div className="flex items-center mb-3 text-sm text-white/60">
          <div className="flex -space-x-1">
            {Object.entries(reactionEmojis).slice(0, 3).map(([type, emoji]) => (
              <span key={type} className="text-lg">{emoji}</span>
            ))}
          </div>
          <span className="ml-2">{post.reactions_count} reactions</span>
          {post.comments_count > 0 && (
            <span className="ml-4">{post.comments_count} comments</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex space-x-1">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                post.user_reaction === type
                  ? 'bg-blue-500/30 text-blue-200'
                  : 'hover:bg-white/10 text-white/70'
              }`}
            >
              <span className="text-lg">{emoji}</span>
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
            Comment
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => onShare(post)}
          >
            <ShareIcon className="w-5 h-5 mr-1" />
            Share
          </GlassButton>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex space-x-3 mb-4">
            <img
              src="/default-avatar.png"
              alt="Your avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Post
              </GlassButton>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author.profile_picture || '/default-avatar.png'}
                  alt={comment.author.first_name}
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <div className="flex-1">
                  <div className="bg-white/10 rounded-lg px-3 py-2">
                    <p className="font-medium text-white text-sm">
                      {comment.author.first_name} {comment.author.last_name}
                    </p>
                    <p className="text-white/90 text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default PostCard;