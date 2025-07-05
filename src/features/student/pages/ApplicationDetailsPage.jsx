// src/features/student/pages/ApplicationDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importing icons from lucide-react
import { 
    Loader2, XCircle, Briefcase, MapPin, BriefcaseBusiness, TrendingUp, 
    Calendar, DollarSign, FileText, Info, Download, ExternalLink, Mail, Link as LinkIcon,
    Clock, CalendarCheck, CheckCircle // Added missing imports for Clock, CalendarCheck, CheckCircle
} from 'lucide-react'; 

const ApplicationDetailsPage = () => {
    const { applicationId } = useParams(); // Get application ID from URL
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch application details
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
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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
            } else if (err.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, navigate]);

    // Fetch details on component mount or when applicationId changes
    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);

    // Helper function to get status badge styling (reused from MyApplicationsPage)
    const getStatusBadge = (status) => {
        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-800';
        let icon = null;
        let displayText = status ? status.replace(/_/g, ' ').toUpperCase() : 'N/A';

        switch (status) {
            case 'applied':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                icon = <Info size={16} className="inline-block mr-1" />;
                break;
            case 'reviewed': 
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                icon = <Clock size={16} className="inline-block mr-1" />; 
                displayText = 'UNDER REVIEW'; 
                break;
            case 'interviewed': 
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                icon = <CalendarCheck size={16} className="inline-block mr-1" />; 
                displayText = 'INTERVIEW SCHEDULED'; 
                break;
            case 'hired': 
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                icon = <CheckCircle size={16} className="inline-block mr-1" />;
                displayText = 'ACCEPTED'; 
                break;
            case 'rejected':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                icon = <XCircle size={16} className="inline-block mr-1" />;
                break;
            default:
                break;
        }
        return (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center ${bgColor} ${textColor}`}>
                {icon} {displayText}
            </span>
        );
    };

    // Function to handle CV download (reused from MyApplicationsPage)
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
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob' 
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = `cv_${appId}.pdf`; 
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
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
            console.error('CV download error:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-16 w-16 text-iti-primary mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading application details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative shadow-md max-w-lg text-center">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2"> {error}</span>
                    <button 
                        onClick={() => navigate('/my-applications')} 
                        className="mt-4 bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Go Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative shadow-md max-w-lg text-center">
                    <strong className="font-bold">Info:</strong>
                    <span className="block sm:inline ml-2"> No application data available.</span>
                    <button 
                        onClick={() => navigate('/my-applications')} 
                        className="mt-4 bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Go Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    // Destructure application and job data for easier access
    const { job, cover_letter, created_at, status, cv_path } = application;
    const { company, title, description, requirements, job_type, experience_level, salary_min, salary_max, application_deadline, is_remote } = job;
    const { company_name, location, website, industry, company_size, email: companyEmail } = company?.company_profile || {}; // Use optional chaining for company_profile

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto p-8 bg-white rounded-xl shadow-lg max-w-4xl">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 inline-flex items-center text-iti-primary hover:text-iti-primary-dark font-semibold transition duration-200"
                >
                    <ExternalLink size={20} className="transform rotate-180 mr-2" /> Back to My Applications
                </button>

                <h2 className="text-4xl font-extrabold bg-iti-gradient-text text-center mb-6 pb-4 border-b-2 border-gray-200">
                    Application Details
                </h2>

                {/* Application Summary */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-iti-primary mb-3">
                        {title || 'N/A'} Application
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <p className="flex items-center"><Briefcase size={18} className="text-gray-500 mr-2" /> 
                            <span className="font-semibold">Company:</span> {company_name || 'N/A'}
                        </p>
                        <p className="flex items-center"><MapPin size={18} className="text-gray-500 mr-2" /> 
                            <span className="font-semibold">Location:</span> {location || 'N/A'}
                        </p>
                        <p className="flex items-center"><Calendar size={18} className="text-gray-500 mr-2" /> 
                            <span className="font-semibold">Applied On:</span> {new Date(created_at).toLocaleDateString()}
                        </p>
                        <p className="flex items-center"><Info size={18} className="text-gray-500 mr-2" /> 
                            <span className="font-semibold">Status:</span> {getStatusBadge(status)}
                        </p>
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Job Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-xl font-semibold text-iti-primary mb-3">Overview</h4>
                            <p className="flex items-center text-gray-700 mb-2">
                                <BriefcaseBusiness size={18} className="text-gray-500 mr-2" /> 
                                <span className="font-medium">Job Type:</span> {job_type ? job_type.replace(/_/g, ' ').toUpperCase() : 'N/A'}
                            </p>
                            <p className="flex items-center text-gray-700 mb-2">
                                <TrendingUp size={18} className="text-gray-500 mr-2" /> 
                                <span className="font-medium">Experience Level:</span> {experience_level ? experience_level.replace(/_/g, ' ').toUpperCase() : 'N/A'}
                            </p>
                            <p className="flex items-center text-gray-700 mb-2">
                                <DollarSign size={18} className="text-gray-500 mr-2" /> 
                                <span className="font-medium">Salary Range:</span> {salary_min && salary_max ? `${salary_min} - ${salary_max} EGP` : 'N/A'}
                            </p>
                            <p className="flex items-center text-gray-700 mb-2">
                                <Calendar size={18} className="text-gray-500 mr-2" /> 
                                <span className="font-medium">Application Deadline:</span> {application_deadline ? new Date(application_deadline).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="flex items-center text-gray-700">
                                <MapPin size={18} className="text-gray-500 mr-2" /> 
                                <span className="font-medium">Remote:</span> {is_remote ? 'Yes' : 'No'}
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-xl font-semibold text-iti-primary mb-3">Company Details</h4>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Industry:</span> {industry || 'N/A'}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Company Size:</span> {company_size || 'N/A'}
                            </p>
                            {website && (
                                <p className="flex items-center text-blue-600 hover:underline mb-2">
                                    <LinkIcon size={18} className="mr-2" /> 
                                    <a href={website} target="_blank" rel="noopener noreferrer">Company Website</a>
                                </p>
                            )}
                            {companyEmail && (
                                <p className="flex items-center text-blue-600 hover:underline">
                                    <Mail size={18} className="mr-2" /> 
                                    <a href={`mailto:${companyEmail}`}>Contact Company</a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description and Requirements */}
                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Job Description</h3>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 prose max-w-none">
                        {description ? <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} /> : <p className="text-gray-600">No description provided.</p>}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Job Requirements</h3>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 prose max-w-none">
                        {requirements ? <div dangerouslySetInnerHTML={{ __html: requirements.replace(/\n/g, '<br/>') }} /> : <p className="text-gray-600">No requirements provided.</p>}
                    </div>
                </div>

                {/* Cover Letter */}
                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Your Cover Letter</h3>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 prose max-w-none">
                        {cover_letter ? <p>{cover_letter}</p> : <p className="text-gray-600">No cover letter submitted.</p>}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    {cv_path && (
                        <button
                            onClick={() => handleDownloadCV(application.id)}
                            className="inline-flex items-center bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-iti-primary focus:ring-opacity-75"
                        >
                            <Download size={20} className="mr-2" /> Download My CV
                        </button>
                    )}
                    {/* You can add a button to withdraw application from here too, if desired */}
                    {/* {status && !['rejected', 'hired'].includes(status) && ( 
                        <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                        >
                            <Trash2 size={20} className="mr-2" /> Withdraw Application
                        </button>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;
