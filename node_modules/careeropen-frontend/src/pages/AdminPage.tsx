import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, Button } from '@/components/ui'

const adminStats = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+8.2%',
    icon: UsersIcon,
    color: 'text-blue-600'
  },
  {
    label: 'Active Jobs',
    value: '3,421',
    change: '+12.5%',
    icon: BriefcaseIcon,
    color: 'text-green-600'
  },
  {
    label: 'Companies',
    value: '1,256',
    change: '+5.1%',
    icon: BuildingOfficeIcon,
    color: 'text-purple-600'
  },
  {
    label: 'Applications',
    value: '28,934',
    change: '+15.3%',
    icon: ChartBarIcon,
    color: 'text-orange-600'
  }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'jobs', label: 'Jobs', icon: BriefcaseIcon },
    { id: 'companies', label: 'Companies', icon: BuildingOfficeIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ]

  return (
    <div className="section-padding">
      <div className="container-glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-2 text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="body-large text-gray-600">
            Manage users, content, and platform settings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-ocean-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
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
          </div>
        )}

        {activeTab !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Management
              </h3>
              <p className="text-gray-600 mb-6">
                This section is under development. Advanced management features coming soon.
              </p>
              <Button className="bg-ocean-600 hover:bg-ocean-700">
                Configure Settings
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}