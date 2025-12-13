import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

export default function NetworkPage() {
  return (
    <div className="section-padding">
      <div className="container-glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h1 className="heading-2 text-gray-900 mb-4">
              Professional Network
            </h1>
            <p className="body-medium text-gray-600">
              Connect with professionals in your industry and expand your network.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}