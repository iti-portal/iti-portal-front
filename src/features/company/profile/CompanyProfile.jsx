import React, { useEffect, useState } from 'react';
import { TrendingUp, MapPin, Users, Calendar, Building2 } from 'lucide-react';
import { fetchCompanyProfile } from '../../../services/company-profileApi';
import Navbar from '../../../components/Layout/Navbar';

function CompanyProfile() {
  const [company, setCompany] = useState(null);

  const applicants = [
    { name: 'Sarah Chen', applied: 'Applied 2024-07-29', avatar: 'SC', status: 'new' },
    { name: 'David Lee', applied: 'Applied 2024-07-30', avatar: 'DL', status: 'reviewed' },
    { name: 'Alex Johnson', applied: 'Applied 2024-07-31', avatar: 'AJ', status: 'interviewed' },
    { name: 'Jessica Davis', applied: 'Applied 2024-08-02', avatar: 'JD', status: 'hired' },
    { name: 'John Smith', applied: 'Applied 2024-07-29', avatar: 'JS', status: 'new' },
    { name: 'María Rodriguez', applied: 'Applied 2024-07-30', avatar: 'MR', status: 'reviewed' },
    { name: 'Priya Sharma', applied: 'Applied 2024-07-31', avatar: 'PS', status: 'interviewed' },
    { name: 'Emily White', applied: 'Applied 2024-08-02', avatar: 'EW', status: 'new' },
    { name: 'Daniel Wilson', applied: 'Applied 2024-07-19', avatar: 'DW', status: 'rejected' },
    { name: 'Sophia Miller', applied: 'Applied 2024-07-18', avatar: 'SM', status: 'rejected' }
  ];

  const getStatusCounts = () => {
    const counts = { new: 0, reviewed: 0, interviewed: 0, hired: 0, rejected: 0 };
    applicants.forEach(app => counts[app.status]++);
    return counts;
  };

  const statusCounts = getStatusCounts();

  useEffect(() => {
    fetchCompanyProfile()
      .then((response) => setCompany(response.data.data))
      .catch((error) => console.error('Failed to fetch company profile:', error));
  }, []);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-700 rounded-full border-b-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderApplicants = (status, label) => (
    <div className="w-full sm:w-64 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{label}</h3>
        <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">
          {statusCounts[status]}
        </span>
      </div>
      <div className="space-y-3">
        {applicants.filter(a => a.status === status).map((app, idx) => (
          <div key={idx} className="p-3 border rounded-md bg-white shadow-sm flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-xs">
              {app.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{app.name}</p>
              <p className="text-xs text-gray-500">{app.applied}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-8"> {/* Added padding-top to account for navbar */}
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Company Info Section */}
          <div className="bg-white p-8 rounded-xl shadow">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                {company.logo ? (
                  <img src={company.logo} alt="Logo" className="object-cover w-full h-full" />
                ) : (
                  <Building2 className="text-white w-10 h-10" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="text-gray-600 mt-2 text-lg">{company.description || 'No description available.'}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-600 mt-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{company.industry || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{company.established_at?.slice(0, 10) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" stroke="none" />
                      <path d="M4 4h16v16H4z" />
                      <path d="M4 4l16 16" />
                    </svg>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    ) : (
                      <span>Website: N/A</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{company.company_size || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Hiring Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Applications', value: 450, change: '+15%' },
                { title: 'Done Interviews', value: 85, change: '+8%' },
                { title: 'Hires This Month', value: 12, change: '+200%' },
                { title: 'Rejected', value: 88, change: '+3%' }
              ].map((metric, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                    <span>{metric.title}</span>
                    <span className="flex items-center text-[#901b20]">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">Applicant Management</h2>
            <div className="flex space-x-6 overflow-x-auto pb-2">
              {renderApplicants('new', 'New')}
              {renderApplicants('reviewed', 'Reviewed')}
              {renderApplicants('interviewed', 'Interviewed')}
              {renderApplicants('hired', 'Hired')}
              {renderApplicants('rejected', 'Rejected')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CompanyProfile;