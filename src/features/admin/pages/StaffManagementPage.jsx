import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import StaffManagement from '../components/staff/StaffManagement';

/**
 * StaffManagementPage component that wraps the staff management with layout
 * @returns {React.ReactElement} Staff management page
 */
const StaffManagementPage = () => (
  <AdminLayout>
    <StaffManagement />
  </AdminLayout>
);

export default StaffManagementPage;
