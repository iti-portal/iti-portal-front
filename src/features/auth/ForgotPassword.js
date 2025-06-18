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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
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
              Forgot Password?
            </h2>
            <p className="text-gray-100 text-center text-lg drop-shadow mb-2">
              Enter your email to reset your password.
            </p>
          </div>
        </motion.div>
        {/* Right Side: Forgot Password Form */}
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
              Enter your email address below and we'll send you a link to reset your password.
            </p>
          </div>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white shadow-md transition hover:scale-105"
                style={{ backgroundColor: '#901b20' }}
              >
                Send Reset Link
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
                If an account with that email exists, a reset link has been sent.
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

export default ForgotPassword;