import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // Redirect if not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // Restrict based on role

  return children;
};

export default ProtectedRoute;
