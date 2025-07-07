import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import ContactUsManagement from '../components/contactUs/ContactUsManagement';

/**
 * UsersManagementPage component that wraps the users management with layout
 * @returns {React.ReactElement} Users management page
 */
const ContactUsManagementPage = () => (
  <AdminLayout>
    <ContactUsManagement />
  </AdminLayout>
);

export default ContactUsManagementPage;
