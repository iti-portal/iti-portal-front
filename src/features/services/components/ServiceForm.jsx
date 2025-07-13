import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

function ServiceForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    serviceType: 'business_session',
    title: '',
    description: ''
  });

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
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full pl-4 pr-10 py-2.5 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        >
          <option value="business_session">Business Session</option>
          <option value="course_teaching">Course Teaching</option>
        </select>
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
          className="w-full px-4 py-2.5 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-gray-400">(Optional)</span></label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the service you are offering..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] outline-none transition"
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200/50 flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
          <span>{isLoading ? 'Submitting...' : 'Create Service'}</span>
        </motion.button>
      </div>
    </form>
  );
}

export default ServiceForm;