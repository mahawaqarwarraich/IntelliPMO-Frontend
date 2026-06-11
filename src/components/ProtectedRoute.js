import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Renders children only if the user is logged in. Otherwise redirects to "/".
 * Waits for initial auth restore from localStorage before deciding (fixes redirect on refresh).
 * Optional `roles`: if set, the user's role must be one of these or they are sent to /dashboard.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
