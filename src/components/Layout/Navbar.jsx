import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../features/auth/types/auth.types';
import { getGeneralStatistics } from '../../services/statisticsService';
import Logo from '../Common/Logo';

// A single, reusable dropdown component to avoid repetition
const ProfileDropdown = ({ user, isAdmin, isCompany, onLogout, closeDropdown, logoutLoading }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    closeDropdown();
  };
  
  // Define links based on user role
  let links = [];
  if (isAdmin) {
    links = [
      { path: '/admin/dashboard', text: 'Admin Dashboard', icon: 'dashboard' },
      { path: '/admin/profile', text: 'View Profile', icon: 'person' },
    ];
  } else if (isCompany) {
    links = [
      { path: '/company/dashboard', text: 'Company Dashboard', icon: 'dashboard' },
      { path: '/company/profile', text: 'View Profile', icon: 'person' },
    ];
  } else { // Student or Alumni
    links = [
      { path: '/student/profile', text: 'View Profile', icon: 'person' },
      { path: '/my-achievements', text: 'My Achievements', icon: 'emoji_events' },
      { path: '/my-network', text: 'My Network', icon: 'group' },
      { path: '/student/profile/edit', text: 'Edit Profile', icon: 'edit' },
    ];
  }

  return (
    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="font-semibold text-gray-800 text-sm truncate">
          {user?.profile?.first_name || user?.name || 'User'}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {user?.email || 'No email available'}
        </div>
      </div>
      
      {links.map(link => (
        <button key={link.path} onClick={() => handleNavigate(link.path)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors">
          <span className="material-icons text-lg mr-3">{link.icon}</span>
          {link.text}
        </button>
      ))}

      <div className="border-t border-gray-200 mt-2 pt-2">
        <button onClick={() => handleNavigate('/account/settings')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors">
          <span className="material-icons text-lg mr-3">settings</span>
          Account Settings
        </button>
        <button onClick={onLogout} disabled={logoutLoading} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <span className="material-icons text-lg mr-3">{logoutLoading ? 'hourglass_empty' : 'logout'}</span>
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loginSuccessAlert, setLoginSuccessAlert] = useState({ show: false, message: '' });

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef(null);

  // Define user roles for cleaner logic
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isCompany = user?.role === USER_ROLES.COMPANY;
  const isStudentOrAlumni = !isAdmin && !isCompany;

  // Centralized navigation links
  const navLinks = [
    { to: '/', text: 'Home', icon: 'home' },
    { to: '/student/availablejobs', text: 'Jobs', icon: 'work', show: isStudentOrAlumni },
    // { to: '/company', text: 'Companies', icon: 'business' },
    { to: '/network', text: 'Network', icon: 'group' },
    { to: '/achievements', text: 'Achievements', icon: 'emoji_events' },
    { to: '/student/articles', text: 'Articles', icon: 'article', show: isStudentOrAlumni },
    { to: '/admin/dashboard', text: 'Admin', icon: 'admin_panel_settings', show: isAdmin },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      if (user?.id) sessionStorage.removeItem(`loginAlert_${user.id}_shown`);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    } finally {
      setLogoutLoading(false);
      setProfileDropdownOpen(false);
      setMenuOpen(false);
    }
  };
  
  // Show welcome message after login
  useEffect(() => {
    const showLoginAlert = async () => {
      const alertShownKey = `loginAlert_${user?.id}_shown`;
      if (isAuthenticated && user && !sessionStorage.getItem(alertShownKey) && location.pathname === '/') {
        const userName = user.profile?.first_name || user.name || 'User';
        let message = `Welcome back, ${userName}! 👋`;

        if (isStudentOrAlumni) {
          try {
            const response = await getGeneralStatistics();
            const percentage = Math.round(response?.data?.completion_percentage);
            if (percentage < 100) {
              message = `Welcome, ${userName}! Your profile is ${percentage}% complete. Finish it to get noticed!`;
            }
          } catch (error) {
            console.error('Failed to fetch stats for login alert:', error);
          }
        }
        
        setLoginSuccessAlert({ show: true, message });
        sessionStorage.setItem(alertShownKey, 'true');
        setTimeout(() => setLoginSuccessAlert({ show: false, message: '' }), 5000);
      }
    };
    showLoginAlert();
  }, [isAuthenticated, user, location.pathname, isStudentOrAlumni]);

  const getLinkClasses = (path, isMobile = false) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isMobile) {
      return `flex items-center text-lg w-full ${isActive ? "text-[#901b20] font-semibold py-3 px-4 bg-red-50 border-l-4 border-[#901b20]" : "text-gray-700 py-3 px-4 hover:bg-gray-100 border-l-4 border-transparent"}`;
    }
    return `text-sm font-medium transition-all duration-200 ${isActive ? "text-[#901b20] border-b-2 border-[#901b20]" : "text-gray-600 hover:text-[#901b20] border-b-2 border-transparent"}`;
  };

  if (!isAuthenticated) return null; // Don't render navbar if not logged in

  return (
    <>
      <header className="sticky top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm border-b z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#901b20] flex-shrink-0">
            <Logo size="small" className="h-8 w-auto" />
            <span className="font-bold text-xl hidden sm:inline">UnITI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
            {navLinks.map(link => (
              (link.show === undefined || link.show) &&
              <Link key={link.text} to={link.to} className={getLinkClasses(link.to)}>
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="material-icons text-gray-600">notifications</span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileDropdownOpen(prev => !prev)}>
                <img
                  src={user?.profile?.profile_picture || "/avatar.png"}
                  alt="User"
                  className="w-9 h-9 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:opacity-90 transition"
                />
              </button>
              {profileDropdownOpen && (
                <ProfileDropdown
                  user={user}
                  isAdmin={isAdmin}
                  isCompany={isCompany}
                  onLogout={handleLogout}
                  logoutLoading={logoutLoading}
                  closeDropdown={() => setProfileDropdownOpen(false)}
                />
              )}
            </div>
          </div>
          
          {/* Hamburger Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="p-2 -mr-2" aria-label="Open menu">
              <span className="material-icons text-3xl text-[#901b20]">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-50 transform transition-transform ease-in-out duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)}></div>
        
        {/* Sidebar Panel */}
        <div className="relative w-80 max-w-[85vw] h-full bg-white ml-auto flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-lg text-[#901b20]">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="p-2" aria-label="Close menu">
              <span className="material-icons text-2xl text-[#901b20]">close</span>
            </button>
          </div>
          
          {/* User Info */}
          <div className="p-4 flex items-center gap-3 border-b bg-gray-50">
            <img
              src={user?.profile?.profile_picture || "/avatar.png"}
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-[#901b20] object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-gray-800 truncate">{user?.profile?.first_name || user?.name || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</div>
            </div>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {navLinks.map(link => (
              (link.show === undefined || link.show) &&
              <Link key={link.text} to={link.to} className={getLinkClasses(link.to, true)}>
                <span className="material-icons mr-4">{link.icon}</span>
                {link.text}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <button onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center justify-center gap-3 text-lg py-2.5 px-4 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 transition">
              <span className="material-icons">{logoutLoading ? 'hourglass_empty' : 'logout'}</span>
              <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login success alert */}
      {loginSuccessAlert.show && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-100 border border-green-500 text-green-800 shadow-lg rounded-lg px-6 py-3 flex items-center gap-3 animate-fade-in-down">
          <span className="material-icons text-2xl">check_circle</span>
          <span className="font-semibold">{loginSuccessAlert.message}</span>
        </div>
      )}
    </>
  );
};

export default Navbar;