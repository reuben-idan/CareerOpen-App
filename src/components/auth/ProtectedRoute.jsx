import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * A protected route component that redirects to the login page if the user is not authenticated.
 * Shows a loading spinner while checking authentication status.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @param {string} [props.redirectTo] - The path to redirect to if not authenticated (defaults to '/login')
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required (defaults to true)
 * @returns {JSX.Element} The protected route component
 */
const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated, redirect to home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (or authentication is not required) and loading is complete
  return children;
};

export default ProtectedRoute;
