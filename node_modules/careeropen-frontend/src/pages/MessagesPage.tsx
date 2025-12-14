import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Card, Input, Button, Avatar } from '@/components/ui'
import ChatList from '@/components/messaging/ChatList'
import ChatWindow from '@/components/messaging/ChatWindow'
import { useMessagingStore } from '@/stores/messagingStore'

const mockUsers = [
  {
    id: '4',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    title: 'Full Stack Developer at TechStart'
  },
  {
    id: '5', 
    name: 'Lisa Wang',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    title: 'Data Scientist at AI Corp'
  },
  {
    id: '6',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 
    title: 'DevOps Engineer at CloudTech'
  }
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const { conversations, selectedConversationId, createConversation } = useMessagingStore()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].id)
    }
  }, [conversations, selectedConversation])

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = conversations.find(conv => conv.id === selectedConversation)

  const handleNewConversation = (user: typeof mockUsers[0]) => {
    const conversationId = createConversation(user)
    setSelectedConversation(conversationId)
    setShowNewMessageModal(false)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="heading-2 text-gray-900">Messages</h1>
          <Button 
            className="bg-ocean-600 hover:bg-ocean-700"
            onClick={() => setShowNewMessageModal(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Message
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/20 bg-white/5 backdrop-blur-md">
          <div className="p-4">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative mb-4"
            >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/20 border-white/30"
              />
            </motion.div>

            {/* Conversation List */}
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              <ChatList
                conversations={filteredConversations}
                selectedId={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gradient-to-br from-ocean-50/30 via-pearl-50/30 to-aqua-50/30">
          {currentConversation ? (
            <motion.div
              key={selectedConversation}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <ChatWindow conversation={currentConversation} />
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose a conversation from the sidebar to start messaging
                </p>
                <Button 
                  onClick={() => setShowNewMessageModal(true)}
                  className="bg-ocean-600 hover:bg-ocean-700"
                >
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Select a person to start messaging:</p>
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleNewConversation(user)}
                  className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 text-left"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}