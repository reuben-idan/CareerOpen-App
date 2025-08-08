import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/auth";
import { UserProfileProvider } from "./context/user";
import { ThemeProvider } from "./context/ThemeContext";
import { ProfileProvider } from "./context/profile";
import PropTypes from "prop-types";
import NavigationBar from "./components/layout/NavigationBar";
import Sidebar from "./components/layout/Sidebar";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SEO from "./components/common/SEO";
import analytics from "./services/analytics";
import { config } from "./config/env";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { Web3Provider } from "./context/web3";
import CookieConsent from "./components/common/CookieConsent";
import { ToastProvider } from "./context/toast";
import UserProfile from "./components/profile/UserProfile";

// Lazy load components for better performance
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const JobList = lazy(() => import("./pages/JobList"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Feed = lazy(() => import("./pages/Feed"));
const MyNetwork = lazy(() => import("./pages/MyNetwork"));
const Messages = lazy(() => import("./pages/Messages"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const SigninPage = lazy(() => import("./pages/SignInPage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const SubscriptionPayment = lazy(() => import("./pages/SubscriptionPayment"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SavedJobsPage = lazy(() => import("./pages/SavedJobsPage"));
const JobApplicationsPage = lazy(() => import("./pages/JobApplicationsPage"));
const APITest = lazy(() => import("./pages/APITest"));

// Analytics wrapper component
const AnalyticsWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    analytics.initialize();
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <UserProvider>
            <Web3Provider>
              <ProfileProvider>
                <ToastProvider>
                  <Router
                    future={{
                      v7_startTransition: true,
                      v7_relativeSplatPath: true,
                    }}
                  >
                    <AnalyticsWrapper>
                      <SEO />
                      <AppRoutes />
                    </AnalyticsWrapper>
                  </Router>
                </ToastProvider>
              </ProfileProvider>
            </Web3Provider>
          </UserProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const AppLayout = ({ children }) => {
  const { user } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <NavigationBar />}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-4 overflow-y-auto">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner fullPage />}>
              {children}
            </Suspense>
          </ErrorBoundary>
          <CookieConsent />
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<AuthRoute Component={SigninPage} />} />
      <Route path="/signup" element={<AuthRoute Component={SignUpPage} />} />
      
      {/* Protected Routes */}
      <Route element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/network" element={<MyNetwork />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/subscription" element={<SubscriptionPayment />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />
        <Route path="/my-applications" element={<JobApplicationsPage />} />
        <Route path="/api-test" element={<APITest />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Route>
    </Routes>
  );
};

const AuthRedirect = () => {
  const { user } = useUser();
  return user ? (
    <Navigate to="/feed" replace />
  ) : (
    <Navigate to="/signup" replace />
  );
};

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return children;
};

const AuthRoute = ({ Component }) => {
  const { user } = useUser();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/feed";
  
  if (user) {
    return <Navigate to={from} replace />;
  }
  
  return <Component />;
};

PrivateRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

AuthRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default App;
