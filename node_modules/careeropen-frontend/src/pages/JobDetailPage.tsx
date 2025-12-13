import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Card, Button, Avatar } from '@/components/ui'

export default function JobDetailPage() {
  const { jobId } = useParams()

  return (
    <div className="section-padding">
      <div className="container-glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h1 className="heading-2 text-gray-900 mb-4">
              Job Detail Page
            </h1>
            <p className="body-medium text-gray-600">
              Job ID: {jobId}
            </p>
            <p className="body-medium text-gray-600 mt-4">
              This page will show detailed job information, requirements, and application form.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}