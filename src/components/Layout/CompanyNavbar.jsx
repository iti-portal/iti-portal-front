import React from 'react';
import { Link } from 'react-router-dom';
import unitiLogo from '../../assets/logo.png';
import NotificationDropdown from '../Common/Notifications/NotificationsDropdown';

const CompanyNavbar = ({ className = '' }) => (
  <nav className={`w-full flex items-center justify-between px-6 py-2 bg-white border-b shadow-sm z-50 ${className}`}>
    {/* Left: Logo and Title */}
    <div className="flex items-center">
      <Link to="/" className="flex items-center gap-2 text-[#901b20] flex-shrink-0">
        <img src={unitiLogo} alt="Uniti Logo" className="h-8 w-auto" />
        <span className="font-bold text-xl hidden sm:inline">UnITI</span>
      </Link>
    </div>
    
    {/* Right: User Icon and Avatar */}
    <div className="flex items-center gap-4">
      <NotificationDropdown />
      {/* <img
        src="/avatar.png"
        alt="Admin"
        className="w-8 h-8 rounded-full border-2 border-[#901b20] object-cover"
      /> */}
    </div>
  </nav>
);

export default CompanyNavbar;