import React from 'react';
import ContactList from './ContactList';

/**
 * UsersManagement component for admin users management page
 * @returns {React.ReactElement} Users management component
 */
const ContactUsManagement = () => { 
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#901b20] mb-6">Contact Us Management</h1>
      
      {/* Actions */}
      
      {/* Users List */}
      <ContactList />
    </div>
  );
};

export default ContactUsManagement;
