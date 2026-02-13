import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Renders children only if the user is logged in. Otherwise redirects to "/".
 * Waits for initial auth restore from localStorage before deciding (fixes redirect on refresh).
 */
export default function ProtectedRoute({ children }) {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
