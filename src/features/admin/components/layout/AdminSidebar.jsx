import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';

/**
 * Admin menu items configuration
 */
const menu = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { label: 'Users', icon: 'people', path: '/admin/users' },
  { label: 'Approvals', icon: 'work', path: '/admin/approvals' },
  { label: 'Articles', icon: 'article', path: '/admin/articles' },
  { label: 'Jobs', icon: 'work', path: '/admin/jobs' },
  { label: 'Services', icon: 'miscellaneous_services', path: '/admin/services' },
  { label: 'Staff', icon: 'check_circle', path: '/admin/staff' },
  {label: 'Company', icon: 'business', path: '/admin/companies' },
  { label: 'Contact Us', icon: 'settings', path: '/admin/contact-us' },
  { label: 'Applications', icon: 'check_circle', path: '/admin/applications' },
];

/**
 * AdminSidebar component for admin navigation
 * @param {Object} props Component props
 * @param {boolean} props.open Whether sidebar is open (mobile view)
 * @param {Function} props.setOpen Function to set sidebar open state
 * @returns {React.ReactElement} Sidebar component
 */
const AdminSidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter out Staff tab for staff users
  const filteredMenu = user?.role === 'staff'
    ? menu.filter(item => item.label !== 'Staff')
    : menu;

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    // Construct the full API URL from the environment variable
    const logoutUrl = `${process.env.REACT_APP_API_URL}/auth/logout`;

    try {
      // Get the authentication token from storage (assuming it's in localStorage)
      const token = localStorage.getItem('token');

      // Make a POST request to the logout endpoint
      // We send the token in the headers so the backend can invalidate it
      await axios.post(logoutUrl, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    } catch (error) {
      // Log the error but proceed with client-side logout anyway
      console.error('Logout API call failed:', error);
    } finally {
      // Always perform client-side cleanup and redirection
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Redirect to the login page (assuming '/login' is your login route)
      navigate('/login');
    }
  };


  return (
    <aside
      className={`
        min-h-screen bg-white/95 backdrop-blur-sm border-r border-slate-200/50 flex flex-col py-4 z-40
        transition-all duration-300 shadow-lg
        w-64
      `}
    >
      <nav className="flex-1 px-1">
        <ul className="space-y-1">
          {filteredMenu.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center transition-all duration-200
                    px-4 py-3 mx-1 rounded-lg
                    ${isActive
                      ? 'bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold shadow-md'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <span className="material-icons-outlined text-lg mr-3">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="w-full mt-4 px-4">
        <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-lg">
          <img
            src="/avatar.png"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-red-500 object-cover"
          />
          <div>
            <span className="font-semibold text-slate-800 block text-sm">
              {user?.role === 'staff' ? 'Staff' : 'Admin'}
            </span>
            <span className="text-xs text-slate-500">
              {user?.role === 'staff' ? 'Staff Member' : 'Administrator'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout} // Added onClick handler to trigger logout
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span className="material-icons-outlined mr-2 text-lg">logout</span>
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;