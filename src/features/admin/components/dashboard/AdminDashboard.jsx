import React from 'react';
import useDashboard from '../../hooks/useDashboard';
import { formatNumber } from '../../utils/adminHelpers';

/**
 * Stat card component for dashboard metrics
 */
const StatCard = ({ title, value, icon, color = 'bg-[#901b20]' }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className={`${color} text-white rounded-full p-3`}>
      <span className="material-icons">{icon}</span>
    </div>
  </div>
);

/**
 * AdminDashboard component shows overview of admin functionality
 * @returns {React.ReactElement} Dashboard UI component
 */
const AdminDashboard = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#901b20] mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={formatNumber(stats?.totalUsers || 0)} 
          icon="people" 
        />
        <StatCard 
          title="New Users (Last 30 Days)" 
          value={formatNumber(stats?.newUsers || 0)} 
          icon="person_add"
          color="bg-green-500" 
        />
        <StatCard 
          title="Active Users" 
          value={formatNumber(stats?.activeUsers || 0)} 
          icon="check_circle" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Jobs" 
          value={formatNumber(stats?.totalJobs || 0)} 
          icon="work"
          color="bg-purple-500" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={formatNumber(stats?.pendingApprovals || 0)} 
          icon="pending_actions"
          color="bg-amber-500" 
        />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#901b20] text-white rounded-md hover:bg-[#a83236] transition">
            <span className="material-icons text-sm mr-1 align-middle">person_add</span>
            Add User
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            <span className="material-icons text-sm mr-1 align-middle">work</span>
            Approve Jobs
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            <span className="material-icons text-sm mr-1 align-middle">assessment</span>
            Generate Reports
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
            <span className="material-icons text-sm mr-1 align-middle">campaign</span>
            Send Announcement
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, user: 'Ahmed Mohamed', action: 'Created a new job posting', time: '10 minutes ago' },
                { id: 2, user: 'Sara Ahmed', action: 'Updated profile information', time: '2 hours ago' },
                { id: 3, user: 'Omar Khaled', action: 'Applied for a job', time: '5 hours ago' },
                { id: 4, user: 'Nada Ibrahim', action: 'Posted a new article', time: '1 day ago' },
                { id: 5, user: 'Mahmoud Ali', action: 'Requested approval for event', time: '2 days ago' },
              ].map(activity => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-[#901b20] hover:text-[#a83236] font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
