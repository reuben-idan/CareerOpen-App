import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'connection' | 'job_match' | 'message' | 'job_application' | 'profile_view' | 'endorsement' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  isArchived: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  actor?: {
    id: string
    name: string
    avatar?: string
    title?: string
  }
  metadata?: {
    postId?: string
    jobId?: string
    applicationId?: string
    [key: string]: any
  }
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  filter: 'all' | 'unread' | 'connections' | 'jobs' | 'messages' | 'system'
  isLoading: boolean
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  archiveNotification: (notificationId: string) => void
  deleteNotification: (notificationId: string) => void
  setFilter: (filter: NotificationState['filter']) => void
  clearAll: () => void
  setLoading: (loading: boolean) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: '1',
          type: 'like',
          title: 'Post Liked',
          message: 'Sarah Chen liked your post about React optimization',
          timestamp: '2 minutes ago',
          isRead: false,
          isArchived: false,
          priority: 'medium',
          actionUrl: '/app/feed',
          actor: {
            id: '1',
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
            title: 'Senior Software Engineer'
          },
          metadata: { postId: '123' }
        },
        {
          id: '2',
          type: 'connection',
          title: 'New Connection Request',
          message: 'Michael Rodriguez wants to connect with you',
          timestamp: '1 hour ago',
          isRead: false,
          isArchived: false,
          priority: 'high',
          actionUrl: '/app/profile',
          actor: {
            id: '2',
            name: 'Michael Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            title: 'Product Manager'
          }
        },
        {
          id: '3',
          type: 'job_match',
          title: 'New Job Match',
          message: 'Senior React Developer at TechCorp matches your profile (95% match)',
          timestamp: '3 hours ago',
          isRead: true,
          isArchived: false,
          priority: 'high',
          actionUrl: '/app/jobs',
          metadata: { jobId: '456', matchPercentage: 95 }
        },
        {
          id: '4',
          type: 'comment',
          title: 'New Comment',
          message: 'Emily Johnson commented on your post: "Great insights on design thinking!"',
          timestamp: '5 hours ago',
          isRead: true,
          isArchived: false,
          priority: 'medium',
          actionUrl: '/app/feed',
          actor: {
            id: '3',
            name: 'Emily Johnson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            title: 'UX Designer'
          },
          metadata: { postId: '789', commentId: '101' }
        },
        {
          id: '5',
          type: 'profile_view',
          title: 'Profile Views',
          message: 'Your profile was viewed 15 times today',
          timestamp: '1 day ago',
          isRead: true,
          isArchived: false,
          priority: 'low',
          actionUrl: '/app/profile'
        },
        {
          id: '6',
          type: 'job_application',
          title: 'Application Update',
          message: 'Your application for Full Stack Engineer at StartupXYZ is under review',
          timestamp: '2 days ago',
          isRead: false,
          isArchived: false,
          priority: 'high',
          actionUrl: '/app/applications',
          metadata: { applicationId: '202', status: 'under_review' }
        }
      ],
      unreadCount: 3,
      filter: 'all',
      isLoading: false,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: 'Just now'
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }))
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId && !notif.isRead
              ? { ...notif, isRead: true }
              : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }))
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
          unreadCount: 0
        }))
      },

      archiveNotification: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId
              ? { ...notif, isArchived: true, isRead: true }
              : notif
          ),
          unreadCount: state.notifications.find(n => n.id === notificationId && !n.isRead)
            ? state.unreadCount - 1
            : state.unreadCount
        }))
      },

      deleteNotification: (notificationId) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === notificationId)
          return {
            notifications: state.notifications.filter(notif => notif.id !== notificationId),
            unreadCount: notification && !notification.isRead
              ? state.unreadCount - 1
              : state.unreadCount
          }
        })
      },

      setFilter: (filter) => set({ filter }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount
      })
    }
  )
)