import React, { useEffect, useState } from 'react';
import { TrendingUp, MapPin, Users, Calendar, Building2, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchCompanyProfile, fetchCompanyStatistics } from '../../../services/company-profileApi';
import Navbar from '../../../components/Layout/Navbar';

function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, statsResponse] = await Promise.all([
          fetchCompanyProfile(),
          fetchCompanyStatistics()
        ]);
        setCompany(profileResponse.data.data);
        setStats(statsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-b-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderApplicants = (status, label, color) => {
    if (!stats?.applications_by_status) return null;
    
    const applications = stats.applications_by_status[status] || [];
    
    return (
      <div className="w-full sm:w-72 shrink-0">
        <div className="flex items-center justify-between mb-4 p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <h3 className="font-semibold text-gray-800 text-lg">{label}</h3>
          </div>
          <span className="bg-white text-sm px-3 py-1 rounded-full font-medium" style={{ color: color }}>
            {stats.applications_by_status_count[status] || 0}
          </span>
        </div>
        <div className="space-y-3">
          {applications.map((app, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3">
                {app.profile_picture ? (
                  <img 
                    src={app.profile_picture} 
                    alt={app.applicant_name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                    {app.applicant_name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base truncate">{app.applicant_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(app.applied_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Company Info Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start space-x-8">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                {company.logo ? (
                  <img src={company.logo} alt="Logo" className="object-cover w-full h-full" />
                ) : (
                  <Building2 className="text-white w-14 h-14" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{company.company_name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{company.description || 'No description available.'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Industry</p>
                      <p className="text-lg font-semibold text-gray-900">{company.industry || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Founded</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {company.established_at ? formatDate(company.established_at) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Website</p>
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                          Visit Website
                        </a>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Company Size</p>
                      <p className="text-lg font-semibold text-gray-900">{company.company_size || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{company.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          {stats && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Hiring Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Total Jobs Posted', 
                    value: stats.total_jobs_posted, 
                    change: stats.monthly_comparisons.previous_jobs > 0 ? 
                      ((stats.monthly_comparisons.current_jobs - stats.monthly_comparisons.previous_jobs) / stats.monthly_comparisons.previous_jobs * 100) : 100,
                    icon: <TrendingUp className="w-5 h-5" />,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-600',
                    iconColor: 'text-blue-500'
                  },
                  { 
                    title: 'Active Jobs', 
                    value: stats.active_jobs, 
                    change: 0, // No comparison data for active jobs
                    icon: <Users className="w-5 h-5" />,
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-600',
                    iconColor: 'text-purple-500'
                  },
                  { 
                    title: 'Applications Received', 
                    value: stats.monthly_comparisons.current_applications, 
                    change: stats.monthly_comparisons.previous_applications > 0 ? 
                      ((stats.monthly_comparisons.current_applications - stats.monthly_comparisons.previous_applications) / stats.monthly_comparisons.previous_applications * 100) : 100,
                    icon: <ArrowUp className="w-5 h-5" />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-600',
                    iconColor: 'text-green-500'
                  },
                  { 
                    title: 'Hired Candidates', 
                    value: stats.hired_applications, 
                    change: stats.monthly_comparisons.previous_hired > 0 ? 
                      ((stats.monthly_comparisons.current_hired - stats.monthly_comparisons.previous_hired) / stats.monthly_comparisons.previous_hired * 100) : 100,
                    icon: <ArrowUp className="w-5 h-5" />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-600',
                    iconColor: 'text-green-500'
                  }
                ].map((metric, i) => (
                  <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center ${metric.iconColor}`}>
                        {metric.icon}
                      </div>
                      <div className={`flex items-center text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change >= 0 ? (
                          <ArrowUp className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(metric.change).toFixed(0)}%
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-500">{metric.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicants */}
          {stats && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Applicant Pipeline</h2>
                <div className="text-sm text-gray-500">
                  {Object.values(stats.applications_by_status_count).reduce((a, b) => a + b, 0)} total applicants
                </div>
              </div>
              <div className="flex space-x-6 overflow-x-auto pb-4 px-1">
                {renderApplicants('applied', 'Applied', '#3B82F6')}
                {renderApplicants('reviewed', 'Reviewed', '#8B5CF6')}
                {renderApplicants('interviewed', 'Interviewed', '#F59E0B')}
                {renderApplicants('hired', 'Hired', '#10B981')}
                {renderApplicants('rejected', 'Rejected', '#EF4444')}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CompanyProfile;