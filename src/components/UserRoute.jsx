import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const   UserRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default  UserRoute;