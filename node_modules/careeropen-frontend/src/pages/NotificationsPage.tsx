import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

export default function NotificationsPage() {
  return (
    <div className="section-padding">
      <div className="container-glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h1 className="heading-2 text-gray-900 mb-4">
              Notifications
            </h1>
            <p className="body-medium text-gray-600">
              Stay updated with the latest activity and opportunities.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}