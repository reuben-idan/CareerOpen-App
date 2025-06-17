import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/auth";
import { ThemeProvider } from "./context/ThemeContext";
import PropTypes from "prop-types";
import NavigationBar from "./components/layout/NavigationBar";
import Sidebar from "./components/layout/Sidebar";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SEO from "./components/common/SEO";
import analytics from "./services/analytics";
import config from "./config/env";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

// Lazy load components for better performance
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const JobList = lazy(() => import("./pages/JobList"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Feed = lazy(() => import("./pages/Feed"));
const MyNetwork = lazy(() => import("./pages/MyNetwork"));
const Messages = lazy(() => import("./pages/Messages"));
const SignupPage = lazy(() => import("./pages/SignUpPage"));
const SigninPage = lazy(() => import("./pages/SignInPage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const SubscriptionPayment = lazy(() => import("./pages/SubscriptionPayment"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SavedJobsPage = lazy(() => import("./pages/SavedJobsPage"));

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
            <Router
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AnalyticsWrapper>
                <SEO />
                <AuthenticatedRoutes />
              </AnalyticsWrapper>
            </Router>
          </UserProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const AuthenticatedRoutes = () => {
  const { user } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <NavigationBar />}
      <main className={`${user ? "pt-16" : ""}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<AuthRedirect />} />
            <Route
              path="/signup"
              element={<AuthRoute Component={SignupPage} />}
            />
            <Route
              path="/signin"
              element={<AuthRoute Component={SigninPage} />}
            />

            {/* Public Routes */}
            <Route path="/jobs" element={<JobList />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
            <Route path="/feed" element={<Feed />} />

            {/* Protected Routes */}
            <Route
              path="/profile/:userId"
              element={<PrivateRoute Component={ProfilePage} />}
            />
            <Route
              path="/subscription"
              element={<PrivateRoute Component={SubscriptionPayment} />}
            />
            <Route
              path="/network"
              element={<PrivateRoute Component={MyNetwork} />}
            />
            <Route
              path="/messages"
              element={<PrivateRoute Component={Messages} />}
            />
            <Route
              path="/notifications"
              element={<PrivateRoute Component={NotificationPage} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute Component={SettingsPage} />}
            />
            <Route
              path="/saved-jobs"
              element={<PrivateRoute Component={SavedJobsPage} />}
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
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

const PrivateRoute = ({ Component }) => {
  const { user } = useUser();
  return user ? <Component /> : <Navigate to="/signin" replace />;
};

const AuthRoute = ({ Component }) => {
  const { user } = useUser();
  return user ? <Navigate to="/feed" replace /> : <Component />;
};

PrivateRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

AuthRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default App;
