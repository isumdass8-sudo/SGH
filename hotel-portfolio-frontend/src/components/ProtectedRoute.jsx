import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  if (!admin || !localStorage.getItem('admin_token')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
