import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
        min-h-screen bg-white/95 backdrop-blur-sm border-r border-slate-200/50 flex flex-col py-4 z-40
        transition-all duration-300 shadow-lg
        w-64
      `}
    >
      <nav className="flex-1 px-1">
        <ul className="space-y-1">
          {menu.map(item => {
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
            <span className="font-semibold text-slate-800 block text-sm">Admin</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
        </div>
        <button
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
