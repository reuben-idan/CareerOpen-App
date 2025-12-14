import { create } from 'zustand'

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'image' | 'file'
  attachment?: {
    name: string
    url: string
    type: string
  }
}

export interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
    title: string
  }
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
  isTyping: boolean
}

interface MessagingState {
  conversations: Conversation[]
  selectedConversationId: string | null
  isLoading: boolean
  
  // Actions
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'file', attachment?: any) => void
  markAsRead: (conversationId: string, messageId?: string) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
  selectConversation: (conversationId: string) => void
  createConversation: (participant: { id: string; name: string; avatar?: string; title: string }) => string
  deleteMessage: (conversationId: string, messageId: string) => void
  setLoading: (loading: boolean) => void
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [
    {
      id: '1',
      participant: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        title: 'Senior Software Engineer at TechCorp'
      },
      lastMessage: 'Thanks for the React tips! Really helpful.',
      timestamp: '2m ago',
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
      messages: [
        {
          id: 'm1',
          content: 'Hi! I saw your post about React optimization. Could you share more details?',
          senderId: '1',
          timestamp: '10:30 AM',
          isRead: true,
          type: 'text'
        },
        {
          id: 'm2',
          content: 'Sure! The key is to use React.memo for components that don\'t change often, and useMemo for expensive calculations.',
          senderId: 'current-user',
          timestamp: '10:32 AM',
          isRead: true,
          type: 'text'
        },
        {
          id: 'm3',
          content: 'Thanks for the React tips! Really helpful. Do you have any resources on advanced patterns?',
          senderId: '1',
          timestamp: '10:35 AM',
          isRead: false,
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      participant: {
        id: '2',
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        title: 'Product Manager at StartupXYZ'
      },
      lastMessage: 'Let\'s schedule that call for next week',
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
      messages: [
        {
          id: 'm4',
          content: 'Great meeting today! Let\'s schedule that follow-up call for next week.',
          senderId: '2',
          timestamp: '9:15 AM',
          isRead: true,
          type: 'text'
        },
        {
          id: 'm5',
          content: 'Sounds good! I\'m free Tuesday or Wednesday afternoon.',
          senderId: 'current-user',
          timestamp: '9:20 AM',
          isRead: true,
          type: 'text'
        }
      ]
    }
  ],
  selectedConversationId: null,
  isLoading: false,

  sendMessage: (conversationId, content, type = 'text', attachment) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'current-user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      type,
      attachment
    }

    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: type === 'text' ? content : `Sent ${type}`,
              timestamp: 'Just now'
            }
          : conv
      )
    }))

    // Simulate response after delay
    setTimeout(() => {
      const responses = [
        'That\'s interesting!',
        'Thanks for sharing that.',
        'I agree with your point.',
        'Let me think about that.',
        'Great idea!',
        'Could you elaborate on that?'
      ]
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        senderId: conversationId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'text'
      }

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, responseMessage],
                lastMessage: responseMessage.content,
                timestamp: 'Just now',
                unreadCount: conv.unreadCount + 1,
                isTyping: false
              }
            : conv
        )
      }))
    }, 2000)
  },

  markAsRead: (conversationId, messageId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg =>
                messageId ? (msg.id === messageId ? { ...msg, isRead: true } : msg)
                         : { ...msg, isRead: true }
              )
            }
          : conv
      )
    }))
  },

  setTyping: (conversationId, isTyping) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, isTyping }
          : conv
      )
    }))
  },

  selectConversation: (conversationId) => {
    set({ selectedConversationId: conversationId })
    // Mark as read when selecting
    get().markAsRead(conversationId)
  },

  createConversation: (participant) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participant,
      lastMessage: '',
      timestamp: 'Just now',
      unreadCount: 0,
      isOnline: Math.random() > 0.5,
      isTyping: false,
      messages: []
    }

    set(state => ({
      conversations: [newConversation, ...state.conversations]
    }))

    return newConversation.id
  },

  deleteMessage: (conversationId, messageId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.filter(msg => msg.id !== messageId)
            }
          : conv
      )
    }))
  },

  setLoading: (loading) => set({ isLoading: loading })
}))