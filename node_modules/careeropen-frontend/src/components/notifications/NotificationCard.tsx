import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  UserPlusIcon, 
  BriefcaseIcon, 
  EnvelopeIcon,
  EyeIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar } from '@/components/ui'
import { useNotificationStore, type Notification } from '@/stores/notificationStore'

interface NotificationCardProps {
  notification: Notification
}

const notificationIcons = {
  like: HeartSolidIcon,
  comment: ChatBubbleLeftIcon,
  connection: UserPlusIcon,
  job_match: BriefcaseIcon,
  message: EnvelopeIcon,
  job_application: BriefcaseIcon,
  profile_view: EyeIcon,
  endorsement: StarIcon,
  system: ExclamationTriangleIcon
}

const notificationColors = {
  like: 'text-red-500',
  comment: 'text-blue-500',
  connection: 'text-green-500',
  job_match: 'text-purple-500',
  message: 'text-indigo-500',
  job_application: 'text-orange-500',
  profile_view: 'text-gray-500',
  endorsement: 'text-yellow-500',
  system: 'text-red-500'
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const [showActions, setShowActions] = useState(false)
  const navigate = useNavigate()
  const { markAsRead, archiveNotification, deleteNotification } = useNotificationStore()

  const Icon = notificationIcons[notification.type]
  const iconColor = notificationColors[notification.type]

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    archiveNotification(notification.id)
    setShowActions(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification(notification.id)
    setShowActions(false)
  }

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(notification.id)
    setShowActions(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative group"
    >
      <Card 
        className={`p-4 cursor-pointer transition-all ${
          !notification.isRead 
            ? 'bg-blue-50/50 border-blue-200/50' 
            : 'hover:bg-gray-50/50'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full bg-gray-100 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>

          {notification.actor && (
            <Avatar 
              src={notification.actor.avatar}
              name={notification.actor.name}
              size="sm"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {notification.priority === 'high' && !notification.isRead && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-2 mt-1" />
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {notification.timestamp}
              </span>
              
              {!notification.isRead && (
                <span className="text-xs font-medium text-blue-600">
                  New
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(!showActions)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
            >
              <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border p-2 z-10 min-w-[150px]"
              >
                {!notification.isRead && (
                  <button
                    onClick={handleMarkAsRead}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left text-sm"
                  >
                    <span>Mark as read</span>
                  </button>
                )}
                
                <button
                  onClick={handleArchive}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left text-sm"
                >
                  <ArchiveBoxIcon className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-left text-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}