import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
  Check, X, CalendarDays, User, Download, Mail, 
  Briefcase, ChevronLeft, FileText, Loader2, AlertCircle,
  ChevronDown
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
        `${process.env.REACT_APP_API_URL}/company/applications/${applicationId}`,
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
        `${process.env.REACT_APP_API_URL}/company/applications/${applicationId}/status`,
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
          `${process.env.REACT_APP_API_URL}/job-applications/${application.id}/download-cv`,
          {},
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
        `${process.env.REACT_APP_API_URL}/job-applications/${applicationId}/download-cv`,
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
    
    return `${process.env.REACT_APP_API_ASSET_URL}/${encodeURIComponent(path)}?token=${token}`;
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

  const statusOptions = [
    { value: 'reviewed', label: 'Mark as Reviewed', icon: <Check className="w-4 h-4" /> },
    { value: 'interviewed', label: 'Mark as Interview', icon: <CalendarDays className="w-4 h-4" /> },
    { value: 'hired', label: 'Mark as Hired', icon: <Check className="w-4 h-4" /> },
    { value: 'rejected', label: 'Mark as Rejected', icon: <X className="w-4 h-4" /> },
  ];

  return (
<div className="min-h-screen">
  {/* Header */}

  {/* Main content */}
  <div className="max-w-full mx-auto px-6 py-6 h-[calc(100vh-80px)]">
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left panel - Application details */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full">
        {/* Profile header */}
        <div className="bg-red-700 text-white p-6 border-b rounded border-gray-200">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center text-red-600 text-2xl font-medium">
              {application.user?.email?.charAt(0).toUpperCase() || 'U'}
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
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-md transition-colors border shadow-sm hover:shadow-md"
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