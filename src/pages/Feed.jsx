import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockPosts = [
        {
          id: 1,
          author: {
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: null,
            profile: { headline: 'Software Engineer at TechCorp' }
          },
          content: 'Excited to share that I just completed my first full-stack project using React and Django! The learning curve was steep but incredibly rewarding. Looking forward to applying these skills in my next role. #WebDevelopment #React #Django',
          post_type: 'career_update',
          created_at: new Date().toISOString(),
          reactions_count: 12,
          comments_count: 3,
          user_reaction: null,
          comments: []
        },
        {
          id: 2,
          author: {
            first_name: 'Sarah',
            last_name: 'Johnson',
            profile_picture: null,
            profile: { headline: 'Product Manager at InnovateCo' }
          },
          content: 'Just attended an amazing conference on AI in product development. The future is incredibly exciting! Key takeaways: 1) AI will augment, not replace human creativity 2) Data quality is more important than quantity 3) Ethical considerations must be built in from day one.',
          post_type: 'text',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reactions_count: 28,
          comments_count: 7,
          user_reaction: 'insightful',
          comments: []
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      // Mock creating post - replace with actual API call
      const newPost = {
        id: Date.now(),
        author: {
          first_name: user?.first_name || 'You',
          last_name: user?.last_name || '',
          profile_picture: user?.profile?.profile_picture,
          profile: { headline: user?.profile?.headline || 'Professional' }
        },
        ...postData,
        created_at: new Date().toISOString(),
        reactions_count: 0,
        comments_count: 0,
        user_reaction: null,
        comments: []
      };
      
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      // Mock reaction - replace with actual API call
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const wasReacted = post.user_reaction === reactionType;
          return {
            ...post,
            user_reaction: wasReacted ? null : reactionType,
            reactions_count: wasReacted ? post.reactions_count - 1 : post.reactions_count + 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      // Mock comment - replace with actual API call
      const newComment = {
        id: Date.now(),
        author: {
          first_name: user?.first_name || 'You',
          last_name: user?.last_name || '',
          profile_picture: user?.profile?.profile_picture
        },
        content,
        created_at: new Date().toISOString()
      };

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
            comments_count: post.comments_count + 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleShare = (post) => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.first_name} ${post.author.last_name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${post.content}\n\n- ${post.author.first_name} ${post.author.last_name}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Welcome Header */}
      <GlassCard className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.first_name || 'Professional'}!
        </h1>
        <p className="text-white/70">
          Share your professional journey and connect with your network
        </p>
      </GlassCard>

      {/* Create Post */}
      <CreatePost onCreatePost={handleCreatePost} user={user} />

      {/* Filter Options */}
      <GlassCard className="p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-blue-500/30 text-blue-200' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('connections')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'connections' 
                ? 'bg-blue-500/30 text-blue-200' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            My Network
          </button>
          <button
            onClick={() => setFilter('career_updates')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'career_updates' 
                ? 'bg-blue-500/30 text-blue-200' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Career Updates
          </button>
        </div>
      </GlassCard>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-white/60">No posts to show. Start by creating your first post!</p>
          </GlassCard>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onReact={handleReaction}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {posts.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-300">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;