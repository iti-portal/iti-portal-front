import React from 'react';
import CompanySidebar from '../components/Layout/CompanySidebar';
import CompanyNavbar from '../components/Layout/CompanyNavbar';
import { motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';

const CompanyLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar at the top */}
      <CompanyNavbar className="fixed top-0 left-0 right-0 z-30" />

      {/* Sidebar fixed to the left */}
      <CompanySidebar />

      {/* Main content shifted right and down */}
      <motion.main
        key={location.pathname}
        className="
          ml-64 pt-14 min-h-screen px-2 py-4 sm:px-4 md:px-6 lg:px-8
          transition-all duration-300
        "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden border border-gray-100">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default CompanyLayout;
