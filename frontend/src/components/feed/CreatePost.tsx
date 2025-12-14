import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Card, Avatar, Button, Textarea } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const { user } = useAuthStore()

  const handlePost = () => {
    if (!content.trim()) return
    
    // TODO: Implement post creation
    console.log('Creating post:', content)
    setContent('')
    setIsExpanded(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6">
        <div className="flex space-x-4">
          <Avatar src={user?.avatar} name={user?.name} size="md" />
          
          <div className="flex-1">
            <Textarea
              placeholder="Share your professional insights..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[60px] resize-none border-0 bg-gray-50 focus:bg-white"
            />
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                {/* Media Options */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Button variant="glass" size="sm" className="flex items-center space-x-2">
                      <PhotoIcon className="w-4 h-4" />
                      <span>Photo</span>
                    </Button>
                    <Button variant="glass" size="sm" className="flex items-center space-x-2">
                      <VideoCameraIcon className="w-4 h-4" />
                      <span>Video</span>
                    </Button>
                    <Button variant="glass" size="sm" className="flex items-center space-x-2">
                      <DocumentIcon className="w-4 h-4" />
                      <span>Document</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="glass" 
                    onClick={() => {
                      setIsExpanded(false)
                      setContent('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePost}
                    disabled={!content.trim()}
                    className="bg-ocean-600 hover:bg-ocean-700"
                  >
                    Post
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}