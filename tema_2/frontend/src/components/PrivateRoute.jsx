// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

// Component to restrict routes based on authentication
const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // If still loading authentication state, show loading
  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have permission, redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'RECEPTIONIST') {
      return <Navigate to="/receptionist/dashboard" replace />;
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // If all checks pass, render the child routes
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;