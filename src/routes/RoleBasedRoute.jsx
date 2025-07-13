import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A route guard that checks for authentication and user role.
 * It handles the loading state, redirects unauthenticated users to login,
 * and redirects unauthorized users to the unauthorized page.
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. While authentication is being checked, show a loading indicator.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20]"></div>
      </div>
    );
  }

  // 2. If the user is not authenticated, redirect to the login page.
  if (!isAuthenticated) {
    // Save the location they were trying to go to, so we can redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log('Role Check -> User Role:', user?.role, '| Allowed Roles:', allowedRoles);
  // 3. If the user is authenticated, check if their role is allowed.
  // The `user.role` is already processed by AuthContext to be 'student' if they were 'alumni'.
  if (!allowedRoles || !allowedRoles.includes(user.role)) {
    // Redirect to an "Unauthorized" page if their role is not in the list.
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // 4. If all checks pass, render the requested component.
  return children;
};

export default RoleBasedRoute;