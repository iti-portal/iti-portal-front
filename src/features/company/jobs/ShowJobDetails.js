import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getAllJobApplications from './GetJobApps';
import getJobdetails from './GetJobDetails';
import { getTopApplicationsForJob } from './RecomandApps';
import DeveloperRecommendations from './DeveloperRecommanditionComponent';


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
} from 'lucide-react';

const JobDetailsView = () => {
  const { id } = useParams();
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

  return (
    <div className="w-5/6 mx-auto p-6">
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
       
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-red-600" />
          All Applications ({apps.length})
        </h2>
        

        {noAppsError ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">No applications found</h3>
                <p className="text-sm text-red-700">No applications have been submitted for this job posting (Job ID: {id})</p>
              </div>
            </div>
          </div>
        ) : apps.length > 0 ? (
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide">
              {apps.map((app) => (
                <div 
                  key={app.id} 
                  className="flex-shrink-0 w-80 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center text-red-600">
                        <span className="text-sm font-medium">
                          {app.user?.profile?.first_name?.charAt(0)}{app.user?.profile?.last_name?.charAt(0)}
                        </span>
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

                  <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <button className="w-full flex items-center justify-between px-4 py-2 bg-red-700 border border-gray-200 rounded-md text-sm font-medium text-white hover:bg-red-800">
                      <span className='text-white'>View Application</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No applications received yet</p>
          </div>
        )}
      </div>)}

      <div className="mt-8">
        
        {job.status == 'active' ?
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BadgeCheck className="w-6 h-6 mr-2 text-red-600" />
            AI Recommended Itians 
          </h2>
        </div>
        : null}

      
        <DeveloperRecommendations jobId={id} jobData={job} />
      </div>
    </div>
  );
};

export default JobDetailsView;