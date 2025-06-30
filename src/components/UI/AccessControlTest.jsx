import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Test component to verify role-based access control
 * This component can be temporarily added to any page to test permissions
 */
const AccessControlTest = () => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isStudent, 
    canAccessAdmin 
  } = usePermissions();

  if (!isAuthenticated) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Not Authenticated:</strong> User is not logged in
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold text-lg mb-2">Access Control Test</h3>
      <div className="space-y-1 text-sm">
        <p><strong>User:</strong> {user?.name || user?.email || 'Unknown'}</p>
        <p><strong>Role:</strong> {user?.role || 'No role'}</p>
        <p><strong>Is Admin:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Is Student:</strong> {isStudent() ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Can Access Admin:</strong> {canAccessAdmin() ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Admin Navigation Should Be:</strong> {canAccessAdmin() ? '👀 Visible' : '🔒 Hidden'}</p>
      </div>
    </div>
  );
};

export default AccessControlTest;
