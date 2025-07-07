import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Admin menu items configuration
 */
const menu = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { label: 'Users', icon: 'people', path: '/admin/users' },
  { label: 'Jobs', icon: 'work', path: '/admin/jobs' },
  { label: 'Articles', icon: 'article', path: '/admin/articles' },
  { label: 'Services', icon: 'miscellaneous_services', path: '/admin/services' },
  { label: 'Staff', icon: 'check_circle', path: '/admin/staff' },
  { label: 'Contact Us', icon: 'settings', path: '/admin/contact-us' },
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

  return (
    <aside
      className={`
        h-screen bg-white border-r flex flex-col py-6 z-40
        transition-all duration-300
        w-16 md:w-56
        fixed md:static
      `}
    >
      <nav className="flex-1">
        <ul className="space-y-1">
          {menu.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center transition
                    px-2 md:px-5 py-2.5
                    ${isActive
                      ? 'bg-[#901b20] text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'}
                    justify-center md:justify-start
                  `}
                >
                  <span className="material-icons-outlined text-lg md:mr-3">
                    {item.icon}
                  </span>
                  <span className="text-base hidden md:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="w-full mt-4 px-2 md:px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-2">
          <img
            src="/avatar.png"
            alt="Admin"
            className="w-8 h-8 rounded-full border-2 border-[#901b20] object-cover"
          />
          <span className="font-semibold text-gray-800 hidden md:inline">Admin</span>
        </div>
        <button
          className="w-full flex items-center justify-center px-2 md:px-4 py-2 bg-[#901b20] text-white rounded-lg font-semibold hover:bg-[#a83236] transition"
        >
          <span className="material-icons-outlined md:mr-2">logout</span>
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
