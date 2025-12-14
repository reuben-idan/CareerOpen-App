import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Layouts
import AppLayout from '@/components/layout/AppLayout'

// Components
import { Loading } from '@/components/ui'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const JobsPage = lazy(() => import('@/pages/JobsPage'))
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'))
const CompanyPage = lazy(() => import('@/pages/CompanyPage'))
const NetworkPage = lazy(() => import('@/pages/NetworkPage'))
const MessagesPage = lazy(() => import('@/pages/MessagesPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))
const FeedPage = lazy(() => import('@/pages/FeedPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const AdminPage = lazy(() => import('@/pages/AdminPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading size="lg" text="Loading..." />
  </div>
)

function App() {
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes with layout */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="company/:companyId" element={<CompanyPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          {/* Legacy routes - redirect to new structure */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          <Route path="/jobs" element={<Navigate to="/app/jobs" replace />} />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Global toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#374151',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
        }}
      />
    </motion.div>
  )
}

export default App