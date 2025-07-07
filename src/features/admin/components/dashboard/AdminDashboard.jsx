import React, { useState } from 'react';
import { Users, Briefcase, AlertTriangle, Trophy, FileText, Clock, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Data for charts
  const userGrowthData = [
    { month: 'Jan', newUsers: 120, activeUsers: 280 },
    { month: 'Feb', newUsers: 150, activeUsers: 290 },
    { month: 'Mar', newUsers: 180, activeUsers: 300 },
    { month: 'Apr', newUsers: 220, activeUsers: 310 },
    { month: 'May', newUsers: 280, activeUsers: 320 },
    { month: 'Jun', newUsers: 310, activeUsers: 330 },
    { month: 'Jul', newUsers: 340, activeUsers: 340 }
  ];

  const jobApplicationData = [
    { month: 'Jan', applications: 320, hires: 45 },
    { month: 'Feb', applications: 380, hires: 52 },
    { month: 'Mar', applications: 420, hires: 58 },
    { month: 'Apr', applications: 450, hires: 62 },
    { month: 'May', applications: 490, hires: 68 },
    { month: 'Jun', applications: 520, hires: 75 },
    { month: 'Jul', applications: 580, hires: 82 }
  ];

  const userTypeData = [
    { name: 'Students', value: 1200, color: '#901b20' },
    { name: 'Alumni', value: 850, color: '#3b82f6' },
    { name: 'Staff', value: 250, color: '#10b981' },
    { name: 'Companies', value: 150, color: '#f59e0b' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "text-gray-600" }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-blue-600' ? 'bg-blue-100' : color === 'text-red-600' ? 'bg-red-100' : color === 'text-yellow-600' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-[#901b20] bg-opacity-10 text-[#901b20]'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
      </div>
      <button className="mt-4 text-[#901b20] text-sm font-medium hover:opacity-75 flex items-center">
        View Details
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Platform Analytics
            </h1>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#901b20] text-[#901b20]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={2450}
                subtitle="<span class='font-semibold'>+20%</span> increase from last month"
                icon={Users}
                trend={20}
                color="text-blue-600"
              />
              <StatCard
                title="Active Jobs Posted"
                value={185}
                subtitle="<span class='font-semibold'>15 new jobs</span> this week"
                icon={Briefcase}
                trend={8}
                color="text-green-600"
              />
              <StatCard
                title="Pending Content Reports"
                value={12}
                subtitle="<span class='font-semibold'>Review needed</span> for urgent items"
                icon={AlertTriangle}
                trend={-15}
                color="text-red-600"
              />
              <StatCard
                title="New Achievements"
                value={320}
                subtitle="Avg. <span class='font-semibold'>10 achievements</span> per day"
                icon={Trophy}
                trend={12}
                color="text-yellow-600"
              />
              <StatCard
                title="Total Articles"
                value={45}
                subtitle="<span class='font-semibold'>5 new articles</span> published"
                icon={FileText}
                trend={25}
                color="text-blue-600"
              />
              <StatCard
                title="Proposals Under Review"
                value={5}
                subtitle="<span class='font-semibold'>Key decisions</span> pending"
                icon={Clock}
                trend={-20}
                color="text-yellow-600"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-5 h-5 text-[#901b20] mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">User Growth Over Time</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Monthly trends for new and active users.</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="newUsers" 
                      stroke="#901b20" 
                      strokeWidth={3}
                      dot={{ fill: '#901b20', strokeWidth: 2, r: 6 }}
                      name="New Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#901b20] rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">New Users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Active Users</span>
                  </div>
                </div>
              </div>

              {/* Job Applications Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <Briefcase className="w-5 h-5 text-[#901b20] mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Job Applications & Hires</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Monthly overview of job applications and successful hires.</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobApplicationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#901b20" radius={[4, 4, 0, 0]} name="Applications" />
                    <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#901b20] rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Applications</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Hires</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Daily Active Users</span>
                  <span className="font-semibold">1,847</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Weekly Active Users</span>
                  <span className="font-semibold">2,156</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">New Registrations (30d)</span>
                  <span className="font-semibold">486</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Churn Rate</span>
                  <span className="font-semibold text-[#901b20]">2.3%</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;