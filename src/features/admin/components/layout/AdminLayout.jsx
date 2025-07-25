import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * AdminLayout component for wrapping admin pages
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {React.ReactElement} Admin layout wrapper
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fixed at the very top */}
      <AdminNavbar className="fixed top-0 left-0 right-0 z-30" />

      <div className="flex min-h-screen pt-2 lg:pt-14">
        {/* Sidebar - always visible */}
        <AdminSidebar />
        
        {/* Main content with animation */}
        <motion.main
          key={location.pathname}
          className="
            flex flex-col
            w-full
            ml-16 md:ml-0
            overflow-hidden
            px-2 py-4 sm:px-4 md:px-6 lg:px-8
            shadow-lg rounded-xl
          "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 flex-grow w-full overflow-hidden border border-gray-100">
           {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
