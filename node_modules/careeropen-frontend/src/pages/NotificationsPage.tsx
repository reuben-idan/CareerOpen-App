import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  BellIcon, 
  CheckIcon, 
  ArchiveBoxIcon, 
  TrashIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { Card, Button } from '@/components/ui'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationCard from '@/components/notifications/NotificationCard'

const filterOptions = [
  { key: 'all', label: 'All', icon: BellIcon },
  { key: 'unread', label: 'Unread', icon: BellIcon },
  { key: 'connections', label: 'Connections', icon: BellIcon },
  { key: 'jobs', label: 'Jobs', icon: BellIcon },
  { key: 'messages', label: 'Messages', icon: BellIcon },
  { key: 'system', label: 'System', icon: BellIcon }
] as const

export default function NotificationsPage() {
  const [showSettings, setShowSettings] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    filter, 
    isLoading,
    markAllAsRead, 
    setFilter, 
    clearAll 
  } = useNotificationStore()

  const filteredNotifications = notifications.filter(notification => {
    if (notification.isArchived) return false
    
    switch (filter) {
      case 'unread':
        return !notification.isRead
      case 'connections':
        return notification.type === 'connection' || notification.type === 'endorsement'
      case 'jobs':
        return notification.type === 'job_match' || notification.type === 'job_application'
      case 'messages':
        return notification.type === 'message' || notification.type === 'comment'
      case 'system':
        return notification.type === 'system' || notification.type === 'profile_view'
      default:
        return true
    }
  })

  return (
    <div className="section-padding">
      <div className="container-glass">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="heading-2 text-gray-900 mb-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="body-medium text-gray-600">
                Stay updated with the latest activity and opportunities
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button
                  variant="glass"
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Mark all read</span>
                </Button>
              )}
              
              <Button
                variant="glass"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Notification Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Push notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Job recommendations</span>
                    </label>
                  </div>
                  
                  <Button
                    variant="glass"
                    onClick={clearAll}
                    className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Clear all</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Filters */}
          <Card className="p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {filterOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      filter === option.key
                        ? 'bg-ocean-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                    {option.key === 'unread' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'New notifications will appear here'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationCard notification={notification} />
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button variant="glass" className="px-8">
              Load More Notifications
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}