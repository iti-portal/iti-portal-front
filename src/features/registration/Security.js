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

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-[#901b20] mb-6 text-center tracking-wide">Security</h2>
      </motion.div>
      <motion.div className="space-y-5" variants={containerVariants}>
        {/* ID Photo Upload - Front */}
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="idPhotoFront">
            Upload ID Photo (Front)
          </label>
          <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-[#901b20] rounded-xl p-6 transition hover:border-[#c53030] hover:bg-gray-100">
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
              <svg className="w-12 h-12 text-[#901b20] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="8" y="12" width="32" height="24" rx="4" fill="#fff" stroke="#901b20" />
                <path d="M16 28l6-6 6 6" stroke="#901b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="20" r="2" fill="#901b20" />
              </svg>
              <span className="text-[#901b20] font-medium text-sm">
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
          <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-[#901b20] rounded-xl p-6 transition hover:border-[#c53030] hover:bg-gray-100">
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
              <svg className="w-12 h-12 text-[#901b20] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="8" y="12" width="32" height="24" rx="4" fill="#fff" stroke="#901b20" />
                <path d="M16 28l6-6 6 6" stroke="#901b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="20" r="2" fill="#901b20" />
              </svg>
              <span className="text-[#901b20] font-medium text-sm">
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
      </motion.div>
      <motion.div className="flex justify-between mt-8" variants={itemVariants}>
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg font-semibold text-white shadow-md"
          style={{ backgroundColor: '#901b20' }}
        >
          Next Step
        </button>
      </motion.div>
    </motion.form>
  );
};

export default Security;