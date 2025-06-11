import React, { useState } from 'react';
import { motion } from 'framer-motion';
import leftImg from '../../assets/image.png';
import logo from '../../assets/logo.png';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [reset, setReset] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Add your reset password logic here (API call, etc.)
    setReset(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex flex-col md:flex-row items-stretch bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto w-full max-w-4xl min-h-[500px] border border-[#e0e7ff]"
        variants={itemVariants}
      >
        {/* Left Side: Full Image with Overlay Text */}
        <motion.div
          className="md:w-1/2 flex-1 relative flex items-center justify-center bg-gray-100 p-0"
          variants={itemVariants}
        >
          <img
            src={leftImg}
            alt="Company Logo"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-40 p-10">
            <h2 className="text-3xl font-extrabold text-white text-center drop-shadow-lg mb-2">
              Reset Password
            </h2>
            <p className="text-gray-100 text-center text-lg drop-shadow mb-2">
              Please enter your new password below.
            </p>
          </div>
        </motion.div>
        {/* Right Side: Reset Password Form */}
        <motion.div
          className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white"
          variants={itemVariants}
        >
          <div className="text-center mb-6">
            {/* Logo above Reset Password word */}
            <img src={logo} alt="Logo" className="h-14 w-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#901b20] mb-2 drop-shadow-sm">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your new password and confirm it to reset your account password.
            </p>
          </div>
          {!reset ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white shadow-md transition hover:scale-105"
                style={{ backgroundColor: '#901b20' }}
              >
                Reset Password
              </button>
              <a
                href="/login"
                className="block text-center text-[#901b20] hover:underline mt-4"
              >
                Back to Login
              </a>
            </form>
          ) : (
            <div className="text-center mt-8">
              <p className="text-green-600 font-semibold mb-4">
                Your password has been reset successfully.
              </p>
              <a
                href="/login"
                className="text-[#901b20] hover:underline"
              >
                Return to Login
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;