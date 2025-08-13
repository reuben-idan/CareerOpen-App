import { Suspense, lazy, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { Web3Provider } from './context/web3';
import { UserProvider } from './context/auth';
import { ProfileProvider } from './context/profile';
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
const MyNetwork = lazy(() => import('./pages/network/NetworkPage')); 
const Messages = lazy(() => import('./pages/Messages'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const SubscriptionPayment = lazy(() => import('./pages/SubscriptionPayment'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SavedJobsPage = lazy(() => import('./pages/SavedJobsPage'));
const JobApplicationsPage = lazy(() => import('./pages/JobApplicationsPage'));
const JobPostPage = lazy(() => import('./pages/JobPostPage'));
const APITest = lazy(() => import('./pages/APITest'));

const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const AppLayout = lazy(() => import('./components/layout/AppLayout'));

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Web3Provider>
          <UserProvider>
            <ProfileProvider>
              <ToastProvider>
                <Router>
                  <Suspense fallback={
                    <div className="flex h-screen w-full items-center justify-center">
                      <LoadingSpinner size="xl" />
                    </div>
                  }>
                    <AppRoutes />
                    <ToastContainer position="bottom-right" autoClose={5000} />
                  </Suspense>
                </Router>
              </ToastProvider>
            </ProfileProvider>
          </UserProvider>
        </Web3Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

/**
 * Main application routes configuration.
 * Uses ProtectedRoute and PublicRoute to handle authentication.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with PublicLayout */}
      <Route element={
        <PublicRoute>
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        </PublicRoute>
      }>
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<Navigate to="/signin" replace />} />
        <Route index element={<Navigate to="/signin" replace />} />
      </Route>

      {/* Protected routes with AppLayout */}
      <Route 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/feed" replace />} />
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

      {/* Catch-all route - redirects to signin for unauthenticated users */}
      <Route 
        path="*" 
        element={
          <PublicRoute>
            <Navigate to="/signin" replace />
          </PublicRoute>
        } 
      />
    </Routes>
  );
};

export default App;
