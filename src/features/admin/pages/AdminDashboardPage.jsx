import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../components/dashboard/AdminDashboard';

/**
 * AdminDashboardPage component that wraps the dashboard with layout
 * @returns {React.ReactElement} Admin dashboard page
 */
const AdminDashboardPage = () => (
  <AdminLayout>
    <AdminDashboard />
  </AdminLayout>
);

export default AdminDashboardPage;
