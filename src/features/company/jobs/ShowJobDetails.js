import { useState, useEffect } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import getAllJobApplications from './GetJobApps';
import getJobdetails from './GetJobDetails';
import { getTopApplicationsForJob } from './RecomandApps';
import DeveloperRecommendations from './DeveloperRecommanditionComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  Briefcase,
  Clock,
  DollarSign,
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
  ChevronsRight
} from 'lucide-react';

const MySwal = withReactContent(Swal);

const JobDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedApps, setRecommendedApps] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [noAppsError, setNoAppsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobData, appsData] = await Promise.all([
          getJobdetails(id),
          getAllJobApplications(id)
        ]);
        setJob(jobData?.data || null);
        
        if (!appsData?.data || appsData.data.length === 0) {
          setNoAppsError(true);
          setApps([]);
        } else {
          setNoAppsError(false);
          setApps(Array.isArray(appsData?.data) ? appsData.data : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!job || apps.length === 0) return;
      
      try {
        setRecommendationsLoading(true);
        const topApps = await getTopApplicationsForJob(id, apps, job);
        setRecommendedApps(Array.isArray(topApps) ? topApps : []);
      } catch (err) {
        console.error('Error getting recommendations:', err);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [job, apps, id]);

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
                  {application.user?.profile?.first_name?.charAt(0) || ''}
                  {application.user?.profile?.last_name?.charAt(0) || ''}
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

  const handleShowAllApplications = () => {
    navigate(`/company/dashboard/manage-jobs/${id}/applications`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
        <p className="text-gray-600 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading job details</h3>
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

  const requiredSkills = Array.isArray(job.job_skills) ? job.job_skills.filter(skill => skill.is_required) : [];
  const displayedApps = apps.slice(0, 6);


  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-red-800 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm">{job.job_type?.replace('_', ' ') || ''}</span>
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm">
                    {job.experience_level?.charAt(0).toUpperCase() + job.experience_level?.slice(1) || ''}
                  </span>
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm">{job.is_remote ? 'Remote' : 'On-site'}</span>
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide ${
              job.status === 'active' ? 'bg-green-100 text-green-800' : 
              job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-red-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Salary Range</h3>
                  <p className="text-gray-600 font-medium">
                    ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Applications</h3>
                  <p className="text-gray-600">{job.applications_count || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-red-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Posted</h3>
                  <p className="text-gray-600">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Zap className="w-5 h-5 mr-2 text-red-600" />
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map(skill => (
                  <span 
                    key={skill.skill?.id || skill.name} 
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full font-medium"
                  >
                    {skill.skill?.name || skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Bookmark className="w-5 h-5 mr-2 text-red-600" />
                Job Description
              </h2>
              <div className="text-gray-700 space-y-3">
                {job.description?.split('\n').map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

{apps.length > 0 && (
  <div className="mt-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Users className="w-6 h-6 mr-2 text-red-600" />
        All Applications ({apps.length})
      </h2>
    </div>

    <div className="relative">
      <div className="flex space-x-6 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide">
        {displayedApps.map((app) => (
          <div 
            key={app.id} 
            className="relative flex-shrink-0 w-80 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-all flex flex-col"
            style={{ minHeight: '460px' }} // Fixed height for all cards
          >
            

            {/* Candidate Profile Section */}
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

            {/* Main Content (Fixed Structure) */}
            <div className="p-5 flex-grow flex flex-col">
              {/* Contact Info */}
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

              {/* Skills Section */}
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

              {/* Status & Date (Pushed to bottom) */}
              <div className="mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
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
            </div>

            {/* Footer Button (Fixed Position) */}
          <div className="p-3 border-t border-gray-100  rounded-b-lg">
            <button
              onClick={() => navigate(`/company/dashboard/manage-jobs/${app.job_id}/applications/${app.id}`)}
              className="w-full flex items-center justify-center gap-1 p-4 rounded text-white font-medium text-sm bg-red-700"
            >
              View Application <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          </div>
        ))}

        {/* View All Card */}
        {apps.length > 6 && (
          <div className="flex-shrink-0 w-80 flex">
            <button
              onClick={handleShowAllApplications}
              className="w-full flex flex-col items-center justify-center bg-red-700 hover:bg-red-800 text-white rounded-lg p-6 transition-colors"
              style={{ minHeight: '460px' }} // Match other cards' height
            >
              <ChevronsRight className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">View All</span>
              <span className="text-sm opacity-90 mt-1">{apps.length} applications</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      {(job.status === 'active' || job.status === 'paused') && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <BadgeCheck className="w-6 h-6 mr-2 text-red-600" />
              AI Recommended Itians 
            </h2>
          </div>
          <DeveloperRecommendations jobId={id} jobData={job} />
        </div>
      )}
    </div>
  );
};

export default JobDetailsView;