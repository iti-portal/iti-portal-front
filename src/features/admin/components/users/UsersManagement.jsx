import React from 'react';
import UsersList from './UsersList';

/**
 * UsersManagement component for admin users management page
 * @returns {React.ReactElement} Users management component
 */
const UsersManagement = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#901b20] mb-6">Users Management</h1>
      
      {/* Actions */}
      <div className="flex justify-end mb-6">
        <button className="bg-[#901b20] text-white px-4 py-2 rounded-md hover:bg-[#a83236] transition flex items-center">
          <span className="material-icons text-sm mr-1">add</span>
          Add New User
        </button>
      </div>
      
      {/* Users List */}
      <UsersList />
    </div>
  );
};

export default UsersManagement;
