import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card } from '@/components/ui'
import CreatePost from '@/components/feed/CreatePost'
import PostCard from '@/components/feed/PostCard'
import { useFeedStore } from '@/stores/feedStore'

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState('All Posts')
  const { posts, isLoading } = useFeedStore()
  
  const filters = ['All Posts', 'Following', 'Industry News', 'Job Updates', 'Career Tips']

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
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      activeFilter === filter 
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">No posts yet. Be the first to share something!</p>
              </Card>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            )}
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