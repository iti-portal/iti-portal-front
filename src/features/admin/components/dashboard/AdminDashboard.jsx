import React, { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, AlertTriangle, Trophy, FileText, Clock, TrendingUp, Calendar, Award, Link } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchDashboardData } from '../../../../services/analyticsApi';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "text-gray-600" }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-blue-600' ? 'bg-blue-100' : color === 'text-red-600' ? 'bg-red-100' : color === 'text-yellow-600' ? 'bg-yellow-100' : color === 'text-purple-600' ? 'bg-purple-100' : color === 'text-orange-600' ? 'bg-orange-100' : 'bg-gray-100'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <h3 className="text-xs font-medium text-slate-600">{title}</h3>
      </div>
      {trend && (
        <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <div className="text-xl font-bold text-slate-900">{value.toLocaleString()}</div>
      <div className="text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // For animated bar reveal
  const [showAltBars, setShowAltBars] = useState(false);
  const altBarData = [
    { status: 'Target', count: 8 },
    { status: 'Last week', count: 13 },
    { status: 'Last month', count: 16 },
    { status: 'Q1', count: 11 },
    { status: 'Q2', count: 18 },
    { status: 'Q3', count: 10 },
    { status: 'Q4', count: 14 },
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Error loading data: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
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
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800">📊 Platform Analytics</h1>
            <p className="text-slate-600 mt-1 text-sm">Monitor your platform's performance and user activity</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={fetchData}
              className="px-3 py-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center text-sm transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'content', label: 'Content', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
          <motion.div
            className="space-y-4 mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Modern Analytics Bar/Line Chart */}
              <motion.div
                className="bg-[#23255a] rounded-2xl border border-[#2e3163] p-6 flex flex-col justify-center shadow-md min-h-[260px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <h3 className="text-base font-bold text-white mb-6 tracking-tight">Application Status Distribution</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={applicationStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="#3b3e7a" strokeDasharray="3 3" />
                    <XAxis dataKey="status" stroke="#b6b8e3" fontSize={13} tickLine={false} axisLine={false} tick={{ dy: 8, fontWeight: 600, fill: '#b6b8e3' }} />
                    <YAxis stroke="#b6b8e3" fontSize={13} axisLine={false} tickLine={false} tick={{ fontWeight: 600, fill: '#b6b8e3' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#23255a',
                        border: '1px solid #3b3e7a',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#fff',
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)'
                      }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#38bdf8' }}
                      cursor={{ fill: '#38bdf8', opacity: 0.08 }}
                    />
                    <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={28} fill="url(#barGradient)" />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.95} />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Modern Analytics Donut Chart */}
              <motion.div
                className="bg-[#23255a] rounded-2xl border border-[#2e3163] p-6 flex flex-col justify-center shadow-md min-h-[260px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <h3 className="text-base font-bold text-white mb-6 tracking-tight">Job Status Overview</h3>
                <div className="relative w-full h-[160px]">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={jobStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        innerRadius={38}
                        dataKey="count"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        label={false}
                      >
                        {jobStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#donutGradient${index})`} />
                        ))}
                      </Pie>
                      <defs>
                        {jobStatusData.map((entry, idx) => (
                          <linearGradient key={idx} id={`donutGradient${idx}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={
                              entry.status === 'Active' ? '#38bdf8' :
                              entry.status === 'Closed' ? '#a78bfa' : '#fbbf24'
                            } stopOpacity={0.9} />
                            <stop offset="100%" stopColor={
                              entry.status === 'Active' ? '#6366f1' :
                              entry.status === 'Closed' ? '#f472b6' : '#fde68a'
                            } stopOpacity={0.9} />
                          </linearGradient>
                        ))}
                      </defs>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold text-white">
                      {(() => {
                        const total = jobStatusData.reduce((sum, j) => sum + j.count, 0);
                        const max = Math.max(...jobStatusData.map(j => j.count));
                        const idx = jobStatusData.findIndex(j => j.count === max);
                        const percent = ((max / total) * 100).toFixed(0);
                        return `${percent}%`;
                      })()}
                    </div>
                    <div className="text-sm text-blue-200 font-semibold">
                      {(() => {
                        const max = Math.max(...jobStatusData.map(j => j.count));
                        const idx = jobStatusData.findIndex(j => j.count === max);
                        return jobStatusData[idx]?.status || '';
                      })()}
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  {jobStatusData.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ background: `linear-gradient(90deg, ${entry.status === 'Active' ? '#38bdf8' : entry.status === 'Closed' ? '#a78bfa' : '#fbbf24'}, ${entry.status === 'Active' ? '#6366f1' : entry.status === 'Closed' ? '#f472b6' : '#fde68a'})` }}></span>
                      <span className="text-white text-xs font-medium">{entry.status}: {((entry.count / jobStatusData.reduce((sum, j) => sum + j.count, 0)) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Top Jobs by Applications</h3>
              <div className="divide-y divide-slate-100">
                {data.extra.top_jobs_by_applications.map((job, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-1 group hover:bg-orange-50 transition rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-orange-200 to-red-200 text-orange-600 font-semibold text-xs shadow-sm">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-800 text-sm group-hover:text-red-600 transition-colors">{job.job_title}</span>
                    </div>
                    <span className="text-slate-500 font-semibold text-sm group-hover:text-red-600 transition-colors">{job.applications} applications</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Modern Analytics User Status Pie Chart */}
              <div className="bg-[#23255a] rounded-2xl border border-[#2e3163] p-6 flex flex-col justify-center shadow-md min-h-[260px] relative">
                <h3 className="text-base font-bold text-white mb-6 tracking-tight">User Status Distribution</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={userStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={38}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      label={false}
                    >
                      {userStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#userPieGradient${index})`} />
                      ))}
                    </Pie>
                    <defs>
                      {userStatusData.map((entry, idx) => (
                        <linearGradient key={idx} id={`userPieGradient${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={
                            entry.name === 'Approved' ? '#38bdf8' :
                            entry.name === 'Pending' ? '#fbbf24' :
                            entry.name === 'Rejected' ? '#ef4444' : '#a78bfa'
                          } stopOpacity={0.9} />
                          <stop offset="100%" stopColor={
                            entry.name === 'Approved' ? '#6366f1' :
                            entry.name === 'Pending' ? '#fde68a' :
                            entry.name === 'Rejected' ? '#f472b6' : '#818cf8'
                          } stopOpacity={0.9} />
                        </linearGradient>
                      ))}
                    </defs>
                  </PieChart>
                  {/* Center label */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-2xl font-bold text-white">
                      {(() => {
                        const total = userStatusData.reduce((sum, j) => sum + j.value, 0);
                        const max = Math.max(...userStatusData.map(j => j.value));
                        const idx = userStatusData.findIndex(j => j.value === max);
                        const percent = ((max / total) * 100).toFixed(0);
                        return `${percent}%`;
                      })()}
                    </div>
                    <div className="text-sm text-blue-200 font-semibold">
                      {(() => {
                        const max = Math.max(...userStatusData.map(j => j.value));
                        const idx = userStatusData.findIndex(j => j.value === max);
                        return userStatusData[idx]?.name || '';
                      })()}
                    </div>
                  </div>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  {userStatusData.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ background: `linear-gradient(90deg, ${entry.name === 'Approved' ? '#38bdf8' : entry.name === 'Pending' ? '#fbbf24' : entry.name === 'Rejected' ? '#ef4444' : '#a78bfa'}, ${entry.name === 'Approved' ? '#6366f1' : entry.name === 'Pending' ? '#fde68a' : entry.name === 'Rejected' ? '#f472b6' : '#818cf8'})` }}></span>
                      <span className="text-white text-xs font-medium">{entry.name}: {((entry.value / userStatusData.reduce((sum, j) => sum + j.value, 0)) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modern Analytics User Roles Bar Chart */}
              <div className="bg-[#23255a] rounded-2xl border border-[#2e3163] p-6 flex flex-col justify-center shadow-md min-h-[260px]">
                <h3 className="text-base font-bold text-white mb-6 tracking-tight">User Roles</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data.users.users_by_role} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="role" stroke="#cbd5e1" fontSize={13} tickLine={false} axisLine={false} tick={{ dy: 8, fontWeight: 500, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '12px',
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)'
                      }}
                      cursor={{ fill: '#fee2e2', opacity: 0.2 }}
                    />
                    <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={28} fill="url(#userBarGradient)" />
                    <defs>
                      <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.95} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Most Posted Job Titles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.extra.top_posted_job_titles.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-900 text-sm">{job.title}</span>
                    <span className="text-red-600 font-semibold text-sm">{job.count} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Content Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-900 text-sm">Articles</span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">{data.content.total_articles}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-slate-900 text-sm">Projects</span>
                    </div>
                    <span className="text-green-600 font-semibold text-sm">{data.content.total_projects}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-slate-900 text-sm">Achievements</span>
                    </div>
                    <span className="text-yellow-600 font-semibold text-sm">{data.content.total_achievements}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-slate-900 text-sm">Certificates</span>
                    </div>
                    <span className="text-purple-600 font-semibold text-sm">{data.content.total_certificates}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;