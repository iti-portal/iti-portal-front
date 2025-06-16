/**
 * Admin feature entry point
 * Export all public components, hooks, and utilities
 */

// Page components
export { default as AdminDashboardPage } from './pages/AdminDashboardPage';
export { default as UsersManagementPage } from './pages/UsersManagementPage';
export { default as StaffManagementPage } from './pages/StaffManagementPage';
export { default as ServiceManagementPage } from './pages/ServiceManagementPage';

// Layout components
export { default as AdminLayout } from './components/layout/AdminLayout';
export { default as AdminNavbar } from './components/layout/AdminNavbar';
export { default as AdminSidebar } from './components/layout/AdminSidebar';
export { default as AdminFooter } from './components/layout/AdminFooter';

// Dashboard components
export { default as AdminDashboard } from './components/dashboard/AdminDashboard';

// Users components
export { default as UsersManagement } from './components/users/UsersManagement';
export { default as UsersList } from './components/users/UsersList';

// Staff components
export { default as StaffManagement } from './components/staff/StaffManagement';

// Services components
export { default as ServiceManagement } from './components/services/ServiceManagement';
export { default as RequestServiceTable } from './components/services/RequestServiceTable';

// Hooks
export { default as useDashboard } from './hooks/useDashboard';

// Services
export * from './services/adminAPI';

// Utils
export * from './utils/adminHelpers';
