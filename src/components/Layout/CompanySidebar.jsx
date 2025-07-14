import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  List,
  Users,
  LogOut,
} from 'lucide-react';

const sidebarItems = [
  { icon: Briefcase, label: 'Post Job', path: '/company/dashboard/post-job' },
  { icon: List, label: 'Manage Jobs', path: '/company/dashboard/manage-jobs'  , 
    matchPaths: [
      '/company/dashboard/manage-jobs',
      '/company/dashboard/manage-jobs/:id' 
    ] },
  { icon: Users, label: 'Manage Applicants', path: '/company/dashboard/applicants' },
];

const CompanySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [companyName, setCompanyName] = useState('Company');
  const [profilePicUrl, setProfilePicUrl] = useState('/avatar.png');

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const profileUrl = `${process.env.REACT_APP_API_URL}/companies/my-profile`;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found, cannot fetch company profile.");
          return;
        }

        const response = await axios.get(profileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.success && response.data.data) {
          const profileData = response.data.data;
          
          setCompanyName(profileData.company_name);

          // This logic correctly handles the 'company-logos/' sub-directory path
          if (profileData.logo) { 
            const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
            const fullPicUrl = `${baseUrl}/storage/${profileData.logo}`; 
            setProfilePicUrl(fullPicUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch company profile:', error);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleLogout = async () => {
    const logoutUrl = `${process.env.REACT_APP_API_URL}/auth/logout`;
    try {
      const token = localStorage.getItem('token');
      await axios.post(logoutUrl, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <aside
      className={`
        min-h-screen bg-white/95 backdrop-blur-sm border-r border-slate-200/50 flex flex-col py-4
        transition-all duration-300 shadow-lg
        w-64 fixed top-0 left-0 z-20
      `}
    >
      <nav className="flex-1 px-1 pt-14">
        <ul className="space-y-1">
          {sidebarItems.map(item => {
            const { pathname } = location;
            let isActive = false;
            
            if (item.path === '/company/dashboard/post-job') {
              isActive = (pathname === item.path || pathname === '/company/dashboard');
            } else {
              isActive = pathname.startsWith(item.path);
            }

            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center transition-all duration-200
                    px-4 py-3 mx-1 rounded-lg
                    ${isActive
                      ? 'bg-gradient-to-r from-red-900 to-red-700 text-white font-semibold shadow-md'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <Icon size={18} className="mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="w-full mt-4 px-4">
        <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-lg">
          <img
            src={profilePicUrl}
            alt={companyName}
            className="w-10 h-10 rounded-full border-2 border-red-500 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/avatar.png'; }}
          />
          <div>
            <span className="font-semibold text-slate-800 block text-sm">{companyName}</span>
            <span className="text-xs text-slate-500">Company</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <LogOut className="mr-2" size={18} />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;