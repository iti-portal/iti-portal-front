import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Security = ({ formData, handleFileChange, nextStep, prevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.idPhotoFront || !formData.idPhotoBack) {
      alert('Please upload both front and back ID photos.');
      return;
    }
    nextStep();
  };

  return (    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-[#901b20] mb-4 text-center tracking-wide">Security</h2>
      </motion.div>
      <motion.div className="space-y-4" variants={containerVariants}>
        {/* ID Photo Upload - Front */}        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-1 font-medium text-xs" htmlFor="idPhotoFront">
            Upload ID Photo (Front)
          </label>
          <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-[#901b20] rounded-lg p-4 transition hover:border-[#c53030] hover:bg-gray-100">
            <input
              id="idPhotoFront"
              name="idPhotoFront"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              
            />
            <label
              htmlFor="idPhotoFront"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="w-10 h-10 text-[#901b20] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="8" y="12" width="32" height="24" rx="4" fill="#fff" stroke="#901b20" />
                <path d="M16 28l6-6 6 6" stroke="#901b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="20" r="2" fill="#901b20" />
              </svg>
              <span className="text-[#901b20] font-medium text-xs">
                Click to select or drag & drop
              </span>
              <span className="text-gray-400 text-xs mt-1">
                PNG, JPG, JPEG up to 5MB
              </span>
            </label>
            {formData.idPhotoFront && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(formData.idPhotoFront)}
                  alt="ID Front Preview"
                  className="h-32 rounded shadow border object-contain mb-2"
                />
                <span className="text-xs text-gray-600">
                  {formData.idPhotoFront.name}
                </span>
              </div>
            )}
          </div>
        </motion.div>
        {/* ID Photo Upload - Back */}
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="idPhotoBack">
            Upload ID Photo (Back)
          </label>
          <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-[#901b20] rounded-lg p-4 transition hover:border-[#c53030] hover:bg-gray-100">
            <input
              id="idPhotoBack"
              name="idPhotoBack"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              
            />
            <label
              htmlFor="idPhotoBack"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="w-10 h-10 text-[#901b20] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="8" y="12" width="32" height="24" rx="4" fill="#fff" stroke="#901b20" />
                <path d="M16 28l6-6 6 6" stroke="#901b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="20" r="2" fill="#901b20" />
              </svg>
              <span className="text-[#901b20] font-medium text-xs">
                Click to select or drag & drop
              </span>
              <span className="text-gray-400 text-xs mt-1">
                PNG, JPG, JPEG up to 5MB
              </span>
            </label>
            {formData.idPhotoBack && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(formData.idPhotoBack)}
                  alt="ID Back Preview"
                  className="h-32 rounded shadow border object-contain mb-2"
                />
                <span className="text-xs text-gray-600">
                  {formData.idPhotoBack.name}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>      <motion.div className="flex justify-between mt-6" variants={itemVariants}>
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded-md font-medium text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md font-medium text-xs text-white shadow-xs"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default Security;
