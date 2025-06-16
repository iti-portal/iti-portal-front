import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import ServiceManagement from '../components/services/ServiceManagement';

/**
 * ServiceManagementPage component that wraps the service management with layout
 * @returns {React.ReactElement} Service management page
 */
const ServiceManagementPage = () => (
  <AdminLayout>
    <ServiceManagement />
  </AdminLayout>
);

export default ServiceManagementPage;
