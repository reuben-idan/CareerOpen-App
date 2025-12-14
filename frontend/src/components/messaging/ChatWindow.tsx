import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { Avatar, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  isRead: boolean
}

interface ChatWindowProps {
  conversation: {
    id: string
    participant: {
      name: string
      avatar?: string
      title: string
    }
    messages: Message[]
  }
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    // TODO: Implement message sending
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
          const isOwn = message.senderId === user?.id
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
                
                <div className={`rounded-2xl px-4 py-2 ${
                  isOwn 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-white/20 backdrop-blur-md text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-ocean-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
        
        {isTyping && (
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
        <div className="flex items-end space-x-3">
          <Button variant="glass" size="sm">
            <PaperClipIcon className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
            disabled={!newMessage.trim()}
            className="bg-ocean-600 hover:bg-ocean-700"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}