import React from 'react';
import { AdminDashboardPage as AdminDashboard } from '../features/admin';

/**
 * Main AdminDashboardPage component that's used by the router
 * This is a wrapper around the feature's component
 * @returns {React.ReactElement} Admin dashboard page
 */
const AdminDashboardPage = () => <AdminDashboard />;

export default AdminDashboardPage;