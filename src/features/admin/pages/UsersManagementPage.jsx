import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import UsersManagement from '../components/users/UsersManagement';

/**
 * UsersManagementPage component that wraps the users management with layout
 * @returns {React.ReactElement} Users management page
 */
const UsersManagementPage = () => (
  <AdminLayout>
    <UsersManagement />
  </AdminLayout>
);

export default UsersManagementPage;
