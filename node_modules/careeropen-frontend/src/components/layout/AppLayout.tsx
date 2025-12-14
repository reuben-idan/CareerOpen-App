import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navigation from './Navigation'
import { useAuthStore } from '@/stores/authStore'
import { Navigate } from 'react-router-dom'

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-pearl-50 to-aqua-50">
      <Navigation />
      
      <main className="pb-safe-bottom">
        <Outlet />
      </main>

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
          },
        }}
      />
    </div>
  )
}