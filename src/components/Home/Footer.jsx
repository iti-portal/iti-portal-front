import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Common/Logo';
import { FaFacebook, FaTwitter, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#203947] text-white py-20 border-t border-[#901b20]/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#901b20] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-28 h-28 bg-[#f59e0b] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6 group">
              <Logo className="h-12 w-auto group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#901b20]">
                ITI Portal
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              Connecting Egypt's tech talent with opportunities and knowledge. Over 30 years of excellence in technology education and career development.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/ITI.eg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#7a1619] rounded-2xl flex items-center justify-center text-white hover:from-[#7a1619] hover:to-[#5a0f12] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-[#901b20]/25"
              >
                <FaFacebook className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://x.com/iti_channel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-[#203947]/25"
              >
                <FaTwitter className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.linkedin.com/school/information-technology-institute-iti-/?originalSubdomain=eg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-[#f59e0b]/25"
              >
                <FaLinkedin className="text-xl group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f59e0b]">Quick Links</h3>
            <ul className="space-y-6">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-lg">
                  <FaArrowRight className="mr-3 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-lg">
                  <FaArrowRight className="mr-3 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Achievements</span>
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-lg">
                  <FaArrowRight className="mr-3 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Articles</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-lg">
                  <FaArrowRight className="mr-3 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Jobs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">Stay Updated</h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Get the latest tech insights and opportunities delivered to your inbox.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-lg"
              />
              <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 text-lg">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-400 text-lg">
            © {new Date().getFullYear()} Information Technology Institute. All rights reserved. Built with ❤️ for Egypt's tech community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
