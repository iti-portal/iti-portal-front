import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../features/auth/types/auth.types';
import { hasPermission } from '../features/auth/utils/authHelpers';

/**
 * Custom hook for checking user permissions and roles
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const isAdmin = () => {
    return isAuthenticated && user?.role === USER_ROLES.ADMIN;
  };

  const isStudent = () => {
    return isAuthenticated && user?.role === USER_ROLES.STUDENT;
  };

  const isStaff = () => {
    return isAuthenticated && user?.role === USER_ROLES.STAFF;
  };

  const isCompany = () => {
    return isAuthenticated && user?.role === USER_ROLES.COMPANY;
  };

  const isAlumni = () => {
    return isAuthenticated && user?.role === USER_ROLES.ALUMNI;
  };

  const hasRole = (role) => {
    return isAuthenticated && user?.role === role;
  };

  const hasMinimumRole = (requiredRole) => {
    return isAuthenticated && user?.role && hasPermission(user.role, requiredRole);
  };

  const canAccessAdmin = () => {
    return isAdmin();
  };

  const canAccessStaffFeatures = () => {
    return hasMinimumRole(USER_ROLES.STAFF);
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isStudent,
    isStaff,
    isCompany,
    isAlumni,
    hasRole,
    hasMinimumRole,
    canAccessAdmin,
    canAccessStaffFeatures,
  };
};

export default usePermissions;
