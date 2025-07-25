import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Wrench,
  CheckCircle,
  Building,
  UserCheck
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: UserCheck, label: 'Staff', path: '/staff' },
  { icon: Building, label: 'Company', path: '/company' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: FileText, label: 'Articles', path: '/articles' },
  { icon: Wrench, label: 'Services', path: '/services' },
  { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex-1">
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
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Jane Doe</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
