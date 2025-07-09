import React, { useState, useEffect } from 'react';
import { Users, Briefcase, AlertTriangle, Trophy, FileText, Clock, TrendingUp, Calendar, Award, Link } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchDashboardData } from '../../../../services/analyticsApi';

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
        <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDashboardData();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error loading data: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const userStatusData = data.users.users_by_status.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: item.status === 'approved' ? '#10b981' : 
           item.status === 'pending' ? '#f59e0b' : 
           item.status === 'rejected' ? '#ef4444' : '#6b7280'
  }));

  const applicationStatusData = data.jobs.applications_by_status.map(item => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item.count
  }));

  const jobStatusData = data.jobs.jobs_by_status.map(item => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item.count
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-1">Monitor your platform's performance and user activity</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'content', label: 'Content', icon: FileText },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={data.users.total_users}
                subtitle={`<span class='font-semibold'>${data.users.verified_users}</span> verified users`}
                icon={Users}
                color="text-blue-600"
              />
              <StatCard
                title="Total Jobs"
                value={data.jobs.total_jobs}
                subtitle={`<span class='font-semibold'>${data.jobs.jobs_by_status.find(j => j.status === 'active')?.count || 0}</span> active jobs`}
                icon={Briefcase}
                color="text-green-600"
              />
              <StatCard
                title="Total Applications"
                value={data.jobs.total_applications}
                subtitle={`<span class='font-semibold'>${data.jobs.applications_by_status.find(a => a.status === 'hired')?.count || 0}</span> hired`}
                icon={FileText}
                color="text-purple-600"
              />
              <StatCard
                title="Total Connections"
                value={data.connections.total_connections}
                subtitle={`<span class='font-semibold'>${data.connections.connections_by_status.find(c => c.status === 'accepted')?.count || 0}</span> accepted`}
                icon={Link}
                color="text-orange-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="status" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#901b20" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.status === 'Active' ? '#10b981' : 
                          entry.status === 'Closed' ? '#ef4444' : '#f59e0b'
                        } />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Jobs by Applications</h3>
              <div className="space-y-3">
                {data.extra.top_jobs_by_applications.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#901b20] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{job.job_title}</span>
                    </div>
                    <span className="text-[#901b20] font-semibold">{job.applications} applications</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={data.users.total_users}
                subtitle="All registered users"
                icon={Users}
                color="text-blue-600"
              />
              <StatCard
                title="Verified Users"
                value={data.users.verified_users}
                subtitle="Email verified"
                icon={Users}
                color="text-green-600"
              />
              <StatCard
                title="Pending Approval"
                value={data.users.users_by_status.find(u => u.status === 'pending')?.count || 0}
                subtitle="Awaiting review"
                icon={Clock}
                color="text-yellow-600"
              />
              <StatCard
                title="Active Users"
                value={data.users.users_by_status.find(u => u.status === 'approved')?.count || 0}
                subtitle="Approved accounts"
                icon={Users}
                color="text-green-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.users.users_by_role}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="role" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#901b20" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Jobs"
                value={data.jobs.total_jobs}
                subtitle="All job postings"
                icon={Briefcase}
                color="text-blue-600"
              />
              <StatCard
                title="Active Jobs"
                value={data.jobs.jobs_by_status.find(j => j.status === 'active')?.count || 0}
                subtitle="Currently hiring"
                icon={Briefcase}
                color="text-green-600"
              />
              <StatCard
                title="Total Applications"
                value={data.jobs.total_applications}
                subtitle="All applications"
                icon={FileText}
                color="text-purple-600"
              />
              <StatCard
                title="Successful Hires"
                value={data.jobs.applications_by_status.find(a => a.status === 'hired')?.count || 0}
                subtitle="Hired candidates"
                icon={Users}
                color="text-green-600"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Posted Job Titles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.extra.top_posted_job_titles.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{job.title}</span>
                    <span className="text-[#901b20] font-semibold">{job.count} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Articles"
                value={data.content.total_articles}
                subtitle="Published articles"
                icon={FileText}
                color="text-blue-600"
              />
              <StatCard
                title="Total Projects"
                value={data.content.total_projects}
                subtitle="User projects"
                icon={Briefcase}
                color="text-green-600"
              />
              <StatCard
                title="Achievements"
                value={data.content.total_achievements}
                subtitle="User achievements"
                icon={Trophy}
                color="text-yellow-600"
              />
              <StatCard
                title="Awards"
                value={data.content.total_awards}
                subtitle="Distributed awards"
                icon={Award}
                color="text-purple-600"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Articles</span>
                    </div>
                    <span className="text-blue-600 font-semibold">{data.content.total_articles}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Projects</span>
                    </div>
                    <span className="text-green-600 font-semibold">{data.content.total_projects}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-gray-900">Achievements</span>
                    </div>
                    <span className="text-yellow-600 font-semibold">{data.content.total_achievements}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Certificates</span>
                    </div>
                    <span className="text-purple-600 font-semibold">{data.content.total_certificates}</span>
                  </div>
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