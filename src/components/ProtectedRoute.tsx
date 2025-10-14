import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAuth(); // Destructuring the currentUser from the auth context

  // If there's no current user, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if the user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
