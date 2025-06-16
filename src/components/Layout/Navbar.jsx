import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Common/Logo';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (    <header className="w-full bg-white shadow-sm border-b px-2 sm:px-4 py-2 flex items-center justify-between relative">
      {/* Logo - Always visible on left */}
      <div className="flex items-center gap-1 sm:gap-2 font-bold text-sm sm:text-base lg:text-lg text-[#901b20] flex-shrink-0">
        <Logo size="small" className="!mb-0 !mx-0 h-6 sm:h-8" />
        <span className="whitespace-nowrap">ITI Portal</span>
      </div>
        {/* Desktop Navbar Content - Only for large screens (1024px+) */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-between ml-4 xl:ml-6">
        <nav className="flex items-center gap-2 xl:gap-4 text-xs xl:text-sm font-medium">
          <Link to="/" className="text-[#901b20] border-b-2 border-[#901b20] pb-1 whitespace-nowrap">Home</Link>
          <Link to="/profile" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Profile</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Jobs</Link>
          <Link to="/company" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Company</Link>
          <Link to="/admin" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Admin</Link>
          <Link to="/network" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Network</Link>
          <Link to="/achievements" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Achievements</Link>
          <Link to="/articles" className="text-gray-700 hover:text-[#901b20] whitespace-nowrap">Articles</Link>
        </nav>
        <div className="flex items-center gap-2 xl:gap-4">
          <input
            type="text"
            placeholder="Search ITI Portal..."
            className="border border-[#901b20] rounded px-2 xl:px-3 py-1 text-xs xl:text-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] w-32 xl:w-64"
          />
          <button className="bg-[#901b20] text-white px-2 xl:px-4 py-1 xl:py-2 rounded font-semibold hover:bg-[#a83236] transition text-xs xl:text-sm whitespace-nowrap">
            Post Job
          </button>
          <span className="material-icons text-gray-500 cursor-pointer text-lg xl:text-xl">notifications_none</span>
          <span className="material-icons text-gray-500 cursor-pointer text-lg xl:text-xl">settings</span>
          <img
            src="/avatar.png"
            alt="User"
            className="w-7 h-7 xl:w-9 xl:h-9 rounded-full border-2 border-[#901b20] object-cover"
          />
        </div>
      </div>

      {/* Medium Screen Content (768px-1024px) */}
      <div className="hidden md:flex lg:hidden items-center gap-2 flex-1 justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="border border-[#901b20] rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#901b20] w-20"
        />
        <span className="material-icons text-gray-500 cursor-pointer text-lg">notifications_none</span>
        <img
          src="/avatar.png"
          alt="User"
          className="w-7 h-7 rounded-full border-2 border-[#901b20] object-cover"
        />
      </div>

      {/* Small Screen Content (640px-768px) */}
      <div className="hidden sm:flex md:hidden items-center gap-2 flex-1 justify-end">
        <span className="material-icons text-gray-500 cursor-pointer text-lg">notifications_none</span>
        <img
          src="/avatar.png"
          alt="User"
          className="w-6 h-6 rounded-full border-2 border-[#901b20] object-cover"
        />
      </div>
      
      {/* Hamburger for mobile and tablet screens */}
      <button
        className="lg:hidden ml-1 sm:ml-2 p-1 sm:p-2 rounded focus:outline-none flex-shrink-0"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="material-icons text-xl sm:text-2xl text-[#901b20]">{menuOpen ? 'close' : 'menu'}</span>
      </button>      {/* Mobile/Tablet Sidebar Menu */}
      {menuOpen && (
        <>
          {/* Sidebar */}
          <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col lg:hidden z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header with logo and close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 font-bold text-base text-[#901b20]">
                <Logo size="small" className="!mb-0 !mx-0 h-6" />
                <span>ITI Portal</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                aria-label="Close menu"
              >
                <span className="material-icons text-xl text-[#901b20]">close</span>
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col py-4 flex-1 overflow-y-auto">
              <Link to="/" className="text-[#901b20] font-semibold py-3 px-4 hover:bg-gray-100 border-l-4 border-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">home</span>
                Home
              </Link>
              <Link to="/profile" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">person</span>
                Profile
              </Link>
              <Link to="/jobs" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">work</span>
                Jobs
              </Link>
              <Link to="/company" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">business</span>
                Company
              </Link>
              <Link to="/admin" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">admin_panel_settings</span>
                Admin
              </Link>
              <Link to="/network" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">group</span>
                Network
              </Link>              <Link to="/achievements" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">emoji_events</span>
                Achievements
              </Link>
              <Link to="/articles" className="text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20]" onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">article</span>
                Articles
              </Link>
            </nav>
            
            {/* Search and Actions */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <input
                type="text"
                placeholder="Search ITI Portal..."
                className="border border-[#901b20] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] w-full"
              />
              <button className="bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition text-sm w-full">
                <span className="material-icons text-lg mr-2 align-middle">add</span>
                Post Job
              </button>
            </div>
            
            {/* User Section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/avatar.png"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-[#901b20] object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">John Doe</div>
                  <div className="text-xs text-gray-500">john.doe@example.com</div>
                </div>
              </div>
              <div className="flex items-center justify-around pt-2 border-t border-gray-200">
                <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
                  <span className="material-icons text-gray-500">notifications_none</span>
                  <span className="text-xs text-gray-600">Notifications</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
                  <span className="material-icons text-gray-500">settings</span>
                  <span className="text-xs text-gray-600">Settings</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
                  <span className="material-icons text-gray-500">logout</span>
                  <span className="text-xs text-gray-600">Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => setMenuOpen(false)}
          />
        </>
      )}
    </header>
  );
};

export default Navbar;