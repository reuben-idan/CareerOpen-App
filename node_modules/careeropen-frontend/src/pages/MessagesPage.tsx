import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Card, Input, Button } from '@/components/ui'
import ChatList from '@/components/messaging/ChatList'
import ChatWindow from '@/components/messaging/ChatWindow'

const mockConversations = [
  {
    id: '1',
    participant: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      title: 'Senior Software Engineer at TechCorp'
    },
    lastMessage: 'Thanks for the React tips! Really helpful.',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        content: 'Hi! I saw your post about React optimization. Could you share more details?',
        senderId: '1',
        timestamp: '10:30 AM',
        isRead: true
      },
      {
        id: 'm2',
        content: 'Sure! The key is to use React.memo for components that don\'t change often, and useMemo for expensive calculations.',
        senderId: 'current-user',
        timestamp: '10:32 AM',
        isRead: true
      },
      {
        id: 'm3',
        content: 'Thanks for the React tips! Really helpful. Do you have any resources on advanced patterns?',
        senderId: '1',
        timestamp: '10:35 AM',
        isRead: false
      }
    ]
  },
  {
    id: '2',
    participant: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      title: 'Product Manager at StartupXYZ'
    },
    lastMessage: 'Let\'s schedule that call for next week',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm4',
        content: 'Great meeting today! Let\'s schedule that follow-up call for next week.',
        senderId: '2',
        timestamp: '9:15 AM',
        isRead: true
      },
      {
        id: 'm5',
        content: 'Sounds good! I\'m free Tuesday or Wednesday afternoon.',
        senderId: 'current-user',
        timestamp: '9:20 AM',
        isRead: true
      }
    ]
  },
  {
    id: '3',
    participant: {
      name: 'Emily Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      title: 'UX Designer at DesignStudio'
    },
    lastMessage: 'The design mockups look amazing!',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm6',
        content: 'I\'ve finished the initial mockups for the mobile app. Would love your feedback!',
        senderId: '3',
        timestamp: '2:45 PM',
        isRead: true
      },
      {
        id: 'm7',
        content: 'The design mockups look amazing! The user flow is very intuitive.',
        senderId: '3',
        timestamp: '2:50 PM',
        isRead: false
      }
    ]
  }
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>(mockConversations[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = mockConversations.find(conv => conv.id === selectedConversation)

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
          <Button className="bg-ocean-600 hover:bg-ocean-700">
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
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}