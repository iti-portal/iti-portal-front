import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Stagger animation for each field
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function EducationForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        institution: initialData.institution || '',
        degree: initialData.degree || '',
        fieldOfStudy: initialData.fieldOfStudy || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        description: initialData.description || '',
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
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Institution & Degree Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fieldVariants}>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Institution<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g. Cairo University"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
          />
        </motion.div>
        <motion.div variants={fieldVariants}>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
            Degree<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g. Bachelor of Science"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
          />
        </motion.div>
      </div>

      {/* Field of Study */}
      <motion.div variants={fieldVariants}>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
          Field of Study<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={formData.fieldOfStudy}
          onChange={handleChange}
          placeholder="e.g. Computer Engineering"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
        />
      </motion.div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fieldVariants}>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
          />
        </motion.div>
        <motion.div variants={fieldVariants}>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank if currently enrolled.</p>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div variants={fieldVariants}>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe your studies, achievements, relevant coursework..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent transition"
        ></textarea>
      </motion.div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Save size={18} />
          {initialData ? 'Save Changes' : 'Add Education'}
        </motion.button>
      </div>
    </motion.form>
  );
}

export default EducationForm;