import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  User,
  Briefcase,
  List,
  Users
} from 'lucide-react';

const sidebarItems = [
  { icon: User, label: 'My Profile', path: '/company/profile' },
  { icon: Briefcase, label: 'Post Job', path: '/company/post-job' },
  { icon: List, label: 'Manage Jobs', path: '/company/manage-jobs' },
  { icon: Users, label: 'Manage Applicants', path: '/company/applicants' },
];

const CompanySidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-[calc(100vh-56px)] fixed left-0 top-[56px] bg-white border-r border-gray-200 flex flex-col justify-between z-20">
      <div className="p-6 overflow-y-auto flex-1">
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white bg-[#901b20]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            C
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Tech Solutions</p>
            <p className="text-xs text-gray-500 truncate">Company</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySidebar;