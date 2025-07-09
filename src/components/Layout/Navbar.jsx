import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../features/auth/types/auth.types';
import Logo from '../Common/Logo';
import { getGeneralStatistics } from '../../services/statisticsService';
import Alert from '../UI/Alert';
import NotificationDropdown from '../Common/Notifications/NotificationsDropdown';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [refreshingProfile, setRefreshingProfile] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [loginSuccessAlert, setLoginSuccessAlert] = useState({ show: false, message: '' });
  const [hasShownLoginAlert, setHasShownLoginAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, refreshUserProfile, isAuthenticated } = useAuth();
  const desktopDropdownRef = useRef(null);
  const mediumDropdownRef = useRef(null);
  const smallDropdownRef = useRef(null);

  // Show welcome message after login with completion percentage (only once per session on home page)
  useEffect(() => {
    const showLoginAlert = async () => {
      // Only show on home page ('/' route)
      const isHomePage = location.pathname === '/';
      
      // Check if alert has already been shown in this session
      const alertShownKey = `loginAlert_${user?.id}_shown`;
      const hasShownInSession = sessionStorage.getItem(alertShownKey) === 'true';
      
      if (isAuthenticated && user && user.profile && !hasShownInSession && isHomePage) {
        const userName = user.profile.first_name || user.name || 'User';
        
        // Check if user is student/alumni to fetch completion percentage
        const isStudentOrAlumni = user.role === USER_ROLES.STUDENT || 
          user.role === USER_ROLES.ALUMNI || 
          user.role === 'student' || 
          user.role === 'alumni' ||
          (user.role === undefined && user.profile && (user.profile.track || user.profile.intake));

        let completionMessage = `Welcome back, ${userName}! 👋`;
        
        if (isStudentOrAlumni) {
          try {
            const response = await getGeneralStatistics();
            if (response && response.success && response.data && response.data.completion_percentage !== undefined) {
              const percentage = Math.round(response.data.completion_percentage);
              completionMessage = `Welcome back, ${userName}! 👋 Your profile is ${percentage}% complete.`;
            }
          } catch (error) {
            console.error('Failed to fetch completion percentage for login alert:', error);
          }
        }
        
        setLoginSuccessAlert({
          show: true,
          message: completionMessage
        });
        
        // Mark as shown in session storage
        sessionStorage.setItem(alertShownKey, 'true');
        setHasShownLoginAlert(true);
        
        // Auto-hide after 5 seconds (increased to give time to read percentage)
        const timer = setTimeout(() => {
          setLoginSuccessAlert({ show: false, message: '' });
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    };

    showLoginAlert();
  }, [isAuthenticated, user, location.pathname]);



  useEffect(() => {
    const fetchStatistics = async () => {
      // Check if user is authenticated and has a profile (indicating student/alumni)
      // Since role is undefined, we'll check if user has a student profile
      const isStudentOrAlumni = isAuthenticated && user && user.profile && (
        user.role === USER_ROLES.STUDENT || 
        user.role === USER_ROLES.ALUMNI || 
        user.role === 'student' || 
        user.role === 'alumni' ||
        // If role is undefined but user has student profile data, assume they're a student/alumni
        (user.role === undefined && user.profile && (user.profile.track || user.profile.intake))
      );

      if (isStudentOrAlumni) {
        try {
          const response = await getGeneralStatistics();
          
          if (response && response.success && response.data) {
            if (response.data.completion_percentage < 100 && response.data.missing_fields && response.data.missing_fields.length > 0) {
              const missingFields = response.data.missing_fields.join(', ');
              setAlert({
                show: true,
                message: `Your profile is incomplete. Please add: ${missingFields}.`,
                type: 'warning',
              });
            } else {
              setAlert({ show: false, message: '', type: 'info' });
            }
          }
        } catch (error) {
          console.error('Failed to fetch statistics:', error);
        }
      }
    };

    // Add a small delay to ensure user data is fully loaded
    if (user) {
      setTimeout(fetchStatistics, 100);
    }
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = 
        (desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target)) ||
        (mediumDropdownRef.current && mediumDropdownRef.current.contains(event.target)) ||
        (smallDropdownRef.current && smallDropdownRef.current.contains(event.target));
      
      if (!isClickInsideDropdown) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle manual profile refresh
  const handleRefreshProfile = async () => {
    try {
      setRefreshingProfile(true);
      await refreshUserProfile();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setRefreshingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const result = await logout();
      
      // Clear login alert session storage
      if (user?.id) {
        sessionStorage.removeItem(`loginAlert_${user.id}_shown`);
      }
      
      // Reset login alert state
      setHasShownLoginAlert(false);
      setLoginSuccessAlert({ show: false, message: '' });
      
      if (result.success) {
        navigate('/login');
      } else {
        // Even if logout API fails, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to login even on error
      navigate('/login');
    } finally {
      setLogoutLoading(false);
      setMenuOpen(false);
    }
  };

  // Function to determine if a path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // Handle profile paths
    if (path === '/profile') {
      return location.pathname.startsWith('/student/profile') || location.pathname.startsWith('/profile');
    }
    // Handle admin paths
    if (path === '/admin') {
      return location.pathname.startsWith('/admin');
    }
    return location.pathname.startsWith(path);
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path, isDesktop = true) => {
    const isActive = isActivePath(path);
    
    if (isDesktop) {
      return isActive 
        ? "text-[#901b20] font-semibold border-b-2 border-[#901b20] pb-1 whitespace-nowrap"
        : "text-gray-800 hover:text-[#901b20] whitespace-nowrap pb-1 border-b-2 border-transparent hover:border-[#901b20] transition-all duration-300";
    } else {
      // Mobile sidebar styles
      return isActive
        ? "text-[#901b20] font-semibold py-3 px-4 hover:bg-gray-100 border-l-4 border-[#901b20] bg-red-50"
        : "text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20] border-l-4 border-transparent";
    }
  };

  // Function to handle protected navigation
  const handleProtectedNavigation = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Login Success Alert - Floating notification */}
      {loginSuccessAlert.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-slide-down">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
            <span className="material-icons text-green-600 text-xl">check_circle</span>
            <div className="flex-1">
              <span className="font-medium text-sm">{loginSuccessAlert.message}</span>
            </div>
            <button
              onClick={() => setLoginSuccessAlert({ show: false, message: '' })}
              className="ml-2 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
            >
              <span className="material-icons text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      <header className="w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20 px-2 sm:px-4 py-2 flex items-center justify-between fixed z-50 top-0 left-0">
      {/* Logo - Always visible on left */}
      <div className="flex items-center gap-1 sm:gap-2 font-bold text-sm sm:text-base lg:text-lg text-[#901b20] flex-shrink-0">
        <Logo size="small" className="!mb-0 !mx-0 h-6 sm:h-8" />
        <span className="whitespace-nowrap">ITI Portal</span>
      </div>
        {/* Desktop Navbar Content - Only for large screens (1024px+) */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-between ml-4 xl:ml-6">
        <nav className="flex items-center gap-2 xl:gap-4 text-xs xl:text-sm font-medium">
          <Link to="/" className={getLinkClasses('/')}>Home</Link>
          {user ? (
            <>
              <Link to="/student/availablejobs" className={getLinkClasses('/jobs')}>Jobs</Link>
              <Link to="/company" className={getLinkClasses('/company')}>Company</Link>
              {user?.role === USER_ROLES.ADMIN && (
                <Link to="/admin/dashboard" className={getLinkClasses('/admin')}>Admin</Link>
              )}
              <Link to="/network" className={getLinkClasses('/network')}>Network</Link>
              <Link to="/achievements" className={getLinkClasses('/achievements')}>Achievements</Link>
              <Link to="/student/articles" className={getLinkClasses('/articles')}>Articles</Link>
            </>
          ) : (
            <>
              <Link to="/about" className="text-gray-800 hover:text-[#901b20] whitespace-nowrap pb-1 border-b-2 border-transparent hover:border-[#901b20] transition-all duration-300">About Us</Link>
              <Link to="/contact" className="text-gray-800 hover:text-[#901b20] whitespace-nowrap pb-1 border-b-2 border-transparent hover:border-[#901b20] transition-all duration-300">Contact Us</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2 xl:gap-4">
          {user ? (
            <>
              <input
                type="text"
                placeholder="Search ITI Portal..."
                className="border border-[#901b20] rounded px-2 xl:px-3 py-1 text-xs xl:text-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] w-32 xl:w-64"
              />
              <button className="bg-[#901b20] text-white px-2 xl:px-4 py-1 xl:py-2 rounded font-semibold hover:bg-[#a83236] transition text-xs xl:text-sm whitespace-nowrap">
                Post Job
              </button>
              <NotificationDropdown />
              <span className="material-icons text-gray-500 cursor-pointer text-lg xl:text-xl">settings</span>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={logoutLoading ? 'Logging out...' : 'Logout'}
              >
                {logoutLoading ? 'hourglass_empty' : 'logout'}
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-800 hover:text-[#901b20] hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-white/30 hover:border-[#901b20]/50 hover:shadow-md"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-[#901b20] to-[#a83236] text-white px-4 py-2 rounded-lg font-semibold hover:from-[#a83236] hover:to-[#901b20] transition-all duration-300 shadow-lg hover:shadow-xl border border-transparent hover:border-white/20 backdrop-blur-sm"
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="focus:outline-none"
              >            <img
                src={user?.profile?.profile_picture || "/avatar.png"}
                alt="User"
                className="w-7 h-7 xl:w-9 xl:h-9 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
              />
              </button>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="font-semibold text-gray-800 text-sm">
                    {user?.profile?.first_name && user?.profile?.last_name 
                      ? `${user.profile.first_name} ${user.profile.last_name}` 
                      : user?.name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || 'No email available'}
                  </div>
                </div>
                {alert.show && (
                  <div className="px-4 py-3 border-b border-gray-200 bg-yellow-50">
                    <Alert
                      message={alert.message}
                      type={alert.type}
                      onClose={() => setAlert({ ...alert, show: false })}
                    />
                    <Link
                      to="/student/profile/edit"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      Complete Profile →
                    </Link>
                  </div>
                )}
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    setProfileDropdownOpen(false);
                    navigate('/student/profile');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors"
                >
                  <span className="material-icons text-lg mr-3">person</span>
                  View Profile
                </button>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    setProfileDropdownOpen(false);
                    navigate('/my-achievements');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors"
                >
                  <span className="material-icons text-lg mr-3">emoji_events</span>
                  My Achievements
                </button>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    setProfileDropdownOpen(false);
                    navigate('/student/profile/edit');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors"
                >
                  <span className="material-icons text-lg mr-3">edit</span>
                  Edit Profile
                </button>
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    disabled={logoutLoading}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-icons text-lg mr-3">
                      {logoutLoading ? 'hourglass_empty' : 'logout'}
                    </span>
                    {logoutLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Medium Screen Content (768px-1024px) */}
      <div className="hidden md:flex lg:hidden items-center gap-2 flex-1 justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="border border-[#901b20] rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#901b20] w-20"
        />
        <NotificationDropdown />
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={logoutLoading ? 'Logging out...' : 'Logout'}
        >
          {logoutLoading ? 'hourglass_empty' : 'logout'}
        </button>
        <div className="relative" ref={mediumDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="focus:outline-none"
          >
            <img
              src={user?.profile?.profile_picture || "/avatar.png"}
              alt="User"
              className="w-7 h-7 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
            />
          </button>
          
          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="font-semibold text-gray-800 text-sm">
                  {user?.profile?.first_name && user?.profile?.last_name 
                    ? `${user.profile.first_name} ${user.profile.last_name}` 
                    : user?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'No email available'}
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/student/profile');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">person</span>
                View Profile
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/my-achievements');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">emoji_events</span>
                My Achievements
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/student/profile/edit');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">edit</span>
                Edit Profile
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  disabled={logoutLoading}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-icons text-lg mr-3">
                    {logoutLoading ? 'hourglass_empty' : 'logout'}
                  </span>
                  {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Small Screen Content (640px-768px) */}
      <div className="hidden sm:flex md:hidden items-center gap-2 flex-1 justify-end">
        <span className="material-icons text-gray-500 cursor-pointer text-lg">notifications_none</span>
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={logoutLoading ? 'Logging out...' : 'Logout'}
        >
          {logoutLoading ? 'hourglass_empty' : 'logout'}
        </button>
        <div className="relative" ref={smallDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="focus:outline-none"
          >
            <img
              src={user?.profile?.profile_picture || "/avatar.png"}
              alt="User"
              className="w-6 h-6 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
            />
          </button>
          
          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="font-semibold text-gray-800 text-sm">
                  {user?.profile?.first_name && user?.profile?.last_name 
                    ? `${user.profile.first_name} ${user.profile.last_name}` 
                    : user?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'No email available'}
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/student/profile');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">person</span>
                View Profile
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/my-achievements');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">emoji_events</span>
                My Achievements
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  setProfileDropdownOpen(false);
                  navigate('/student/profile/edit');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="material-icons text-lg mr-3">edit</span>
                Edit Profile
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  disabled={logoutLoading}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-icons text-lg mr-3">
                    {logoutLoading ? 'hourglass_empty' : 'logout'}
                  </span>
                  {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
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
              <Link to="/" className={getLinkClasses('/', false)} onClick={() => setMenuOpen(false)}>
                <span className="material-icons text-lg mr-3 align-middle">home</span>
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/student/profile" className={getLinkClasses('/profile', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">person</span>
                    Profile
                  </Link>
                  <Link to="/jobs" className={getLinkClasses('/jobs', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">work</span>
                    Jobs
                  </Link>
                  <Link to="/company" className={getLinkClasses('/company', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">business</span>
                    Company
                  </Link>
                  {user?.role === USER_ROLES.ADMIN && (
                    <Link to="/admin/dashboard" className={getLinkClasses('/admin', false)} onClick={() => setMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3 align-middle">admin_panel_settings</span>
                      Admin
                    </Link>
                  )}
                  <Link to="/network" className={getLinkClasses('/network', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">group</span>
                    Network
                  </Link>              <Link to="/achievements" className={getLinkClasses('/achievements', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">emoji_events</span>
                    Achievements
                  </Link>
                  <Link to="/my-achievements" className={getLinkClasses('/my-achievements', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">star</span>
                    My Achievements
                  </Link>
                  <Link to="/articles" className={getLinkClasses('/articles', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">article</span>
                    Articles
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/about" className={getLinkClasses('/about', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">info</span>
                    About Us
                  </Link>
                  <Link to="/contact" className={getLinkClasses('/contact', false)} onClick={() => setMenuOpen(false)}>
                    <span className="material-icons text-lg mr-3 align-middle">contact_mail</span>
                    Contact Us
                  </Link>
                </>
              )}
            </nav>
            
            {/* Search and Actions - Only for authenticated users */}
            {user && (
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
            )}
            
            {/* User Section - Only for authenticated users */}
            {user && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Link to="/student/profile" onClick={() => setMenuOpen(false)}>
                    <img
                      src={user?.profile?.profile_picture || "/avatar.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {user?.profile?.first_name && user?.profile?.last_name 
                        ? `${user.profile.first_name} ${user.profile.last_name}` 
                        : user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'No email available'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-around pt-2 border-t border-gray-200">
                  <NotificationDropdown />
                  <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
                    <span className="material-icons text-gray-500">settings</span>
                    <span className="text-xs text-gray-600">Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons text-gray-500">
                      {logoutLoading ? 'hourglass_empty' : 'logout'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {logoutLoading ? 'Logging out...' : 'Logout'}
                    </span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Login/Register Section - Only for unauthenticated users */}
            {!user && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition text-sm text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMenuOpen(false)}
                  className="block w-full border border-[#901b20] text-[#901b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#901b20] hover:text-white transition text-sm text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => setMenuOpen(false)}
          />
        </>
      )}
    </header>
    </>
  );
};

export default Navbar;