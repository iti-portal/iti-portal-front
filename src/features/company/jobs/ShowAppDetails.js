import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
  Check, X, CalendarDays, User, Download, Mail, 
  Briefcase, ChevronLeft, FileText, Loader2, AlertCircle,
  ChevronDown, Phone, MessageSquare, Linkedin, Github, Globe, Link, Star
} from 'lucide-react';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const ApplicationView = () => {
  const navigate = useNavigate();
  const { jobId, applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const token = localStorage.getItem('token');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  // Modal handlers
  const openModal = useCallback((title, message, isConfirm = false, onConfirm = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsConfirmModal(isConfirm);
    setModalAction(() => onConfirm);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalTitle('');
    setModalMessage('');
    setModalAction(null);
    setIsConfirmModal(false);
  }, []);

  const handleModalConfirm = useCallback(() => {
    modalAction?.();
    closeModal();
  }, [modalAction, closeModal]);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `http://localhost:8000/api/company/applications/${applicationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.data) {
        setApplication(response.data.data);
      } else {
        throw new Error('Invalid application data format');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                        err.message || 
                        'Failed to load application details';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        openModal('Session Expired', 'Please log in again.', false, () => navigate('/login'));
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId, token, navigate, openModal]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/company/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.data) {
        setApplication(prev => ({ 
          ...prev, 
          status: newStatus
        }));
        openModal('Success', `Status updated to ${newStatus} successfully!`);
      }
    } catch (err) {
      openModal('Error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setShowStatusDropdown(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!application?.cv_path) {
      openModal('No Resume Available', 'This applicant has not uploaded a resume yet.');
      return;
    }

    try {
      if (!application.cv_downloaded_at) {
        await axios.get(
          `http://localhost:8000/api/job-applications/${application.id}/download-cv`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setApplication(prev => ({ 
          ...prev, 
          cv_downloaded_at: new Date().toISOString() 
        }));
      }

      // Download the CV using blob response
      const response = await axios.get(
        `http://localhost:8000/api/job-applications/${applicationId}/download-cv`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `CV_${application.user?.email || 'applicant'}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      openModal('Success', 'CV downloaded successfully!');
    } catch (err) {
      openModal('Download Failed', err.response?.data?.message || 'Failed to download resume');
    }
  };

  const getCVPreviewUrl = () => {
    if (!application?.cv_path) return null;
    
    try {
      const path = application.cv_path.split('storage/').pop();
      if (!path) return null;
      
      return `http://127.0.0.1:8000/storage/${encodeURIComponent(path)}?token=${token}`;
    } catch (error) {
      console.error("Error generating CV URL:", error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const getApplicantName = (email) => {
    if (!email) return 'Unknown User';
    const namePart = email.split('@')[0];
    return namePart.split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleUserProfileClick = async (userId) => {
    try {
      // Show loading indicator
      MySwal.fire({
        title: 'Loading profile...',
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        }
      });

      // Fetch user data from API with authorization header
      const response = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const userData = response.data.data.user;

      // Close loading indicator
      MySwal.close();

      // Show profile modal with the fetched data
      MySwal.fire({
        title: <strong>{userData.profile.first_name} {userData.profile.last_name}'s Profile</strong>,
        html: (
          <div className="text-left max-h-[70vh] flex flex-col">
            {/* Scrollable content container */}
            <div className="overflow-y-auto flex-1 px-1 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4 sticky top-0 bg-white pb-4 z-10">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center text-red-600 overflow-hidden">
                  {userData.profile.profile_picture ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${userData.profile.profile_picture}`}
                      alt={`${userData.profile.first_name} ${userData.profile.last_name}`}
                      className="rounded-full w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = `
                          <span class="text-xl font-medium">
                            ${userData.profile.first_name?.charAt(0) || ''}
                          </span>
                        `;
                      }}
                    />
                  ) : (
                    <span className="text-xl font-medium">
                      {userData.profile.first_name?.charAt(0) || ''}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {userData.profile.first_name} {userData.profile.last_name}
                      </h3>
                      <p className="text-gray-600">{userData.profile.track}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600">
                      {userData.profile.program} - Intake {userData.profile.intake}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      {userData.profile.branch}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 capitalize">
                      {userData.profile.student_status}
                    </span>
                    {userData.profile.available_for_freelance && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600">
                        Available for Freelance
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              {userData.profile.summary && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">SUMMARY</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {userData.profile.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">CONTACT INFORMATION</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.profile.phone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`tel:${userData.profile.phone}`} className="text-sm text-blue-600 hover:underline">
                          {userData.profile.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {userData.profile.whatsapp && (
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <div className="flex items-center mt-1">
                        <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`https://wa.me/${userData.profile.whatsapp.replace(/[^\d]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {userData.profile.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                  {userData.email && (
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`mailto:${userData.email}`} 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {userData.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {userData.profile.linkedin && (
                    <div>
                      <p className="text-xs text-gray-500">LinkedIn</p>
                      <div className="flex items-center mt-1">
                        <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={userData.profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {userData.profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  {userData.profile.github && (
                    <div>
                      <p className="text-xs text-gray-500">GitHub</p>
                      <div className="flex items-center mt-1">
                        <Github className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={userData.profile.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {userData.profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  {userData.profile.portfolio_url && (
                    <div>
                      <p className="text-xs text-gray-500">Portfolio</p>
                      <div className="flex items-center mt-1">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={userData.profile.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {userData.profile.portfolio_url.replace(/^https?:\/\//, '').split('/')[0]}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">WORK EXPERIENCE</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                    {userData.work_experiences?.length > 0 ? (
                      userData.work_experiences.map((exp, index) => {
                        const startDate = exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';
                        const endDate = exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A');
                        
                        return (
                          <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-800">{exp.position}</h5>
                                <p className="text-sm text-gray-600">{exp.company_name}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {startDate} - {endDate}
                                </span>
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No work experience added</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">EDUCATION</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                    {userData.educations?.length > 0 ? (
                      userData.educations.map((edu, index) => {
                        const startDate = edu.start_date ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';
                        const endDate = edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
                        
                        return (
                          <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-800">{edu.degree} in {edu.field_of_study}</h5>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {startDate} - {endDate}
                                </span>
                              </div>
                            </div>
                            {edu.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No education information added</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">SKILLS</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {userData.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No skills added</p>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">PROJECTS</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                    {userData.projects?.length > 0 ? (
                      userData.projects.map((project, index) => (
                        <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                          <h5 className="font-medium text-gray-800">{project.name}</h5>
                          {project.description && (
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                              {project.description}
                            </p>
                          )}
                          {project.link && (
                            <div className="mt-2 flex items-center">
                              <Link className="w-4 h-4 mr-2 text-gray-400" />
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No projects added</p>
                    )}
                  </div>
                </div>
              </div>

          

              {/* Awards */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">AWARDS</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                    {userData.awards?.length > 0 ? (
                      userData.awards.map((award, index) => {
                        const awardDate = award.date ? new Date(award.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'No AWARDS';
                        
                        return (
                          <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <h5 className="font-medium text-gray-800">{award.title}</h5>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {award.issuer}
                              </span>
                              <span className="text-xs text-gray-500">
                                {awardDate}
                              </span>
                            </div>
                            {award.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                {award.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No awards added</p>
                    )}
                  </div>
                </div>
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
    } catch (err) {
      MySwal.close();
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to load user profile. Please try again.',
      });
      console.error('Error fetching user profile:', err);
    }
  };

  const statusOptions = [
    { value: 'reviewed', label: 'Mark as Reviewed', icon: <Check className="w-4 h-4" /> },
    { value: 'interviewed', label: 'Mark as Interview', icon: <CalendarDays className="w-4 h-4" /> },
    { value: 'hired', label: 'Mark as Hired', icon: <Check className="w-4 h-4" /> },
    { value: 'rejected', label: 'Mark as Rejected', icon: <X className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">Error Loading Application</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate(`/company/dashboard/manage-jobs/${jobId}/applications`)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Application Data</h3>
          <button 
            onClick={() => navigate(`/company/dashboard/manage-jobs/${jobId}/applications`)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="max-w-full mx-auto px-6 py-6 h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left panel - Application details */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full">
            {/* Profile header */}
            <div className="bg-red-700 text-white p-6 border-b rounded border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center text-red-600 text-2xl font-medium overflow-hidden">
                  {application.user?.profile?.profile_picture ? (
                    <img 
                      src={`http://127.0.0.1:8000/storage/${application.user.profile.profile_picture}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(application.user?.profile?.first_name?.charAt(0) || '') + 
                      (application.user?.profile?.last_name?.charAt(0) || 'U')}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {getApplicantName(application.user?.email)}
                  </h1>
                  <p className="text-white font-medium">Applicant</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'hired' ? 'bg-green-100 text-green-800' :
                      application.status === 'interviewed' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="ml-2 text-sm text-white">
                      Applied on {formatDate(application.applied_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Job Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Job Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800">{application.job?.title}</h3>
                      <p className="text-sm text-gray-600">
                        {application.job?.job_type} • {application.job?.experience_level}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ${application.job?.salary_min} - ${application.job?.salary_max}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {application.user?.email && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <a href={`mailto:${application.user.email}`} className="text-gray-700 hover:text-red-600">
                        {application.user.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Cover Letter</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-gray-700">
                    {application.cover_letter || 'No cover letter provided.'}
                  </p>
                </div>
              </div>

              {/* Interview Details */}
              {application.interview_date && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Interview Details</h2>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Scheduled for:</span> {formatDateTime(application.interview_date)}
                    </p>
                    {application.interview_details && (
                      <p className="text-gray-700">
                        <span className="font-medium">Details:</span> {application.interview_details}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Company Notes */}
              {application.company_notes && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Company Notes</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 bg-yellow-50 p-4 rounded border border-yellow-100">
                      {application.company_notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col space-y-3">
                {/* Status dropdown button */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors border border-red-700 shadow-sm"
                  >
                    <span className="font-medium">Change Application Status</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showStatusDropdown ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {showStatusDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="py-1">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusUpdate(option.value)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm ${
                              application.status === option.value
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadCV}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors border shadow-sm hover:shadow-md ${
                      application.cv_path 
                        ? 'bg-gray-700 text-white border-gray-800 hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!application.cv_path}
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download CV</span>
                  </button>
                  <button
                    onClick={() => handleUserProfileClick(application.user.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors border border-emerald-700 shadow-sm"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - CV viewer */}
          {getCVPreviewUrl() && application?.cv_path?.toLowerCase().endsWith('.pdf') && (
            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto flex items-center justify-center bg-gray-100">
                <div style={{
                  width: '100%',
                  height: '100vh',
                  overflow: 'hidden'
                }}>
                  <iframe 
                    src={`${getCVPreviewUrl()}?token=${token}#toolbar=1&navpanes=0&zoom=100`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      marginTop: '0'
                    }}
                    title="Resume Preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{modalTitle}</h3>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <div className="flex justify-end space-x-3">
              {isConfirmModal && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleModalConfirm}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  isConfirmModal 
                    ? 'bg-red-600 hover:bg-red-700 border border-red-700'
                    : 'bg-red-500 hover:bg-red-600 border border-red-600'
                }`}
              >
                {isConfirmModal ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationView;