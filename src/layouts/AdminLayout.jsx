import React from 'react';
import AdminSidebar from '../features/admin/components/layout/AdminSidebar';
import AdminNavbar from '../components/Layout/AdminNavbar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Navbar fixed at the very top */}
      <AdminNavbar className="fixed top-0 left-0 right-0 z-30" />

      <div className="flex min-h-screen">
        {/* Sidebar - normal flow, takes full height */}
        <AdminSidebar />
        
        {/* Main content with animation */}
        <motion.main
          key={location.pathname}
          className="
            flex-1
            overflow-auto
            p-4 md:p-8
            max-w-screen-2xl mx-auto
            pt-20
          "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
