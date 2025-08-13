import { Suspense, lazy, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './contexts/AuthProvider';
import { Web3Provider } from './context/web3';
import { ToastProvider } from './context/toast';

// Components
import NavigationBar from './components/layout/NavigationBar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import HealthStatus from './components/common/HealthStatus';
import SEO from './components/common/SEO';
import UserProfile from './components/profile/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Services
import analytics from './services/analytics';
import { config } from './config/env';

// Styles
import './index.css';

// Lazy load components for better performance
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const JobList = lazy(() => import('./pages/JobList'));
const JobListPage = lazy(() => import('./pages/jobs/JobListPage'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const Feed = lazy(() => import('./pages/Feed'));
const MyNetwork = lazy(() => import('./pages/network/NetworkPage')); // Updated to use new NetworkPage
const Messages = lazy(() => import('./pages/Messages'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const SignInPage = lazy(() => import('./pages/LoginPage')); // Updated to use LoginPage
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const SubscriptionPayment = lazy(() => import('./pages/SubscriptionPayment'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SavedJobsPage = lazy(() => import('./pages/SavedJobsPage'));
const JobApplicationsPage = lazy(() => import('./pages/JobApplicationsPage'));
const JobPostPage = lazy(() => import('./pages/JobPostPage'));
const APITest = lazy(() => import('./pages/APITest'));

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Web3Provider>
          <AuthProvider>
            <ToastProvider>
              <Router>
                <AnalyticsWrapper>
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="flex h-screen w-full items-center justify-center">
                          <LoadingSpinner size="xl" />
                        </div>
                      }
                    >
                      <AppLayout>
                        <AppRoutes />
                      </AppLayout>
                    </Suspense>
                  </ErrorBoundary>
                </AnalyticsWrapper>
              </Router>
            </ToastProvider>
          </AuthProvider>
        </Web3Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

/**
 * Main application layout component that includes the navigation bar, sidebar, and main content area.
 * Only shows navigation elements to authenticated users.
 */
const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar onMenuToggle={handleSidebarToggle} />
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4 overflow-y-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          
          {/* Footer with health status */}
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <HealthStatus showDetails={false} className="border-0 p-2" />
              <div className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                <p> {new Date().getFullYear()} CareerOpen. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Main application routes configuration.
 * Uses ProtectedRoute and PublicRoute to handle authentication.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Navigate to="/feed" replace />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="feed" element={<Feed />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path="jobs" element={<JobListPage />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="post-job" element={<JobPostPage />} />
        <Route path="network" element={<MyNetwork />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/subscription" element={<SubscriptionPayment />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="my-applications" element={<JobApplicationsPage />} />
        <Route path="api-test" element={<APITest />} />
      </Route>
      
      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Navigate to="/feed" replace />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};


// Analytics wrapper component to track page views
const AnalyticsWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    analytics.initialize();
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  return children;
};

AnalyticsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
