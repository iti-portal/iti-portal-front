import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resendVerificationEmail } from '../services/emailVerificationAPI';
import Alert from '../../../components/UI/Alert';
import Logo from '../../../components/Common/Logo';
import logo from '../../../assets/image1.png';

/**
 * Email Verification Page Component
 * Shows email sent confirmation and allows resending verification email
 */
const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || 'your.email@example.com';
  const [isResending, setIsResending] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  // Redirect if no email provided - user should come from registration
  useEffect(() => {
    if (!location.state?.email) {
      console.warn('No email provided to verification page, redirecting to registration');
      // Redirect to registration page after a short delay
      setTimeout(() => {
        navigate('/register', { 
          replace: true,
          state: { 
            message: 'Please complete registration first to verify your email.' 
          }
        });
      }, 2000);
    }
  }, [location.state?.email, navigate]);

  const showAlert = (type, message, duration = 4000) => {
    setAlert({ show: true, type, message });
    if (duration) {
      setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), duration);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  const handleResendEmail = async () => {
    const token = localStorage.getItem('verify_token');
    if (!token) {
      showAlert('error', 'No verification token found.', 5000);
      return;
    }
    
    setIsResending(true);

    try {
      const response = await resendVerificationEmail(token);

      let message = 'Verification email resent!';
      let type = 'success';
      
      try {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          if (data.message) message = data.message;
        }
      } catch {}

      if (response.ok) {
        showAlert(type, message, 5000);
      } else {
        showAlert('error', 'Failed to resend verification email.', 5000);
      }
    } catch (error) {
      showAlert('error', 'Network error. Please try again.', 5000);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947]">
      {/* Show redirect message if no email provided */}
      {!location.state?.email && (
        <div className="flex justify-center mb-8">
          <div className="bg-yellow-400 text-[#203947] border border-yellow-500 rounded-xl p-4 max-w-md shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#203947]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-[#203947]">
                  Redirecting to Registration
                </h3>
                <div className="mt-2 text-sm text-[#203947]/80">
                  <p>Please complete registration first. Redirecting...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-stretch bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mx-auto w-full max-w-6xl min-h-[600px] border border-white/20">
        {/* Left Side: Image and Title */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#203947]/90 via-[#901b20]/90 to-[#203947]/90 p-10 relative"
        >          <motion.img
            src={logo}
            alt="ITI Portal Logo"
            className="h-48 object-contain mb-6 drop-shadow-2xl"
            style={{ maxHeight: '190px' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Animated Checkmark */}
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <svg className="w-16 h-16 text-yellow-400 animate-bounce drop-shadow-lg" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" stroke="#fbbf24" strokeWidth="4" fill="#fff" />
              <motion.path 
                d="M16 25l6 6 10-12" 
                stroke="#fbbf24" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </svg>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-white text-center drop-shadow-lg mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Email Sent!
          </motion.h2>
          <motion.p 
            className="text-white/90 text-center text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Please check your inbox to verify your email.
          </motion.p>
        </motion.div>

        {/* Right Side: Verification Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white"
        >          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <Logo size="large" center={true} marginBottom={false} />
            </motion.div>

            {/* Alert */}
            <Alert
              show={alert.show}
              type={alert.type}
              message={alert.message}
              onClose={handleCloseAlert}
            />

            <motion.h2 
              className="text-2xl font-bold text-[#901b20] mb-4 drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Verify Your Email
            </motion.h2>

            <motion.p 
              className="text-gray-700 mb-6 text-base leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We've sent a verification link to your email address.<br />
              Please click the link to activate your account.
            </motion.p>

            <motion.div 
              className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-sm text-gray-500">A confirmation email has been sent to</p>
              <p className="font-semibold text-[#901b20] text-base break-all">{email}</p>
            </motion.div>

            <motion.p 
              className="text-sm text-gray-500 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              For your security, the link will expire in <span className="font-semibold text-gray-700">24 hours</span>.
            </motion.p>

            <motion.div 
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#901b20] to-[#203947] hover:from-[#7a1419] hover:to-[#1a2f3a] hover:shadow-xl"
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-sm font-semibold border-2 border-[#901b20] text-[#901b20] transition-all duration-200 hover:bg-[#901b20]/10 hover:scale-105"
              >
                Return to Login
              </button>

              <button
                onClick={() => navigate('/register')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                ← Back to Registration
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
