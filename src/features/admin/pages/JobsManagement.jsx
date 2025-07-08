import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import JobAdmin from '../components/jobs/jobsAdmin';

/**
 * StaffManagementPage component that wraps the staff management with layout
 * @returns {React.ReactElement} Staff management page
 */
const JobManagementPage = () => (
  <AdminLayout>
    <JobAdmin />
  </AdminLayout>
);

export default JobManagementPage  ;
