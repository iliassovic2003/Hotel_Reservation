import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Logged in? Show the page
  return <>{children}</>;
};

export default ProtectedRoute;