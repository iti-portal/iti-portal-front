// components/EmailVerification.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/image1.png';

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email || 'your.email@example.com';

  const handleResend = () => {
    alert(`Verification email resent to ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-stretch bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto w-full max-w-7xl min-h-[500px] border border-[#e0e7ff]">
        {/* Left Side: Image and Title */}
        <div className="md:w-1/2 flex-1 flex flex-col items-center justify-center bg-gray-100 p-10 relative">
          <img
            src={logo}
            alt="Company Logo"
            className="h-56 object-contain mb-8 drop-shadow-xl"
            style={{ maxHeight: '220px' }}
          />
          {/* Animated Correct Sign */}
          <div className="flex items-center justify-center mb-4">
            <svg className="w-20 h-20 text-green-500 animate-bounce drop-shadow-lg" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" stroke="#22c55e" strokeWidth="4" fill="#fff" />
              <path d="M16 25l6 6 10-12" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-[#22c55e] text-center drop-shadow-sm mb-2">
            Email Sent!
          </h2>
          <p className="text-gray-600 text-center">
            Please check your inbox to verify your email.
          </p>
        </div>
        {/* Right Side: Verification Info */}
        <div className="md:w-1/2 flex-1 flex flex-col justify-center p-10 bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#901b20] mb-4 drop-shadow-sm">
              Verify Your Email
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              We've sent a verification link to your email address.<br />
              Please click the link to activate your account.
            </p>
            <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200 shadow">
              <p className="text-sm text-gray-500">A confirmation email has been sent to</p>
              <p className="font-semibold text-[#901b20] text-lg">{email}</p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              For your security, the link will expire in <span className="font-semibold text-gray-700">24 hours</span>.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleResend}
                className="w-full flex justify-center py-2 px-4 rounded-lg shadow-md text-sm font-semibold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(90deg,rgb(124, 44, 23) 0%, #901b20 100%)' }}
              >
                Resend Verification Email
              </button>
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 rounded-lg shadow-md text-sm font-semibold border border-[#901b20] transition hover:bg-[#fbeaec] hover:text-[#901b20]"
                style={{ color: '#901b20', borderColor: '#901b20' }}
              >
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;