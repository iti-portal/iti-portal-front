import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const AdminNavbar = ({ className = '' }) => (
  <nav className={`w-full flex items-center justify-between px-6 py-2 bg-white border-b shadow-sm z-50 ${className} hidden lg:flex`}>
    
    {/* Left: Logo and Title */}
    <div className="flex items-center gap-2">
      <span className="inline-block">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </span>
      <Link to="/" className="font-semibold text-lg text-[#901b20] hover:underline">
        UnITI
      </Link>
    </div>

    {/* Right: Avatar only (user icon removed) */}
    <div className="flex items-center gap-4">
      <img
        src="/avatar.png"
        alt="Admin"
        className="w-8 h-8 rounded-full border-2 border-[#901b20] object-cover"
      />
    </div>
  </nav>
);

export default AdminNavbar;
