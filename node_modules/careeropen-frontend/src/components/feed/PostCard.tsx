import { motion } from 'framer-motion'
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, BookmarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { Card, Avatar, Button } from '@/components/ui'
import { useFeedStore, type Post } from '@/stores/feedStore'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const { likePost, savePost, sharePost, addComment, likeComment } = useFeedStore()

  const handleLike = () => {
    likePost(post.id)
  }

  const handleSave = () => {
    savePost(post.id)
  }

  const handleShare = () => {
    sharePost(post.id)
    // Could add share modal here
  }

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText)
      setCommentText('')
    }
  }

  const handleCommentLike = (commentId: string) => {
    likeComment(post.id, commentId)
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
          <span>{post.likes} likes</span>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:text-gray-800 transition-colors"
            >
              {post.comments.length} comments
            </button>
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
                post.isLiked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {post.isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="font-medium">Like</span>
            </motion.button>

            <Button 
              variant="glass" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowComments(!showComments)}
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span>Comment</span>
            </Button>

            <Button 
              variant="glass" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={handleShare}
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all ${
              post.isSaved 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {post.isSaved ? (
              <BookmarkSolidIcon className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            {/* Comment Input */}
            <div className="flex space-x-3 mb-4">
              <Avatar name="You" size="sm" />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 px-3 py-2 rounded-xl glass-input border-0 focus:ring-2 focus:ring-ocean-400"
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="bg-ocean-600 hover:bg-ocean-700"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar src={comment.author.avatar} name={comment.author.name} size="sm" />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">
                        {comment.author.name}
                      </div>
                      <div className="text-gray-800">{comment.content}</div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                      <button 
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${
                          comment.isLiked ? 'text-red-600' : ''
                        }`}
                      >
                        {comment.isLiked ? (
                          <HeartSolidIcon className="w-3 h-3" />
                        ) : (
                          <HeartIcon className="w-3 h-3" />
                        )}
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}