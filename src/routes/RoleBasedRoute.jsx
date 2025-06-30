import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../features/auth/utils/authHelpers';

const RoleBasedRoute = ({ children, requiredRole, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user exists
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role permissions
  let hasAccess = false;

  if (requiredRole) {
    // Use hierarchical permission check
    hasAccess = hasPermission(user.role, requiredRole);
  } else if (allowedRoles.length > 0) {
    // Check if user's role is in the allowed roles list
    hasAccess = allowedRoles.includes(user.role);
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default RoleBasedRoute;
