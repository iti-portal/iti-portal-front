import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

/**
 * A reusable form for creating or editing a service.
 * @param {function} onSubmit - The function to execute on form submission.
 * @param {boolean} isLoading - Flag to show loading state.
 * @param {object} [initialData=null] - Pre-filled data for editing.
 * @param {string} [submitButtonText='Create Service'] - Text for the submit button.
 */
function ServiceForm({ onSubmit, isLoading = false, initialData = null, submitButtonText = 'Create Service' }) {
  const [formData, setFormData] = useState({
    serviceType: 'business_session',
    title: '',
    description: ''
  });

  // If initialData is provided (i.e., for editing), populate the form state.
  useEffect(() => {
    if (initialData) {
      setFormData({
        serviceType: initialData.serviceType || 'business_session',
        title: initialData.title || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
        <input
          id="serviceType"
          name="serviceType"
          type="text"
          placeholder="e.g., Business Session, Course Teaching"
          value={formData.serviceType}
          onChange={handleChange}
          required // Make this field required
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g., Advanced Frontend Development"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the service you are offering..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
          <span>{isLoading ? 'Submitting...' : submitButtonText}</span>
        </motion.button>
      </div>
    </form>
  );
}

export default ServiceForm;