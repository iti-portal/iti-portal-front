import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import ApprovalsManagment from '../components/approvals/ApprovalsManagment';

/**
 * ApprovalsManagementPage component that wraps the dashboard with layout
 * @returns {React.ReactElement} Approvals Management Page
 */
const ApprovalsManagementPage = () => (
  <AdminLayout>
    <ApprovalsManagment />
  </AdminLayout>
);

export default ApprovalsManagementPage;
