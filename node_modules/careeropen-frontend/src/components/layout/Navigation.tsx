import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Avatar, Button } from '@/components/ui'
import { Logo } from '@/components/common'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/cn'

const navigationItems = [
  { name: 'Home', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Jobs', href: '/app/jobs', icon: BriefcaseIcon },
  { name: 'Network', href: '/app/network', icon: UserGroupIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="sticky top-0 z-50 glass-panel-strong border-b border-white/20">
      <div className="container-glass">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/app/dashboard">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'relative px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2',
                    isActive(item.href)
                      ? 'text-ocean-600 bg-ocean-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute inset-0 bg-ocean-100 rounded-xl -z-10"
                      layoutId="activeTab"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/app/profile">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="sm"
                status="online"
              />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-button"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 py-4"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive(item.href)
                          ? 'text-ocean-600 bg-ocean-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className="border-t border-white/20 pt-4 mt-4">
                  <Link
                    to="/app/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/20"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                  >
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}