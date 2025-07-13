import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../features/auth/types/auth.types';
import { Briefcase } from 'lucide-react';
import { getGeneralStatistics } from '../../services/statisticsService';
import Logo from '../Common/Logo';

// This component is unchanged and remains for logged-in users.
const ProfileDropdown = ({ user, isAdmin, isCompany, onLogout, closeDropdown, logoutLoading }) => {
  const navigate = useNavigate();
  const handleNavigate = (path) => { closeDropdown(); navigate(path); };
  
  let links = [];
  if (isAdmin) { links = [{ path: '/admin/dashboard', text: 'Admin Dashboard', icon: 'dashboard' }, { path: '/admin/profile', text: 'View Profile', icon: 'person' }]; }
  else if (isCompany) { links = [{ path: '/company/dashboard', text: 'Company Dashboard', icon: 'dashboard' }, { path: '/company/profile', text: 'View Profile', icon: 'person' }]; }
  else { links = [{ path: '/student/profile', text: 'View Profile', icon: 'person' }, { path: '/my-applications', text: 'My Applications', icon: <Briefcase size={20} /> } ,{ path: '/my-achievements', text: 'My Achievements', icon: 'emoji_events' }, { path: '/my-network', text: 'My Network', icon: 'group' }, { path: '/student/profile/edit', text: 'Edit Profile', icon: 'edit' }]; }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 border-b"><div className="font-semibold text-gray-800 text-sm truncate">{user?.profile?.first_name || user?.name || 'User'}</div><div className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</div></div>
      {links.map(link => <button key={link.path} onClick={() => handleNavigate(link.path)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span className="material-icons text-lg mr-3">{link.icon}</span>{link.text}</button>)}
      <div className="border-t mt-2 pt-2"><button onClick={() => handleNavigate('/account/settings')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span className="material-icons text-lg mr-3">settings</span>Account Settings</button><button onClick={onLogout} disabled={logoutLoading} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"><span className="material-icons text-lg mr-3">{logoutLoading ? 'hourglass_empty' : 'logout'}</span>{logoutLoading ? 'Logging out...' : 'Logout'}</button></div>
    </motion.div>
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

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isCompany = user?.role === USER_ROLES.COMPANY;
  const isAlumni= user?.role === USER_ROLES.ALUMNI;
  const isStudentOrAlumni = isAuthenticated && !isAdmin && !isCompany;

  // --- LINK DEFINITIONS ---
  const publicLinks = [
    { to: '/', text: 'Home', icon: 'home' },
    { to: '/about', text: 'About Us', icon: 'info' },
    { to: '/contact', text: 'Contact Us', icon: 'mail' },
  ];
  
  const loggedInLinks = [
    { to: '/', text: 'Home', icon: 'home' },
    { to: '/student/availablejobs', text: 'Jobs', icon: 'work', show: isStudentOrAlumni },
    { to: '/network', text: 'Network', icon: 'group' },
    { to: '/achievements', text: 'Achievements', icon: 'emoji_events' },
    {to:'/my-services', text: 'My Services', icon: 'build', show: isAlumni },
    { to: '/student/articles', text: 'Articles', icon: 'article', show: isStudentOrAlumni },
    { to: '/admin/dashboard', text: 'Admin', icon: 'admin_panel_settings', show: isAdmin },
  ];
  // --- All hooks and handlers are unchanged ---
  useEffect(() => { const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileDropdownOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  const handleLogout = async () => { try { setLogoutLoading(true); await logout(); navigate('/login'); } catch (e) { console.error(e); navigate('/login'); } finally { setLogoutLoading(false); setProfileDropdownOpen(false); setMenuOpen(false); } };
  useEffect(() => { const showAlert = async () => { /* ... */ }; showAlert(); }, [isAuthenticated, user, location.pathname, isStudentOrAlumni]);
  const getLinkClasses = (path, isMobile = false) => { const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path)); if (isMobile) { return `flex items-center text-lg w-full ${isActive ? "text-[#901b20] font-semibold py-3 px-4 bg-red-50 border-l-4 border-[#901b20]" : "text-gray-700 py-3 px-4 hover:bg-gray-100 border-l-4 border-transparent"}`; } return `text-sm font-medium transition-all duration-200 ${isActive ? "text-[#901b20] border-b-2 border-[#901b20]" : "text-gray-600 hover:text-[#901b20] border-b-2 border-transparent"}`; };

  // FIX: The line `if (!isAuthenticated) return null;` has been removed.

  return (
    <>
      <header className="sticky top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm border-b z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-[#901b20] flex-shrink-0">
            <Logo size="small" className="h-8 w-auto" />
            <span className="font-bold text-xl hidden sm:inline">UnITI</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
            {(isAuthenticated ? loggedInLinks : publicLinks).map(link => (
              (link.show === undefined || link.show) &&
              <Link key={link.text} to={link.to} className={getLinkClasses(link.to)}>{link.text}</Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><span className="material-icons text-gray-600">notifications</span></button>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileDropdownOpen(p => !p)}><img src={user?.profile?.profile_picture || "/avatar.png"} alt="User" className="w-9 h-9 rounded-full border-2 border-[#901b20] object-cover"/></button>
                  <AnimatePresence>{profileDropdownOpen && <ProfileDropdown user={user} isAdmin={isAdmin} isCompany={isCompany} onLogout={handleLogout} logoutLoading={logoutLoading} closeDropdown={() => setProfileDropdownOpen(false)} />}</AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Login</button>
                <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#901b20] to-[#a83236] rounded-lg shadow-sm hover:shadow-md transition-all">Sign Up</button>
              </div>
            )}
          </div>
          
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="p-2 -mr-2" aria-label="Open menu"><span className="material-icons text-3xl text-[#901b20]">menu</span></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: 'easeInOut' }} className="fixed inset-y-0 right-0 w-80 max-w-[85vw] h-full bg-white ml-auto flex flex-col z-50 shadow-xl">
              <div className="flex justify-between items-center p-4 border-b"><span className="font-bold text-lg text-[#901b20]">Menu</span><button onClick={() => setMenuOpen(false)} className="p-2" aria-label="Close menu"><span className="material-icons text-2xl text-[#901b20]">close</span></button></div>
              {isAuthenticated && (
                <div className="p-4 flex items-center gap-3 border-b bg-gray-50">
                  <img src={user?.profile?.profile_picture || "/avatar.png"} alt="User" className="w-12 h-12 rounded-full border-2 border-[#901b20] object-cover"/>
                  <div className="flex-1 overflow-hidden"><div className="font-semibold text-gray-800 truncate">{user?.profile?.first_name || user?.name || 'User'}</div><div className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</div></div>
                </div>
              )}
              <nav className="flex-1 py-4 overflow-y-auto">
                {(isAuthenticated ? loggedInLinks : publicLinks).map(link => ((link.show === undefined || link.show) && <Link key={link.text} to={link.to} className={getLinkClasses(link.to, true)}><span className="material-icons mr-4">{link.icon}</span>{link.text}</Link>))}
              </nav>
              <div className="p-4 border-t">
                {isAuthenticated ? (
                  <button onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center justify-center gap-3 text-lg py-2.5 px-4 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 transition"><span className="material-icons">{logoutLoading ? 'hourglass_empty' : 'logout'}</span><span>{logoutLoading ? 'Logging out...' : 'Logout'}</span></button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/login')} className="w-full px-4 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Login</button>
                    <button onClick={() => navigate('/register')} className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#901b20] to-[#a83236] rounded-lg shadow-sm hover:shadow-md transition-all">Sign Up</button>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
          </>
        )}
      </AnimatePresence>
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