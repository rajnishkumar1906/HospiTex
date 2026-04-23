import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useApp();
  const token = localStorage.getItem('token');
  
  console.log('ProtectedRoute - user:', !!user, 'loading:', loading, 'token:', !!token, 'allowedRoles:', allowedRoles);
  
  if (loading) {
    console.log('Still loading, showing spinner');
    return <LoadingSpinner />;
  }
  
  if (!token || !user) {
    console.log('Redirecting to login - no token or user');
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('Redirecting to login - role not allowed:', user.role, 'allowed:', allowedRoles);
    return <Navigate to="/login" replace />;
  }
  
  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute;