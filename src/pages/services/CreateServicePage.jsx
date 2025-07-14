import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../components/Layout/Navbar'; // Adjust path if needed
import ServiceForm from '../../features/services/components/ServiceForm'; // Adjust path if needed
import { createService } from '../../services/serviceApi'; // Adjust path if needed

const CreateServicePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateService = async (serviceData) => {
    setIsLoading(true);
    toast.info("Submitting your new service...", { autoClose: 2000 });

    try {
      const response = await createService(serviceData);
      
      if (response.success) {
        toast.success('🎉 Service created successfully!');
        // Redirect after a short delay to let the user see the success message.
        setTimeout(() => navigate('/my-services'), 2000); // Navigate to a page showing user's services
      }
    } catch (error) {
      // The error message comes from the API service function.
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
      <ToastContainer position="bottom-right" theme="colored" />
      <Navbar />
      
      {/* Decorative background elements from your design */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

      <main className="pt-24 pb-10 px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 border border-white/30 shadow-sm">
              <Briefcase className="text-[#901b20] mr-2" />
              <span className="text-[#901b20] font-semibold text-sm">OFFER A SERVICE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Create a New Service</h1>
            <p className="text-gray-600 text-lg">Share your expertise and skills with the ITI community.</p>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30"
          >
            <ServiceForm onSubmit={handleCreateService} isLoading={isLoading} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateServicePage;