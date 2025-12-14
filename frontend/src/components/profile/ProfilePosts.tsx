import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  ShareIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, Button, Textarea, Avatar } from '@/components/ui'
import { Post } from '@/stores/feedStore'

interface ProfilePostsProps {
  posts: Post[]
  onLikePost: (postId: string) => void
  onAddComment: (postId: string, content: string) => void
  onSharePost: (postId: string) => void
}

export default function ProfilePosts({ posts, onLikePost, onAddComment, onSharePost }: ProfilePostsProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedComments(newExpanded)
  }

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return

    onAddComment(postId, content)
    setCommentInputs({ ...commentInputs, [postId]: '' })
  }

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `${post.author.name}'s post`,
        text: post.content,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${post.content}\n\n${window.location.href}`)
    }
    onSharePost(post.id)
  }

  const formatTimestamp = (timestamp: string) => {
    // Simple timestamp formatting - in real app, use a library like date-fns
    return timestamp
  }

  if (posts.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleOvalLeftIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Posts will appear here when they're shared.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="heading-3 text-gray-900">Activity</h2>
      
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={post.author.avatar}
                  alt={post.author.name}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <p className="text-sm text-gray-600">{post.author.title}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</p>
                </div>
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed mb-4">
                {post.content}
              </p>
              
              {post.image && (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            {/* Post Stats */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{post.likes} likes</span>
                <span>{post.comments.length} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isLiked
                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {post.isLiked ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span>Like</span>
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                <span>Comment</span>
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            {expandedComments.has(post.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-gray-100 pt-4"
              >
                {/* Add Comment */}
                <div className="flex space-x-3 mb-4">
                  <Avatar size="sm" />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({
                        ...commentInputs,
                        [post.id]: e.target.value
                      })}
                      rows={2}
                      className="resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg px-4 py-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm">
                            {comment.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                          <button
                            className={`hover:text-red-600 ${
                              comment.isLiked ? 'text-red-600' : ''
                            }`}
                          >
                            Like ({comment.likes})
                          </button>
                          <button className="hover:text-gray-800">
                            Reply
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
      ))}
    </div>
  )
}