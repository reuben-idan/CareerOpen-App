import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  SparklesIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { Button, Card } from '@/components/ui'
import { Logo } from '@/components/common'

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Matching',
    description: 'Smart algorithms connect you with perfect opportunities based on your skills and career goals.'
  },
  {
    icon: UserGroupIcon,
    title: 'Professional Network',
    description: 'Build meaningful connections with industry professionals and expand your career network.'
  },
  {
    icon: ChartBarIcon,
    title: 'Career Analytics',
    description: 'Data-driven insights to track your progress and accelerate your professional growth.'
  },
  {
    icon: BriefcaseIcon,
    title: 'Job Marketplace',
    description: 'Access thousands of curated job opportunities from top companies worldwide.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Skills Validation',
    description: 'Showcase your expertise with verified skills and professional certifications.'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Community',
    description: 'Connect with professionals from around the world and discover global opportunities.'
  }
]

const stats = [
  { label: 'Active Professionals', value: '2M+' },
  { label: 'Job Opportunities', value: '50K+' },
  { label: 'Companies', value: '10K+' },
  { label: 'Success Stories', value: '100K+' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel-strong border-b border-white/20">
        <div className="container-glass">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Logo size="md" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/auth">
                <Button variant="glass">Sign In</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-glass text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-1 text-gray-900 mb-6">
              Your Career
              <span className="block text-ocean-gradient mt-2">
                Operating System
              </span>
            </h1>
            
            <p className="body-large text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect, discover opportunities, and accelerate your career with AI-powered insights, 
              professional networking, and a vibrant community of industry leaders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-ocean-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white/30">
        <div className="container-glass">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 text-gray-900 mb-4">
              Everything you need to advance your career
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              From AI-powered job matching to professional networking, 
              we provide all the tools you need to succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="text-center h-full">
                    <div className="w-12 h-12 ocean-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="heading-3 text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="body-medium text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-glass">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto">
              <h2 className="heading-2 text-gray-900 mb-4">
                Ready to transform your career?
              </h2>
              <p className="body-large text-gray-600 mb-8">
                Join millions of professionals who are already using CareerOpen 
                to accelerate their career growth.
              </p>
              <Link to="/auth">
                <Button size="lg">
                  Start Your Journey
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-12">
        <div className="container-glass">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo size="sm" />
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 CareerOpen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}