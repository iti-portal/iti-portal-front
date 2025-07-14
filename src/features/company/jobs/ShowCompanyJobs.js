import React, { useState, useEffect } from 'react';
import { getCompanyJobs } from './GetCompanyJobs';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Calendar, 
  Users,
  Award,
  CircleDollarSign,
  Zap,
  Bookmark,
  MapPin,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyLayout from '../../../layouts/CompanyLayout';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingJobs, setUpdatingJobs] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const result = await getCompanyJobs();
        if (result.success) {
          setJobs(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    setUpdatingJobs(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/company/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
      setError(error.message);
    } finally {
      setUpdatingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleCloseJob = async (jobId) => {
    setUpdatingJobs(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/company/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'closed' })
      });

      if (!response.ok) {
        throw new Error('Failed to close job');
      }

      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: 'closed' } : job
        )
      );
    } catch (error) {
      console.error('Error closing job:', error);
      setError(error.message);
    } finally {
      setUpdatingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-red-700 mb-4" />
      <p className="text-gray-600 text-lg">Loading jobs...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-red-600 text-lg">Error: {error}</p>
    </div>
  );
  
  if (jobs.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Bookmark className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg">No jobs found</p>
    </div>
  );

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <Briefcase className="mr-3 w-8 h-8 text-red-700" />
        Jobs History
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onStatusChange={handleStatusChange}
            onCloseJob={handleCloseJob}
            isUpdating={updatingJobs[job.id] || false}
          />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job, onStatusChange, onCloseJob, isUpdating }) => {
  const requiredSkills = job.job_skills?.filter(skill => skill.is_required) || [];
  const navigate = useNavigate();

  const handleCloseJob = async () => {
    await onCloseJob(job.id);
  };

  return (
    

    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-xl font-bold text-red-800 line-clamp-2">{job.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            job.status === 'active' ? 'bg-green-100 text-green-800' : 
            job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
            job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-600 text-sm capitalize">
                {job.job_type?.replace('_', ' ') || 'Not specified'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Award className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-600 text-sm capitalize">
                {job.experience_level || 'Not specified'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <CircleDollarSign className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-600 text-sm">
                {job.salary_min ? `$${job.salary_min.toLocaleString()}` : 'Not specified'}
                {job.salary_max && job.salary_min ? ` - $${job.salary_max.toLocaleString()}` : ''}
              </span>
            </div>
            
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-600 text-sm">
                {job.applications_count || 0} apps
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-600 text-sm">
                {job.application_deadline ? 
                  `Apply by ${new Date(job.application_deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}` : 
                  'No deadline'}
              </span>
            </div>
          </div>
          
          {job.location && (
            <div className="grid grid-cols-1">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-600 text-sm">
                  {job.location}
                </span>
              </div>
            </div>
          )}
        </div>

        {requiredSkills.length > 0 && (
          <div className="mb-0">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
              <Zap className="w-4 h-4 text-red-500 mr-2" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map(skill => (
                <span 
                  key={skill.skill?.id || skill.name} 
                  className="px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium flex items-center"
                >
                  {skill.skill?.name || skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 pt-0 border-t border-gray-100">
        {job.status !== 'closed' ? (
          <div className="flex flex-col space-y-3">
            <div className="flex gap-3">
              <button 
                key={`status-button-${job.id}`}
                className={`flex-1 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  job.status === 'active' 
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                } ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={() => {
                  const newStatus = job.status === 'active' ? 'paused' : 'active';
                  onStatusChange(job.id, newStatus);
                }}
                disabled={isUpdating}
              >
                {job.status === 'active' ? 'Pause Job' : 'Activate Job'}
              </button>
              <button 
                key={`close-button-${job.id}`}
                className={`flex-1 bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  isUpdating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={handleCloseJob}
                disabled={isUpdating}
              >
                Close Job
              </button>
            </div>
            <button
              key={`details-button-${job.id}`}
              onClick={() => navigate(`/company/dashboard/manage-jobs/${job.id}`)} 
              className='w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center'
            >
              View Details
            </button>
          </div>
        ) : (
          <button
            key={`closed-details-button-${job.id}`}
            onClick={() => navigate(`/company/dashboard/manage-jobs/${job.id}`)} 
            className='w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center'
          >
            View Details
          </button>
        )}
      </div>
    </div>
  
  );
};

export default JobsList;