import { useState, useEffect, useRef } from 'react'
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
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { Avatar, Button } from '@/components/ui'
import { Logo } from '@/components/common'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/cn'

const navigationItems = [
  { name: 'Home', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Jobs', href: '/app/jobs', icon: BriefcaseIcon },
  { name: 'Feed', href: '/app/feed', icon: UserGroupIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  const isActive = (href: string) => location.pathname === href

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-button hover:bg-white/20 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="sm"
                  status="online"
                />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-lg border border-white/20 py-2"
                  >
                    <Link
                      to="/app/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        toggleTheme()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                    >
                      {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="md:hidden">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="sm"
                status="online"
              />
            </div>

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
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
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