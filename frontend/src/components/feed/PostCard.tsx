import { motion } from 'framer-motion'
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { Card, Avatar, Button } from '@/components/ui'

interface PostCardProps {
  post: {
    id: string
    author: {
      name: string
      title: string
      avatar?: string
    }
    content: string
    image?: string
    likes: number
    comments: number
    shares: number
    timestamp: string
    isLiked?: boolean
    isSaved?: boolean
  }
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isSaved, setIsSaved] = useState(post.isSaved || false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        {/* Author Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar src={post.author.avatar} name={post.author.name} size="md" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-600">{post.author.title}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
          <Button variant="glass" size="sm">Follow</Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
          {post.image && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
          <span>{likesCount} likes</span>
          <div className="flex space-x-4">
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isLiked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="font-medium">Like</span>
            </motion.button>

            <Button variant="glass" size="sm" className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span>Comment</span>
            </Button>

            <Button variant="glass" size="sm" className="flex items-center space-x-2">
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-xl transition-all ${
              isSaved 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  )
}