import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { token, student, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && student?.role !== role) {
    return <Navigate to={student?.role === 'teacher' ? '/teacher-dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
