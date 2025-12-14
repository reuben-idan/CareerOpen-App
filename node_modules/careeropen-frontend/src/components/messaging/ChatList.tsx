import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui'
import { useMessagingStore, type Conversation } from '@/stores/messagingStore'

interface ChatListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (id: string) => void
}

export default function ChatList({ conversations, selectedId, onSelect }: ChatListProps) {
  const { selectConversation } = useMessagingStore()
  
  const handleSelect = (conversationId: string) => {
    selectConversation(conversationId)
    onSelect(conversationId)
  }
  
  return (
    <div className="space-y-2">
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No conversations yet</p>
          <p className="text-sm">Start a new conversation!</p>
        </div>
      ) : (
        conversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(conversation.id)}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedId === conversation.id
                ? 'bg-ocean-100 border-ocean-200'
                : 'bg-white/20 hover:bg-white/30 border-white/30'
            } border backdrop-blur-md`}
          >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar 
                src={conversation.participant.avatar} 
                name={conversation.participant.name} 
                size="md"
                status={conversation.isOnline ? 'online' : 'offline'}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conversation.participant.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {conversation.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1 truncate">
                {conversation.participant.title}
              </p>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate flex-1">
                  {conversation.isTyping ? (
                    <span className="italic text-ocean-600">typing...</span>
                  ) : (
                    conversation.lastMessage || 'No messages yet'
                  )}
                </p>
                
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 bg-ocean-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          </motion.button>
        ))
      )}
    </div>
  )
}