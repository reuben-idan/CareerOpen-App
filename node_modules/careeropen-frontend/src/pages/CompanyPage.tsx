import { motion } from 'framer-motion'
import GlassPanel from '@/components/ui/GlassPanel'
import Button from '@/components/ui/Button'

export default function CompanyPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel className="mb-8">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                TC
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  TechCorp
                </h1>
                <p className="text-gray-600 mb-4">
                  Leading technology company building the future
                </p>
                <div className="flex space-x-3">
                  <Button size="sm">Follow</Button>
                  <Button variant="glass" size="sm">View Jobs</Button>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Company Info */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassPanel>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TechCorp is a leading technology company focused on building innovative solutions 
                that transform how people work and connect. Founded in 2010, we've grown to serve 
                millions of users worldwide.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-ocean-600">500+</div>
                  <div className="text-gray-600">Employees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-ocean-600">15</div>
                  <div className="text-gray-600">Open Positions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-ocean-600">2010</div>
                  <div className="text-gray-600">Founded</div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  )
}