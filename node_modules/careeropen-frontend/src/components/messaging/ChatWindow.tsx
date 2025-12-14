import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Avatar, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useMessagingStore, type Conversation } from '@/stores/messagingStore'

interface ChatWindowProps {
  conversation: Conversation
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showMessageOptions, setShowMessageOptions] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()
  const { sendMessage, deleteMessage, setTyping } = useMessagingStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages])

  const handleSend = () => {
    if (!newMessage.trim() && !selectedFile) return
    
    if (selectedFile) {
      // Handle file upload
      const fileUrl = URL.createObjectURL(selectedFile)
      sendMessage(conversation.id, selectedFile.name, selectedFile.type.startsWith('image/') ? 'image' : 'file', {
        name: selectedFile.name,
        url: fileUrl,
        type: selectedFile.type
      })
      setSelectedFile(null)
    } else {
      sendMessage(conversation.id, newMessage)
    }
    
    setNewMessage('')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(conversation.id, messageId)
    setShowMessageOptions(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    // Simulate typing indicator
    setTyping(conversation.id, true)
    setTimeout(() => setTyping(conversation.id, false), 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={conversation.participant.avatar} 
            name={conversation.participant.name} 
            size="md"
            status="online"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {conversation.participant.name}
            </h3>
            <p className="text-sm text-gray-600">
              {conversation.participant.title}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message, index) => {
          const isOwn = message.senderId === 'current-user'
          const showAvatar = index === 0 || 
            conversation.messages[index - 1].senderId !== message.senderId

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[70%] ${
                isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}>
                {!isOwn && showAvatar && (
                  <Avatar 
                    src={conversation.participant.avatar} 
                    name={conversation.participant.name} 
                    size="sm"
                  />
                )}
                {!isOwn && !showAvatar && (
                  <div className="w-8" />
                )}
                
                <div className="relative group">
                  <div className={`rounded-2xl px-4 py-2 ${
                    isOwn 
                      ? 'bg-ocean-600 text-white' 
                      : 'bg-white/20 backdrop-blur-md text-gray-900'
                  }`}>
                    {message.type === 'image' && message.attachment ? (
                      <div>
                        <img 
                          src={message.attachment.url} 
                          alt={message.attachment.name}
                          className="max-w-xs rounded-lg mb-2"
                        />
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.type === 'file' && message.attachment ? (
                      <div className="flex items-center space-x-2">
                        <PaperClipIcon className="w-4 h-4" />
                        <span className="text-sm">{message.attachment.name}</span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        isOwn ? 'text-ocean-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                      {!message.isRead && isOwn && (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  {/* Message Options */}
                  {isOwn && (
                    <button
                      onClick={() => setShowMessageOptions(
                        showMessageOptions === message.id ? null : message.id
                      )}
                      className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  
                  {showMessageOptions === message.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border p-2 z-10">
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
        
        {conversation.isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Avatar 
              src={conversation.participant.avatar} 
              name={conversation.participant.name} 
              size="sm"
            />
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
        {selectedFile && (
          <div className="mb-3 p-3 bg-white/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PaperClipIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <Button 
            variant="glass" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperClipIcon className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 focus:border-ocean-400 focus:outline-none resize-none"
              rows={1}
            />
          </div>
          
          <Button variant="glass" size="sm">
            <FaceSmileIcon className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim() && !selectedFile}
            className="bg-ocean-600 hover:bg-ocean-700"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}