import { motion } from 'framer-motion'
import { 
  EyeIcon, 
  UserGroupIcon, 
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { Card, Avatar, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useJobStore } from '@/stores/jobStore'
import { useNavigate } from 'react-router-dom'

const quickStats = [
  { 
    label: 'Profile Views', 
    value: '1,234', 
    change: '+12%',
    icon: EyeIcon,
    color: 'text-blue-600'
  },
  { 
    label: 'Connections', 
    value: '567', 
    change: '+8%',
    icon: UserGroupIcon,
    color: 'text-green-600'
  },
  { 
    label: 'Job Matches', 
    value: '23', 
    change: '+5%',
    icon: BriefcaseIcon,
    color: 'text-purple-600'
  },
  { 
    label: 'Career Score', 
    value: '85%', 
    change: '+3%',
    icon: ArrowTrendingUpIcon,
    color: 'text-orange-600'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'connection',
    message: 'Sarah Chen sent you a connection request',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    name: 'Sarah Chen'
  },
  {
    id: 2,
    type: 'job',
    message: 'New job match: Senior Developer at TechCorp',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'view',
    message: 'Your profile was viewed 15 times today',
    time: '6 hours ago'
  },
  {
    id: 4,
    type: 'skill',
    message: 'React skill endorsed by 3 connections',
    time: '1 day ago'
  }
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Tech Networking Meetup',
    date: 'Tomorrow, 6:00 PM',
    location: 'San Francisco, CA'
  },
  {
    id: 2,
    title: 'Career Development Workshop',
    date: 'Friday, 2:00 PM',
    location: 'Online'
  }
]

const jobRecommendations = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    match: '95%',
    salary: '$120k - $160k'
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    match: '88%',
    salary: '$100k - $140k'
  }
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const { applyToJob, appliedJobs } = useJobStore()
  const navigate = useNavigate()
  
  // Mock user for testing
  const mockUser = user || { name: 'Test User' }

  const handleApply = (jobId: string) => {
    applyToJob(jobId)
    // Show success message or navigate to application form
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'profile':
        navigate('/app/profile')
        break
      case 'jobs':
        navigate('/app/jobs')
        break
      case 'analytics':
        navigate('/app/analytics')
        break
      case 'network':
        navigate('/app/feed')
        break
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="section-padding">
      <div className="container-glass">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-2 text-gray-900 mb-2">
            {getGreeting()}, {mockUser?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="body-large text-gray-600">
            Here's what's happening with your career today
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3 text-gray-900">Recent Activity</h2>
                  <Button variant="glass" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      {activity.avatar ? (
                        <Avatar 
                          src={activity.avatar} 
                          name={activity.name || 'User'}
                          size="sm" 
                        />
                      ) : (
                        <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                          <BellIcon className="w-4 h-4 text-ocean-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="body-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Job Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3 text-gray-900">Recommended Jobs</h2>
                  <Button variant="glass" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {jobRecommendations.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl glass-button hover:bg-white/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {job.company} • {job.location}
                          </p>
                          <p className="text-ocean-600 font-medium">
                            {job.salary}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600 mb-2">
                            {job.match} match
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleApply(job.id)}
                            disabled={appliedJobs.includes(job.id)}
                            className={appliedJobs.includes(job.id) ? 'bg-gray-400' : ''}
                          >
                            {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <h2 className="heading-3 text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button 
                    variant="glass" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('profile')}
                  >
                    Update Profile
                  </Button>
                  <Button 
                    variant="glass" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('jobs')}
                  >
                    Browse Jobs
                  </Button>
                  <Button 
                    variant="glass" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('analytics')}
                  >
                    View Analytics
                  </Button>
                  <Button 
                    variant="glass" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('network')}
                  >
                    Network Activity
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-3 text-gray-900">Upcoming Events</h2>
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-xl glass-button">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {event.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.location}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}