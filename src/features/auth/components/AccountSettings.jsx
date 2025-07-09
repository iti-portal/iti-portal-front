import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UpdateEmailForm from './forms/UpdateEmailForm';
import UpdatePasswordForm from './forms/UpdatePasswordForm';
import Navbar from '../../../components/Layout/Navbar';
/**
 * Account Settings Component
 * Container component for account management features
 */
const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('email');

  const handleSuccess = (message) => {
    console.log('Success:', message);
    // You can add additional success handling here
    // like showing a toast notification or refreshing user data
  };

  const tabClasses = (tab) => `
    px-4 py-2 font-medium text-sm transition-colors rounded-md
    ${activeTab === tab 
      ? 'bg-[#901b20] text-white' 
      : 'text-gray-600 hover:text-[#901b20] hover:bg-gray-50'
    }
  `;

  return (
    <><Navbar />
    <div className="max-w-2xl mx-auto pt-20">
          <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h1>
              <p className="text-gray-600">Manage your account email and password</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                  onClick={() => setActiveTab('email')}
                  className={tabClasses('email')}
              >
                  Update Email
              </button>
              <button
                  onClick={() => setActiveTab('password')}
                  className={tabClasses('password')}
              >
                  Update Password
              </button>
          </div>

          {/* Tab Content */}
          <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border p-6"
          >
              {activeTab === 'email' && (
                  <UpdateEmailForm onSuccess={handleSuccess} />
              )}

              {activeTab === 'password' && (
                  <UpdatePasswordForm onSuccess={handleSuccess} />
              )}
          </motion.div>
      </div></>
  );
};

export default AccountSettings;