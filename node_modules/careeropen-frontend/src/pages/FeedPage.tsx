import { motion } from 'framer-motion'
import { Card } from '@/components/ui'
import CreatePost from '@/components/feed/CreatePost'
import PostCard from '@/components/feed/PostCard'

const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      title: 'Senior Software Engineer at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    content: 'Just completed a major project using React and TypeScript! The new architecture improved our app performance by 40%. Excited to share some key learnings about component optimization and state management. #React #TypeScript #WebDev',
    likes: 127,
    comments: 23,
    shares: 8,
    timestamp: '2 hours ago',
    isLiked: false
  },
  {
    id: '2',
    author: {
      name: 'Michael Rodriguez',
      title: 'Product Manager at StartupXYZ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    content: 'The future of remote work is here! Our team just launched a new collaboration tool that\'s already helping 1000+ companies work more efficiently. Key insight: async communication is the game-changer.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
    likes: 89,
    comments: 15,
    shares: 12,
    timestamp: '4 hours ago',
    isLiked: true
  },
  {
    id: '3',
    author: {
      name: 'Emily Johnson',
      title: 'UX Designer at DesignStudio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    content: 'Design thinking workshop with 50+ participants today! Amazing to see how diverse perspectives lead to breakthrough solutions. Remember: empathy is the foundation of great design. 🎨✨',
    likes: 156,
    comments: 31,
    shares: 19,
    timestamp: '6 hours ago',
    isSaved: true
  }
]

export default function FeedPage() {
  return (
    <div className="section-padding">
      <div className="container-glass">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="heading-2 text-gray-900 mb-2">
              Professional Feed
            </h1>
            <p className="body-medium text-gray-600">
              Stay updated with industry insights and your network
            </p>
          </motion.div>

          {/* Create Post */}
          <CreatePost />

          {/* Feed Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex space-x-4 overflow-x-auto">
                {['All Posts', 'Following', 'Industry News', 'Job Updates', 'Career Tips'].map((filter, index) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      index === 0 
                        ? 'bg-ocean-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Posts */}
          <div className="space-y-6">
            {mockPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-gray-700 hover:bg-white/30 transition-all">
              Load More Posts
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}