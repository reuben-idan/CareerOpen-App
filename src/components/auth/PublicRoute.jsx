import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * A public route component that redirects to the home page if the user is already authenticated.
 * Shows a loading spinner while checking authentication status.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render if not authenticated
 * @param {string} [props.redirectTo] - The path to redirect to if authenticated (defaults to '/')
 * @returns {JSX.Element} The public route component
 */
const PublicRoute = ({
  children,
  redirectTo = '/',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || redirectTo;

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // If user is already authenticated, redirect to the specified path or the previous location
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // User is not authenticated, render the public route
  return children;
};

export default PublicRoute;
