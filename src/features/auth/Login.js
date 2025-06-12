import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import leftImg from '../../assets/image.png';
import logo from '../../assets/logo.png';
import { loginUser } from '../../api/auth';

// Google and Facebook SVG icons
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <g>
      <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
      <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 16.1 19.2 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"/>
      <path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.2 34.9 26.7 36 24 36c-5.7 0-10.5-3.8-12.2-9.1l-7 5.4C9.6 39.6 16.3 43 24 43z"/>
      <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.7 0-5.2-.9-7.2-2.5l-6.4 6.4C13.9 42.9 18.7 45 24 45c7.7 0 14.4-4.4 17.7-10.7z"/>
    </g>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F3">
    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
  </svg>
);

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

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { ok, data } = await loginUser(form);
      if (ok) {
        if (data.success && data.data?.token) {
          localStorage.setItem('token', data.data.token);

          // Handle verification and approval logic
          if (data.data.role === 'admin') {
            showAlert('success', data.message || 'Login successful!');
            setTimeout(() => {
              navigate('/admin/dashboard');
            }, 1200);
          } else if (!data.data.isVerified) {
            showAlert('warning', data.message || 'Please verify your email to complete the login.');
            setTimeout(() => {
              navigate('/verify-email', { state: { email: form.email } });
            }, 1500);
          } else if (!data.data.isApproved) {
            showAlert('warning', 'Your account is pending approval. Please wait until an admin approves your account.');
          } else {
            showAlert('success', data.message || 'Login successful!');
            setTimeout(() => {
              navigate('/');
            }, 1200);
          }
        } else {
          showAlert('warning', data.message || 'Login failed');
        }
      } else {
        showAlert('error', data.message || 'Login failed');
      }
    } catch (error) {
      showAlert('error', 'Network error');
    }
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
              Welcome Back!
            </h2>
            <p className="text-gray-100 text-center text-lg drop-shadow mb-2">
              Please login to your ITI Portal account.
            </p>
          </div>
        </motion.div>
        {/* Right Side: Login Form */}
        <motion.div
          className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white"
          variants={itemVariants}
        >
          <div className="text-center mb-6">
            {/* Logo above Login word */}
            <img src={logo} alt="Logo" className="h-14 w-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#901b20] mb-2 drop-shadow-sm">
              Login
            </h2>
          </div>
          {/* Alert */}
          {alert.show && (
            <div
              className={`
                mb-6 px-4 py-3 rounded-lg text-center font-semibold transition-all
                ${alert.type === 'success' && 'bg-green-50 border border-green-200 text-green-700'}
                ${alert.type === 'error' && 'bg-red-50 border border-red-200 text-red-700'}
                ${alert.type === 'warning' && 'bg-yellow-50 border border-yellow-200 text-yellow-700'}
              `}
              role="alert"
            >
              {alert.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] transition"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="py-3 px-6 rounded-lg font-semibold text-white shadow-md transition hover:scale-105"
                style={{ backgroundColor: '#901b20' }}
              >
                Login
              </button>
              <a
                href="/forgot-password"
                className="text-sm text-[#901b20] hover:underline ml-4"
              >
                Forgot password?
              </a>
            </div>
          </form>
          <div className="mt-8 flex flex-col space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 rounded-lg shadow-md text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 rounded-lg shadow-md text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition"
            >
              <FacebookIcon />
              Sign in with Facebook
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;