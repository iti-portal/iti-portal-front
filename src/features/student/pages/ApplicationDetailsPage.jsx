// src/features/student/pages/ApplicationDetailsPage.jsx
// This is the complete, fully fixed code with the modern design and all functionality restored.

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';

import {
    Loader2, XCircle, Briefcase, MapPin, BriefcaseBusiness, TrendingUp,
    Calendar, DollarSign, FileText, Info, Download, Link as LinkIcon,
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
            setError('Authentication required. Please log in.');
            setIsLoading(false);
            navigate('/login');
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/job-applications/${applicationId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data.success && response.data.data) {
                setApplication(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch application details.');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
                navigate('/login');
            } else if (err.response?.status === 404) {
                setError('This application could not be found.');
            } else {
                setError(err.response?.data?.message || 'An error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, navigate]);

    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);

    const getStatusBadge = (status) => {
        const styles = {
            applied: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Info, display: 'APPLIED' },
            reviewed: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, display: 'UNDER REVIEW' },
            interviewed: { bg: 'bg-purple-100', text: 'text-purple-700', icon: CalendarCheck, display: 'INTERVIEW' },
            hired: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, display: 'HIRED' },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, display: 'NOT SELECTED' },
            default: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Info, display: 'UNKNOWN' }
        };
        const { bg, text, icon, display } = styles[status] || styles.default;
        return (
            <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg ${bg} ${text}`}>
                {React.createElement(icon, { size: 18 })} {display}
            </span>
        );
    };

    const handleDownloadCV = async (appId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please log in.');
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/job-applications/${appId}/download-cv`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const contentDisposition = response.headers['content-disposition'];
            let filename = `cv_${appId}.pdf`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = filenameMatch[1];
                }
            }
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Failed to download CV.');
        }
    };

    const renderFullPageStatus = (IconComponent, title, message) => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex flex-col justify-center items-center p-4">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 max-w-lg w-full"
            >
                <IconComponent className={`w-16 h-16 mx-auto mb-6 ${IconComponent === Loader2 ? 'animate-spin text-[#901b20]' : 'text-red-400'}`} />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-8">{message}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/my-applications')}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to My Applications
                </motion.button>
            </motion.div>
        </div>
    );
    
    if (isLoading) return renderFullPageStatus(Loader2, 'Loading Details', 'Please wait while we fetch your application data.');
    if (error) return renderFullPageStatus(XCircle, 'An Error Occurred', error);
    if (!application) return renderFullPageStatus(Info, 'No Data Found', 'We could not find the details for this application.');

    const { job, cover_letter, created_at, status, cv_path } = application;
    const { company, title, description, requirements, job_type, experience_level, salary_min, salary_max, application_deadline, is_remote } = job;
    const { company_name, location, website, industry } = company?.company_profile || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
            <Navbar />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

            <main className="pt-24 pb-10 px-4 sm:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-6"
                    >
                        <button
                            onClick={() => navigate('/my-applications')}
                            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-white/90 hover:text-gray-900 border border-white/30"
                        >
                            <ArrowLeft size={16} />
                            Back to My Applications
                        </button>
                    </motion.div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-4">
                            <FileText className="text-[#901b20] mr-2" size={18} />
                            <span className="text-[#901b20] font-semibold text-sm">APPLICATION DETAILS</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">{title || 'Job Application'}</span>
                        </h1>
                        <p className="text-gray-600 text-lg">A detailed overview of your application submitted to {company_name || 'the company'}.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 border border-white/30 space-y-10"
                    >
                        {/* Status Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Status Overview</h2>
                            <div className="bg-gray-50/50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border">
                                <div className="text-center sm:text-left">
                                    <p className="text-gray-600">Date Submitted</p>
                                    <p className="text-xl font-semibold text-gray-900">{new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="flex-grow h-px sm:h-auto sm:w-px bg-gray-200"></div>
                                <div className="text-center sm:text-left">
                                    <p className="text-gray-600">Current Status</p>
                                    {getStatusBadge(status)}
                                </div>
                            </div>
                        </section>

                        {/* Job Details */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-start"><Briefcase size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Company:</span> {company_name || 'N/A'}</p></div>
                                    <div className="flex items-start"><BriefcaseBusiness size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Industry:</span> {industry || 'N/A'}</p></div>
                                    <div className="flex items-start"><MapPin size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Location:</span> {location || 'N/A'} ({is_remote ? 'Remote Available' : 'On-site'})</p></div>
                                    {website && <div className="flex items-start"><LinkIcon size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Company Website</a></div>}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start"><TrendingUp size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Experience:</span> {experience_level?.replace(/_/g, ' ')}</p></div>
                                    <div className="flex items-start"><Briefcase size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Job Type:</span> {job_type?.replace(/_/g, ' ')}</p></div>
                                    <div className="flex items-start"><DollarSign size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Salary:</span> {salary_min && salary_max ? `${salary_min} - ${salary_max} EGP` : 'Not Disclosed'}</p></div>
                                    <div className="flex items-start"><Calendar size={18} className="mr-3 mt-1 text-gray-500 flex-shrink-0" /><p><span className="font-semibold">Apply by:</span> {application_deadline ? new Date(application_deadline).toLocaleDateString() : 'N/A'}</p></div>
                                </div>
                            </div>
                        </section>

                        {/* Description & Requirements */}
                        <section>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Job Description</h3>
                                    <div className="prose prose-sm max-w-none bg-gray-50/50 p-4 rounded-lg border text-gray-700">
                                        {description ? <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} /> : <p>No description provided.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Job Requirements</h3>
                                    <div className="prose prose-sm max-w-none bg-gray-50/50 p-4 rounded-lg border text-gray-700">
                                        {requirements ? <div dangerouslySetInnerHTML={{ __html: requirements.replace(/\n/g, '<br/>') }} /> : <p>No requirements provided.</p>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Your Submission */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Submission</h2>
                            <div className="bg-gray-50/50 rounded-lg p-6 border space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Cover Letter</h3>
                                    <p className="text-gray-700 whitespace-pre-line">{cover_letter || 'No cover letter was submitted.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Submitted CV</h3>
                                    {cv_path ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDownloadCV(application.id)}
                                            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Download size={18} className="mr-2" />
                                            Download Submitted CV
                                        </motion.button>
                                    ) : (
                                        <p className="text-gray-500">CV not available for download.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default ApplicationDetailsPage;