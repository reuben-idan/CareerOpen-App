import "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext"; // Import UserProvider
import PropTypes from "prop-types"; // Import PropTypes for validation
import ProfilePage from "./pages/ProfilePage";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import NavigationBar from "./components/NavigationBar";
import Feed from "./pages/Feed";
import MyNetwork from "./pages/MyNetwork";
import Messages from "./pages/Messages";
import SignupPage from "./pages/SignUpPage";
import SigninPage from "./pages/SignInPage";
import NotificationPage from "./pages/NotificationPage";
// import { db } from "../firebaseConfig";
// import NotFoundPage from "./components/NotFoundPage"; 


import "./index.css"; // or wherever your Tailwind CSS file is located
import SubscriptionPayment from "./pages/SubscriptionPayment";


const App = () => {
  
  return (
    
    <UserProvider>
      <Router>
        <AuthenticatedRoutes />
      </Router>
    </UserProvider>
  );
};

// AuthenticatedRoutes component handles the routes with conditional rendering for NavigationBar
const AuthenticatedRoutes = () => {
  const { user } = useUser();
  

  return (
    <div>
      {/* Only render the NavigationBar if the user is authenticated */}
      {user && <NavigationBar />}

      <div className="container mx-auto px-4 py-8">
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
          <Route path="/feed/:feedId" element={<Feed />} />

          {/* Profile Routes */}
          <Route
            path="/profile/:userId"
            element={<PrivateRoute Component={ProfilePage} />}
          />
          <Route
            path="/SubscriptionPayment"
            element={<PrivateRoute Component={SubscriptionPayment} />}
          />

          {/* My Network & Messages Routes */}
          <Route
            path="/myNetwork/:userId"
            element={<PrivateRoute Component={MyNetwork} />}
          />
          <Route
            path="/messages/:messageId"
            element={<PrivateRoute Component={Messages} />}
          />
          <Route
            path="/notifications/:notificationId"
            element={<PrivateRoute Component={NotificationPage} />}
          />

          {/* Redirect for any undefined routes */}
          <Route path="*" element={<Feed />} />
        </Routes>
      </div>
    </div>
  );
};

// AuthRedirect component for handling initial page routing
const AuthRedirect = () => {
  const { user } = useUser();
  if (user) {
    // If user is logged in, redirect to Feed (or other landing page)
    return <Navigate to="/feed" />;
  } else {
    // If no user is logged in, show the signup page
    return <Navigate to="/signup" />;
  }
};

// PrivateRoute component ensures only authenticated users can access these routes
const PrivateRoute = ({ Component }) => {
  const { user } = useUser();
  return user ? <Component /> : <Navigate to="/signin" />;
};

// AuthRoute component ensures that authenticated users are redirected away from sign-in or sign-up pages
const AuthRoute = ({ Component }) => {
  const { user } = useUser();
  return user ? <Navigate to="/NotFoundPage" /> : <Component />;
};

// PropTypes validation for PrivateRoute and AuthRoute components
PrivateRoute.propTypes = {
  Component: PropTypes.elementType.isRequired, // Ensures Component is a React component
};

AuthRoute.propTypes = {
  Component: PropTypes.elementType.isRequired, // Ensures Component is a React component
};

export default App;
