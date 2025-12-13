import { motion } from 'framer-motion'
import GlassPanel from '@/components/ui/GlassPanel'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel className="mb-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user?.name}
                </h1>
                <p className="text-gray-600 mb-4">
                  Senior Software Engineer at TechCorp
                </p>
                <div className="flex space-x-3">
                  <Button size="sm">Edit Profile</Button>
                  <Button variant="glass" size="sm">Share Profile</Button>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassPanel>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                Passionate software engineer with 5+ years of experience building scalable web applications. 
                Expertise in React, Node.js, and cloud technologies. Always eager to learn and tackle new challenges.
              </p>
            </GlassPanel>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-ocean-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Senior Software Engineer</h3>
                  <p className="text-ocean-600">TechCorp • 2022 - Present</p>
                  <p className="text-gray-600 mt-2">
                    Leading development of microservices architecture serving 1M+ users
                  </p>
                </div>
                <div className="border-l-2 border-ocean-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Software Engineer</h3>
                  <p className="text-ocean-600">StartupXYZ • 2020 - 2022</p>
                  <p className="text-gray-600 mt-2">
                    Built full-stack applications using React and Node.js
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassPanel>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  )
}