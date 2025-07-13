import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck } from 'lucide-react'; // Import icons
import UpdateEmailForm from './forms/UpdateEmailForm';
import UpdatePasswordForm from './forms/UpdatePasswordForm';
import Navbar from '../../../components/Layout/Navbar';

function AccountSettings() {
  const [activeTab, setActiveTab] = useState('email');

  const handleSuccess = (message) => {
    console.log('Success:', message);
    // Add toast notification logic here if desired
  };

  const tabs = [
    { id: 'email', label: 'Update Email', icon: <Mail size={18} /> },
    { id: 'password', label: 'Update Password', icon: <Lock size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'email':
        return <UpdateEmailForm onSuccess={handleSuccess} />;
      case 'password':
        return <UpdatePasswordForm onSuccess={handleSuccess} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

        {/* Animated Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-24 pb-16 px-4"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-sm border border-white/80 mb-4">
            <ShieldCheck className="text-[#901b20]" size={18}/>
            <span className="font-semibold text-sm text-gray-700">Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Settings</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Manage your account email and password.</p>
        </motion.section>

        {/* Main Content with Two-Column Layout */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto px-4 pb-16"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              
              {/* Left Sidebar Navigation */}
              <aside className="md:w-1/3 lg:w-1/4">
                <nav className="sticky top-24 flex flex-col gap-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg text-left transition-colors ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-200/50'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeSettingsTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#901b20] to-[#a83236] rounded-lg shadow-md"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Right Content Area */}
              <main className="md:w-2/3 lg:w-3/4 bg-white/50 border border-gray-200/80 rounded-lg p-6 min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </main>

            </div>
          </div>
        </motion.main>
      </div>
    </>
  );
};

export default AccountSettings;