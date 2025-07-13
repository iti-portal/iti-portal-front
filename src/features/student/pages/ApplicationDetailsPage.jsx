// src/features/student/pages/ApplicationDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Loader2, XCircle, Briefcase, MapPin, BriefcaseBusiness, TrendingUp, 
    Calendar, DollarSign, FileText, Info, Download, ExternalLink, Mail, Link as LinkIcon,
    Clock, CalendarCheck, CheckCircle, ArrowLeft
} from 'lucide-react'; 

const ApplicationDetailsPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplicationDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setIsLoading(false);
            navigate('/login'); 
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/job-applications/${applicationId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data.success && response.data.data) {
                setApplication(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch application details.');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                    navigate('/login'); 
                } else if (err.response.status === 404) {
                    setError('Application not found.');
                } else {
                    setError(err.response.data.message || 'Server error occurred. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, navigate]);

    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            applied: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Info size={14} /> },
            reviewed: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} /> },
            interviewed: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <CalendarCheck size={14} /> },
            hired: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} /> },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={14} /> },
            withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Info size={14} /> },
        };
        
        const config = statusConfig[status] || statusConfig.withdrawn;
        const displayText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon} {displayText}
            </span>
        );
    };

    const handleDownloadCV = async (appId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            navigate('/login');
            return;
        }

        const downloadUrl = `http://localhost:8000/api/job-applications/${appId}/download-cv`;
        try {
            const response = await axios.get(downloadUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob' 
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = `cv_${appId}.pdf`; 
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch?.[1]) {
                    filename = filenameMatch[1];
                }
            }
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); 
        } catch (err) {
            setError('Failed to download CV. Please try again.');
            if (err.response?.status === 401) navigate('/login');
        }
    };
    
    const InfoBlock = ({ label, value, children }) => (
        <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{label}</p>
            {children ? <div className="text-sm font-medium text-gray-800 mt-1">{children}</div> : <p className="text-sm font-medium text-gray-800 mt-1">{value || 'N/A'}</p>}
        </div>
    );
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading application details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center px-4">
                 <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md max-w-lg w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                             <button 
                                onClick={() => navigate('/my-applications')} 
                                className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back to Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!application) {
         return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center px-4">
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md max-w-lg w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">No application data available.</p>
                             <button 
                                onClick={() => navigate('/my-applications')} 
                                className="mt-2 inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back to Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { job, cover_letter, created_at, status, cv_path } = application;
    const { company, title, description, requirements, job_type, experience_level, salary_min, salary_max, application_deadline, is_remote } = job;
    const { company_name, location, website, industry, company_size, email: companyEmail } = company?.company_profile || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Briefcase className="mr-3 h-6 w-6 text-red-500" />
                            Application Details
                        </h2>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Back
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                         {/* Application Summary */}
                        <div>
                            <h4 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider">Application Overview</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-4">
                                     <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{title || 'N/A'}</h3>
                                        <p className="text-md text-gray-600">{company_name || 'N/A'}</p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            {getStatusBadge(status)}
                                            <span className="flex items-center text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Applied on {new Date(created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Details Section */}
                        <div>
                            <h4 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider">Job Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <InfoBlock label="Job Type" value={job_type?.replace(/_/g, ' ').toUpperCase()} />
                               <InfoBlock label="Experience Level" value={experience_level?.replace(/_/g, ' ').toUpperCase()} />
                               <InfoBlock label="Work Setting" value={is_remote ? 'Remote' : 'On-site'} />
                               <InfoBlock label="Location" value={location} />
                               <InfoBlock label="Salary Range (EGP)" value={salary_min && salary_max ? `${salary_min} - ${salary_max}` : 'Not Disclosed'} />
                               <InfoBlock label="Application Deadline" value={application_deadline ? new Date(application_deadline).toLocaleDateString() : 'N/A'} />
                            </div>
                        </div>

                         {/* Company Details Section */}
                        <div>
                            <h4 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider">Company Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoBlock label="Industry" value={industry} />
                                <InfoBlock label="Company Size" value={company_size} />
                                <InfoBlock label="Company Website">
                                    {website ? <a href={website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline flex items-center gap-1"><ExternalLink size={14}/> View Website</a> : 'N/A'}
                                </InfoBlock>
                                <InfoBlock label="Contact Email">
                                    {companyEmail ? <a href={`mailto:${companyEmail}`} className="text-red-600 hover:underline flex items-center gap-1"><Mail size={14}/> Send Email</a> : 'N/A'}
                                </InfoBlock>
                            </div>
                        </div>

                        {/* Description and Requirements */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-red-500"/>Job Description</h4>
                            <div className="bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none text-gray-700">
                                {description ? <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} /> : <p>No description provided.</p>}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-red-500"/>Job Requirements</h4>
                            <div className="bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none text-gray-700">
                                {requirements ? <div dangerouslySetInnerHTML={{ __html: requirements.replace(/\n/g, '<br/>') }} /> : <p>No requirements provided.</p>}
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                             <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-red-500"/>Your Cover Letter</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {cover_letter || 'No cover letter submitted.'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start pt-4 border-t border-gray-200">
                            {cv_path && (
                                <button
                                    onClick={() => handleDownloadCV(application.id)}
                                    className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <Download size={18} className="mr-2" /> Download Submitted CV
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;