import React from 'react';
import { MapPin, Users, Calendar, TrendingUp, Building2 } from 'lucide-react';

function Profile() {
  const applicants = [
    { name: 'Sarah Chen', applied: 'Applied 2024-07-29', avatar: 'SC', status: 'new' },
    { name: 'David Lee', applied: 'Applied 2024-07-30', avatar: 'DL', status: 'reviewed' },
    { name: 'Alex Johnson', applied: 'Applied 2024-07-31', avatar: 'AJ', status: 'interview' },
    { name: 'Michael Brown', applied: 'Applied 2024-08-01', avatar: 'MB', status: 'offer' },
    { name: 'Jessica Davis', applied: 'Applied 2024-08-02', avatar: 'JD', status: 'hired' },
    { name: 'John Smith', applied: 'Applied 2024-07-29', avatar: 'JS', status: 'new' },
    { name: 'María Rodriguez', applied: 'Applied 2024-07-30', avatar: 'MR', status: 'reviewed' },
    { name: 'Priya Sharma', applied: 'Applied 2024-07-31', avatar: 'PS', status: 'interview' },
    { name: 'Emily White', applied: 'Applied 2024-08-02', avatar: 'EW', status: 'new' },
    { name: 'Daniel Wilson', applied: 'Applied 2024-07-19', avatar: 'DW', status: 'rejected' },
    { name: 'Sophia Miller', applied: 'Applied 2024-07-18', avatar: 'SM', status: 'rejected' }
  ];

  const getStatusCounts = () => {
    const counts = { new: 0, reviewed: 0, interview: 0, offer: 0, hired: 0, rejected: 0 };
    applicants.forEach(app => counts[app.status]++);
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">Tech Solutions Inc.</h1>
                  <button className="px-3 py-1 bg-[#901b20] text-white text-sm rounded hover:bg-[#901b20]/90">
                    Edit Profile
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    View Public Profile →
                  </button>
                </div>
                <p className="text-gray-600 max-w-2xl">
                  Tech Solutions Inc. is a leading innovator in cloud-based software development, dedicated to creating scalable and efficient solutions for enterprise clients worldwide. We are committed to fostering a culture of innovation, collaboration, and continuous learning.
                </p>
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Industry: Software Development</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded: 2010</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Employees: 250+</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location: Dubai Headquarters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Postings and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Active Job Postings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
              <button className="px-4 py-2 bg-[#901b20] text-white text-sm rounded hover:bg-[#901b20]/90">
                + Post New Job
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Senior Software Engineer</h3>
                <p className="text-sm text-gray-600 mb-2">👤 120 Applicants</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Remote</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">⏰ Posted: 3 days ago</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-[#901b20] text-white text-sm rounded hover:bg-[#901b20]/90">
                    Manage Applicants
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Marketing Specialist</h3>
                <p className="text-sm text-gray-600 mb-2">👤 78 Applicants</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>New York, USA</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">⏰ Posted: 5 days ago</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-[#901b20] text-white text-sm rounded hover:bg-[#901b20]/90">
                    Manage Applicants
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Total Applications</span>
                <span className="text-xs text-[#901b20] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% vs last month
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">450</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Interviews Scheduled</span>
                <span className="text-xs text-[#901b20] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs last month
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">85</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Hires This Month</span>
                <span className="text-xs text-[#901b20] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +200% vs last month
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Offer Acceptance Rate</span>
                <span className="text-xs text-[#901b20] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3% vs last month
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">88%</p>
            </div>
          </div>
        </div>

        {/* Applicant Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Applicant Management</h2>
          
          <div className="flex space-x-6 overflow-x-auto">
            {/* New Applicants */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">New Applicants</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.new})
                </span>
              </div>
                  <div className="space-y-3">
                {applicants.filter(app => app.status === 'new').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviewed */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">Reviewed</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.reviewed})
                </span>
              </div>
                  <div className="space-y-3">
                {applicants.filter(app => app.status === 'reviewed').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Scheduled */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">Interview Scheduled</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.interview})
                </span>
              </div>
                  <div className="space-y-3">
                {applicants.filter(app => app.status === 'interview').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer Extended */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">Offer Extended</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.offer})
                </span>
              </div>
                  <div className="space-y-3">
                {applicants.filter(app => app.status === 'offer').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hired */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">Hired</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.hired})
                </span>
              </div>
                  <div className="space-y-3">
                {applicants.filter(app => app.status === 'hired').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejected */}
            <div className="flex-shrink-0 w-64">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-medium text-gray-900">Rejected</h3>
                <span className="bg-[#901b20] text-white text-xs px-2 py-1 rounded-full">
                  ({statusCounts.rejected})
                </span>
              </div>
              <div className="space-y-3">
                {applicants.filter(app => app.status === 'rejected').map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                        <p className="text-xs text-gray-500">{applicant.applied}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Trend and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Application Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Trend</h2>
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Y-axis labels */}
                <text x="20" y="20" className="text-xs fill-gray-400">220</text>
                <text x="20" y="60" className="text-xs fill-gray-400">165</text>
                <text x="20" y="100" className="text-xs fill-gray-400">110</text>
                <text x="20" y="140" className="text-xs fill-gray-400">55</text>
                <text x="20" y="180" className="text-xs fill-gray-400">0</text>
                
                {/* X-axis labels */}
                <text x="60" y="195" className="text-xs fill-gray-400">Jan</text>
                <text x="110" y="195" className="text-xs fill-gray-400">Feb</text>
                <text x="160" y="195" className="text-xs fill-gray-400">Mar</text>
                <text x="210" y="195" className="text-xs fill-gray-400">Apr</text>
                <text x="260" y="195" className="text-xs fill-gray-400">May</text>
                <text x="310" y="195" className="text-xs fill-gray-400">Jun</text>
                <text x="360" y="195" className="text-xs fill-gray-400">Jul</text>
                
                {/* Trend line */}
                <path
                  d="M 60 120 L 110 100 L 160 110 L 210 80 L 260 70 L 310 90 L 360 60"
                  stroke="#901b20"
                  strokeWidth="2"
                  fill="none"
                />
                
                {/* Data points */}
                <circle cx="60" cy="120" r="3" fill="#901b20" />
                <circle cx="110" cy="100" r="3" fill="#901b20" />
                <circle cx="160" cy="110" r="3" fill="#901b20" />
                <circle cx="210" cy="80" r="3" fill="#901b20" />
                <circle cx="260" cy="70" r="3" fill="#901b20" />
                <circle cx="310" cy="90" r="3" fill="#901b20" />
                <circle cx="360" cy="60" r="3" fill="#901b20" />
              </svg>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#901b20] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Posted new job: Senior Full Stack Developer.</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Sarah Chen moved to Interview Scheduled for Marketing Specialist.</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Received 5 new applications for Data Analyst Intern.</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Replied to candidate query: John Smith.</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Job posting "HR Manager" reached 40 applicants.</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">Interview completed for Alex Johnson (Product Designer).</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;