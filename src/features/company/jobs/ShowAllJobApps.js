import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import getAllJobApplications from './GetJobApps';
import getJobdetails from './GetJobDetails';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios'; 
import {
  Briefcase,
  Clock,
  DollarSign,
  CalendarDays,
  Calendar,
  Users,
  Award,
  Zap,
  MapPin,
  Loader2,
  AlertCircle,
  Bookmark,
  Phone,
  Mail,
  ChevronRight,
  BadgeCheck,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Edit,
  ChevronLeft,
  Filter,
  Search
} from 'lucide-react';

const MySwal = withReactContent(Swal);
const token = localStorage.getItem("token");

const useLazyLoad = ({ triggerOnce = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const observerCallback = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (triggerOnce && elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    }
  }, [triggerOnce]);

  const observer = useRef(
    new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    })
  ).current;

  useEffect(() => {
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, observer]);

  return [isVisible, elementRef];
};

const ApplicationCard = ({ app, onClick, onEdit }) => {
    const navigate = useNavigate();
  const [isVisible, cardRef] = useLazyLoad({ triggerOnce: true });

  return (
    <div 
      ref={cardRef}
      className="relative bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-all"
    >
      {isVisible ? (
        <>


          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center text-red-600 overflow-hidden">
                {app.user?.profile?.profile_picture ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${app.user.profile.profile_picture}`}
                    alt={`${app.user.profile.first_name} ${app.user.profile.last_name}`}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {app.user?.profile?.first_name?.charAt(0)}{app.user?.profile?.last_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {app.user?.profile?.first_name} {app.user?.profile?.last_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.user?.profile?.track}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600 truncate">{app.user?.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">
                  {app.user?.profile?.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">TOP SKILLS</h4>
              <div className="flex flex-wrap gap-2">
                {app.user?.skills?.slice(0, 3).map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className={`px-2 py-1 rounded-full ${
                app.status === 'reviewed' ? 'bg-blue-50 text-blue-600' :
                app.status === 'hired' ? 'bg-green-50 text-green-600' :
                app.status === 'interviewed' ? 'bg-orange-50 text-orange-700' :
                'bg-red-50 text-red-600'
              }`}>
                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
              </span>
              <span>
                Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-3 border-t border-gray-100  rounded-b-lg">
            <button
              onClick={() => navigate(`/company/dashboard/manage-jobs/${app.job_id}/applications/${app.id}`)}
              className="w-full flex items-center justify-center gap-1 p-4 rounded text-white font-medium text-sm bg-red-700"
            >
              View Application <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

const AllJobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    applications_this_week: 0,
    applications_this_month: 0,
    status_breakdown: {}
  });
  const token = localStorage.getItem("token");

  useEffect(() => {// Update your fetchStats function to handle the response structure correctly
const fetchStats = async () => {
  try {
    console.log("id-------------: ", id);
    const response = await axios.get(
      `http://localhost:8000/api/jobs/${id}/applications/stats`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    // Access the data from the response.data.data property
    setStats(response.data.data || {
      total: 0,
      applications_this_week: 0,
      applications_this_month: 0,
      status_breakdown: {}
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    setStats({
      total: 0,
      applications_this_week: 0,
      applications_this_month: 0,
      status_breakdown: {}
    });
  }
};

    fetchStats();
  }, [id, token]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobData, appsData] = await Promise.all([
          getJobdetails(id),
          getAllJobApplications(id)
        ]);
        
        setJob(jobData?.data || null);
        setApps(Array.isArray(appsData?.data) ? appsData.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApplicationClick = (application) => {
    MySwal.fire({
      title: <strong>{application.user?.profile?.first_name}'s Application</strong>,
      html: (
        <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center text-red-600 overflow-hidden">
              {application.user?.profile?.profile_picture ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${application.user.profile.profile_picture}`}
                  alt={`${application.user.profile.first_name} ${application.user.profile.last_name}`}
                  className="rounded-full w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = `
                      <span class="text-xl font-medium">
                        ${application.user?.profile?.first_name?.charAt(0) || ''}
                        ${application.user?.profile?.last_name?.charAt(0) || ''}
                      </span>
                    `;
                  }}
                />
              ) : (
                <span className="text-xl font-medium">
                  ${application.user?.profile?.first_name?.charAt(0) || ''}
                  ${application.user?.profile?.last_name?.charAt(0) || ''}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {application.user?.profile?.first_name} {application.user?.profile?.last_name}
              </h3>
              <p className="text-gray-600">{application.user?.profile?.track}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  application.status === 'reviewed' ? 'bg-blue-50 text-blue-600' :
                  application.status === 'hired' ? 'bg-green-50 text-green-600' :
                  application.status === 'interviewed' ? 'bg-orange-50 text-orange-700' :
                  'bg-red-50 text-red-600'
                }`}>
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  Applied {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">APPLICATION DETAILS</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Application ID</p>
                <p className="text-sm font-medium">{application.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied Date</p>
                <p className="text-sm font-medium">
                  {application.applied_at ? new Date(application.applied_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {application.cover_letter && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">COVER LETTER</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">{application.cover_letter}</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">CONTACT INFORMATION</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-600">{application.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-gray-600">
                    {application.user?.profile?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              {application.user?.profile?.whatsapp && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-gray-600">{application.user.profile.whatsapp}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">SKILLS</h4>
            <div className="flex flex-wrap gap-2">
              {application.user?.skills?.map(skill => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {application.user?.educations?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">EDUCATION</h4>
              {application.user.educations.map(edu => (
                <div key={edu.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{edu.institution}</p>
                      <p className="text-xs text-gray-600">{edu.degree} in {edu.field_of_study}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(edu.start_date).getFullYear()} - {new Date(edu.end_date).getFullYear()}
                      </p>
                      {edu.description && (
                        <p className="text-xs text-gray-500 mt-1">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {application.cv_path ? (
            <div className="mt-4">  
              <iframe src={application.cv_path} width="100%" height="500px" title="CV Preview"></iframe>
            </div>
          ) : (
            <div className="mt-4">  
              <div>Applicant CV not found</div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">LINKS</h4>
            <div className="flex flex-wrap gap-2">
              {application.user?.profile?.linkedin && (
                <a 
                  href={application.user.profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  <Linkedin className="w-3 h-3 mr-1" /> LinkedIn
                </a>
              )}
              {application.user?.profile?.github && (
                <a 
                  href={application.user.profile.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full"
                >
                  <Github className="w-3 h-3 mr-1" /> GitHub
                </a>
              )}
              {application.user?.profile?.portfolio_url && (
                <a 
                  href={application.user.profile.portfolio_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  <Globe className="w-3 h-3 mr-1" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: '800px',
      padding: '1.5rem',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        title: 'text-2xl font-bold text-gray-800 mb-4',
        htmlContainer: 'text-left',
        closeButton: 'text-gray-400 hover:text-gray-600'
      }
    });
  };

  const handleEditApplication = (e, application) => {
    e.stopPropagation();
    console.log('Edit application:', application);
  };

  const filteredApplications = apps.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const name = `${app.user?.profile?.first_name || ''} ${app.user?.profile?.last_name || ''}`.toLowerCase();
      
      if (!name.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
        <p className="text-gray-600 text-lg">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <Bookmark className="h-10 w-10 text-gray-400" />
          <p className="text-gray-600">No job found with this ID</p>
        </div>
      </div>
    );
  }

  return (
<div className="w-full mx-auto p-1">
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-800">
      Applications for <span className="text-red-600">{job.title}</span>
    </h1>
    <div className="w-24"></div> 
  </div>

  <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 p-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">Total Applications</h3>
            <p className="text-gray-600 font-medium">{apps.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">Job Type</h3>
            <p className="text-gray-600">{job.job_type?.replace('_', ' ') || ''}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Award className="w-5 h-5 mr-2 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">Experience Level</h3>
            <p className="text-gray-600">
              {job.experience_level?.charAt(0).toUpperCase() + job.experience_level?.slice(1) || ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">Deadline</h3>
            <p className="text-gray-600">
              {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Section - Only show if stats are loaded */}
    {stats && (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Job Application Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Total Applications</h3>
                <p className="text-gray-600 font-medium text-xl">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">This Week</h3>
                <p className="text-gray-600 font-medium text-xl">{stats.applications_this_week}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">This Month</h3>
                <p className="text-gray-600 font-medium text-xl">{stats.applications_this_month}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Breakdown Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-red-600" />
            Status Breakdown
          </h3>
          <div className="space-y-3">
            {stats.status_breakdown && Object.entries(stats.status_breakdown).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                  <span className="capitalize text-gray-600">{status}:</span>
                </div>
                <span className="font-medium text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500" />
          </div>
          <select
            className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  {filteredApplications.length === 0 ? (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
      <Users className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
      <p className="mt-1 text-gray-500">
        {filteredApplications.length === 0 && apps.length > 0 
          ? "No applications match your current filters."
          : "This job posting hasn't received any applications yet."}
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredApplications.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          onClick={handleApplicationClick}
          onEdit={handleEditApplication}
        />
      ))}
    </div>
  )}
</div>
  );
};

export default AllJobApplications;