import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Card, Avatar, Button, Textarea } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useFeedStore } from '@/stores/feedStore'

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { user } = useAuthStore()
  const { addPost } = useFeedStore()

  const handlePost = () => {
    if (!content.trim()) return
    
    addPost(content, selectedImage || undefined)
    setContent('')
    setSelectedImage(null)
    setIsExpanded(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
                {/* Selected Image Preview */}
                {selectedImage && (
                  <div className="mb-4 relative">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Media Options */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button variant="glass" size="sm" className="flex items-center space-x-2" as="span">
                        <PhotoIcon className="w-4 h-4" />
                        <span>Photo</span>
                      </Button>
                    </label>
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
                      setSelectedImage(null)
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