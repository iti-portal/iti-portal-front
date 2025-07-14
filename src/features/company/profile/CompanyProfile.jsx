
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Users, Calendar, Building2, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchCompanyProfile, fetchCompanyStatistics } from '../../../services/company-profileApi';
import Navbar from '../../../components/Layout/Navbar';

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: 'easeOut', delay }}
    className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6"
  >
    {children}
  </motion.div>
);

const AnimatedCard = ({ children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-all duration-300"
    >
      {children}
    </motion.div>
);

function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderApplicants = (status, label, color) => {
    if (!stats?.applications_by_status) return null;
    
    const applications = stats.applications_by_status[status] || [];
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full sm:w-72 shrink-0"
      >
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg backdrop-blur-sm" style={{ backgroundColor: `${color}20` }}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <h3 className="font-semibold text-gray-800 text-lg">{label}</h3>
          </div>
          <span className="bg-white/80 text-sm px-3 py-1 rounded-full font-medium backdrop-blur-sm" style={{ color: color }}>
            {stats.applications_by_status_count[status] || 0}
          </span>
        </div>
        <div className="space-y-3">
          {applications.map((app, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 hover:shadow-md hover:bg-white/90 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                {app.profile_picture ? (
                  <img 
                    src={app.profile_picture} 
                    alt={app.applicant_name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm border-2 border-white/50">
                    {app.applicant_name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base truncate">{app.applicant_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(app.applied_at)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden pb-16">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        
        <main className="container mx-auto px-4 py-10 relative z-10">
          
          {/* Company Info Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#203947] to-[#901b20]"
          >
            <div className="p-6 pt-8 flex flex-col md:flex-row items-center gap-6 text-white">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 120 }}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/80 shadow-xl flex items-center justify-center bg-white"
              >
                {company.logo ? (
                  <img src={company.logo} alt="Logo" className="object-contain w-24 h-24 rounded-full" />
                ) : (
                  <Building2 className="w-14 h-14 text-[#901b20]" />
                )}
              </motion.div>
              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold">{company.company_name}</h1>
                <p className="text-red-100/80 text-lg mt-1">{company.industry || 'Industry not specified'}</p>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-6">

            {/* About Company Section */}
            <AnimatedSection title="About Company" icon={<Building2 className="w-6 h-6 text-gray-500" />}>
              <p className="text-gray-700 leading-relaxed mb-6">
                {company.description || 'No description available.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3"><Calendar size={18} className="text-gray-400 mt-1 flex-shrink-0" /><p className="text-gray-800">Founded on {formatDate(company.established_at)}</p></div>
                <div className="flex items-start gap-3"><Users size={18} className="text-gray-400 mt-1 flex-shrink-0" /><p className="text-gray-800">{company.company_size || 'N/A'} employees</p></div>
                <div className="flex items-start gap-3"><MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" /><p className="text-gray-800">{company.location || 'N/A'}</p></div>
                {company.website && <div className="flex items-start gap-3"><Globe size={18} className="text-gray-400 mt-1 flex-shrink-0" /><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Website</a></div>}
              </div>
            </AnimatedSection>
            
            {/* Hiring Statistics Section */}
            {stats && (
              <AnimatedSection title="Hiring Statistics" icon={<TrendingUp className="w-6 h-6 text-gray-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      title: 'Total Jobs Posted', 
                      value: stats.total_jobs_posted, 
                      change: stats.monthly_comparisons.previous_jobs > 0 ? 
                        ((stats.monthly_comparisons.current_jobs - stats.monthly_comparisons.previous_jobs) / stats.monthly_comparisons.previous_jobs * 100) : 100,
                      icon: <TrendingUp className="w-5 h-5" />
                    },
                    { 
                      title: 'Active Jobs', 
                      value: stats.active_jobs, 
                      change: 0,
                      icon: <Users className="w-5 h-5" />
                    },
                    { 
                      title: 'Applications This Month', 
                      value: stats.monthly_comparisons.current_applications, 
                      change: stats.monthly_comparisons.previous_applications > 0 ? 
                        ((stats.monthly_comparisons.current_applications - stats.monthly_comparisons.previous_applications) / stats.monthly_comparisons.previous_applications * 100) : 100,
                      icon: <ArrowUp className="w-5 h-5" />
                    },
                    { 
                      title: 'Hired This Month', 
                      value: stats.monthly_comparisons.current_hired, 
                      change: stats.monthly_comparisons.previous_hired > 0 ? 
                        ((stats.monthly_comparisons.current_hired - stats.monthly_comparisons.previous_hired) / stats.monthly_comparisons.previous_hired * 100) : 100,
                      icon: <ArrowUp className="w-5 h-5" />
                    }
                  ].map((metric, i) => (
                    <AnimatedCard key={i} delay={0.1 + i * 0.1}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                            <div className={`flex items-center text-xs font-bold ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metric.change !== 0 && (
                                <>
                                  {metric.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                  <span>{Math.abs(metric.change).toFixed(0)}%</span>
                                </>
                              )}
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Applicant Pipeline Section */}
            {stats && (
              <AnimatedSection title="Applicant Pipeline" icon={<Users className="w-6 h-6 text-gray-500" />}>
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-600">
                      Total Applicants: {Object.values(stats.applications_by_status_count).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                <div className="flex space-x-6 overflow-x-auto pb-4 px-1">
                  {renderApplicants('applied', 'Applied', '#3B82F6')}
                  {renderApplicants('reviewed', 'Reviewed', '#8B5CF6')}
                  {renderApplicants('interviewed', 'Interviewed', '#F59E0B')}
                  {renderApplicants('hired', 'Hired', '#10B981')}
                  {renderApplicants('rejected', 'Rejected', '#EF4444')}
                </div>
              </AnimatedSection>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

export default CompanyProfile;
