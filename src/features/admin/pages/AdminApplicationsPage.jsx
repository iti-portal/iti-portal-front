import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AdminApplicationsPage from '../components/applications/AdminApplicantionsComponent';

/**
 * AdminDashboardPage component that wraps the dashboard with layout
 * @returns {React.ReactElement} Admin dashboard page
 */
const AdminApplicationPageLayout = () => (
  <AdminLayout>
    <AdminApplicationsPage/>
  </AdminLayout>
);

export default  AdminApplicationPageLayout;
