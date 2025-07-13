// src/features/student/pages/MyApplicationsPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Layout/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import ApplicationCard from "../components/applications/ApplicationCard";
import {
    Loader2, XCircle, Info, ExternalLink, Briefcase, Clock, CalendarCheck, Award,
    Search, BookOpen, FileText, User, Users // Ensure Users is imported
} from 'lucide-react';
import Modal from '../../../components/UI/Modal';
import { motion } from 'framer-motion';

const MyApplicationsPage = () => {
    // --- ALL LOGIC AND STATE MANAGEMENT REMAINS UNCHANGED ---
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [recentApplicationsActivity, setRecentApplicationsActivity] = useState([]);

    const quickResources = [
        { name: 'Update My Profile', icon: User, link: '/student/profile/edit' },
        { name: 'View My Achievements', icon: Award, link: '/my-achievements' },
        { name: 'Explore the Network', icon: Users, link: '/network' },
        { name: 'Browse More Jobs', icon: Briefcase, link: '/student/availablejobs' },
    ];

    const triggerConfirm = useCallback((message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setShowConfirmModal(true);
    }, []);

    const fetchApplications = useCallback(async () => {
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
            const response = await axios.get('http://localhost:8000/api/my-applications?include_match_score=true', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data.success) {
                const fetchedApplications = response.data.data.applications || [];
                setApplications(fetchedApplications);
                const sortedRecent = [...fetchedApplications]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);
                setRecentApplicationsActivity(sortedRecent);
            } else {
                setError(response.data.message || 'Failed to fetch applications.');
                setApplications([]);
                setRecentApplicationsActivity([]);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
                navigate('/login');
            } else if (err.response?.status === 404) {
                setApplications([]);
                setRecentApplicationsActivity([]);
            } else {
                setError(err.response?.data?.message || 'An error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const getStatusBadgeForRecentActivity = (status) => {
        const styles = {
            applied: { bg: 'bg-blue-100', text: 'text-blue-800', display: 'APPLIED' },
            reviewed: { bg: 'bg-yellow-100', text: 'text-yellow-800', display: 'UNDER REVIEW' },
            interviewed: { bg: 'bg-purple-100', text: 'text-purple-800', display: 'INTERVIEW' },
            hired: { bg: 'bg-green-100', text: 'text-green-800', display: 'HIRED' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', display: 'REJECTED' },
            default: { bg: 'bg-gray-100', text: 'text-gray-800', display: 'UNKNOWN' }
        };
        const { bg, text, display } = styles[status] || styles.default;
        return <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{display}</span>;
    };

    const { totalApplications, pendingReview, interviewScheduled, offersReceived, filteredApplications } = useMemo(() => {
        let pending = applications.filter(app => ['applied', 'reviewed'].includes(app.status)).length;
        let interview = applications.filter(app => app.status === 'interviewed').length;
        let offers = applications.filter(app => app.status === 'hired').length;
        const filtered = applications.filter(app =>
            (activeFilter === 'all' || app.status === activeFilter) &&
            (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
            totalApplications: applications.length,
            pendingReview: pending,
            interviewScheduled: interview,
            offersReceived: offers,
            filteredApplications: filtered
        };
    }, [applications, activeFilter, searchQuery]);

    // ✅ FIXED: Restored the full, working logic for downloading the CV
    const handleDownloadCV = useCallback(async (applicationId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            navigate('/login');
            return;
        }

        const downloadUrl = `http://localhost:8000/api/job-applications/${applicationId}/download-cv`;

        try {
            const response = await axios.get(downloadUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob'
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = `cv_${applicationId}.pdf`;
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
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    }, [navigate]);

    // ✅ FIXED: Restored the full, working logic for withdrawing an application
    const handleWithdrawApplication = useCallback((applicationId) => {
        triggerConfirm('Are you sure you want to withdraw this application? This action cannot be undone.', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.delete(`http://localhost:8000/api/job-applications/${applicationId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.data.success) {
                    fetchApplications(); // Re-fetch to update the list and stats
                } else {
                    setError(response.data.message || 'Failed to withdraw application.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error withdrawing application. Please try again.');
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        });
    }, [fetchApplications, navigate, triggerConfirm]);

    const renderLoadingSkeleton = () => (
        <div className="space-y-8">
            <div className="bg-white/50 rounded-xl shadow-sm p-6 border border-white/30 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="space-y-2"><div className="h-8 bg-gray-300 rounded w-1/4 mx-auto"></div><div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div></div>)}
            </div>
            <div className="bg-white/50 rounded-xl shadow-sm p-6 border border-white/30 animate-pulse grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-48 bg-gray-300/50 rounded-lg"></div>)}
                </div>
                <div className="lg:col-span-1 h-64 bg-gray-300/50 rounded-lg"></div>
            </div>
        </div>
    );
    
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
                    className="max-w-7xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-4">
                            <Briefcase className="text-[#901b20] mr-2" size={18} />
                            <span className="text-[#901b20] font-semibold text-sm">MY DASHBOARD</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Career Journey</span>
                        </h1>
                        <p className="text-gray-600 text-lg">Manage your job applications and access helpful resources all in one place.</p>
                    </div>

                    {isLoading ? (
                        renderLoadingSkeleton()
                    ) : error ? (
                        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/30"><XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-gray-800">An Error Occurred</h3><p className="text-gray-600 mt-2">{error}</p></div>
                    ) : (
                        <div className="space-y-8">
                            {/* Statistics Cards */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/30">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: Briefcase, label: "Total Applications", value: totalApplications, color: "text-[#203947]" },
                                        { icon: Clock, label: "Pending Review", value: pendingReview, color: "text-yellow-600" },
                                        { icon: CalendarCheck, label: "Interviews", value: interviewScheduled, color: "text-purple-600" },
                                        { icon: Award, label: "Offers Received", value: offersReceived, color: "text-green-600" },
                                    ].map(stat => (
                                        <div key={stat.label} className="text-center p-2">
                                            {React.createElement(stat.icon, { className: `h-8 w-8 mx-auto mb-2 ${stat.color}` })}
                                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-gray-600 text-sm">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Filters and Search */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/30">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {['all', 'applied', 'reviewed', 'interviewed', 'hired', 'rejected'].map(filter => (
                                            <button key={filter} onClick={() => setActiveFilter(filter)} className={`py-2 px-4 rounded-full text-sm font-semibold transition duration-300 transform hover:scale-105 ${activeFilter === filter ? 'bg-gradient-to-r from-[#901b20] to-[#203947] text-white shadow-md' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}>
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative w-full md:w-auto md:min-w-[250px]">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search by job title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main Content Area */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    {filteredApplications.length > 0 ? (
                                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredApplications.map(app => (
                                                <motion.div key={app.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                    <ApplicationCard application={app} handleDownloadCV={handleDownloadCV} handleWithdrawApplication={handleWithdrawApplication} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 h-full flex flex-col justify-center items-center">
                                            <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-2xl font-bold text-gray-800">No Applications Found</h3>
                                            <p className="text-gray-600 mt-2 mb-6">Try adjusting your filters or start applying for new jobs!</p>
                                            <Link to="/student/availablejobs" className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                                Browse Jobs <ExternalLink size={16} className="ml-2" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-1 space-y-8">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/30">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Clock size={20} className="mr-3 text-[#203947]" /> Recent Activity</h3>
                                        {recentApplicationsActivity.length > 0 ? (
                                            <ul className="space-y-3">
                                                {recentApplicationsActivity.map(app => (
                                                    <li key={app.id} className="text-gray-800 p-2 rounded-md hover:bg-gray-50/50 transition-colors duration-200">
                                                        <p className="font-semibold text-base truncate">{app.job?.title || 'N/A'}</p>
                                                        <div className="flex items-center justify-between text-sm mt-1">
                                                            <span className="text-gray-500">{new Date(app.created_at).toLocaleDateString()}</span>
                                                            {getStatusBadgeForRecentActivity(app.status)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-gray-600 text-sm">No recent activity.</p>}
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/30">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><BookOpen size={20} className="mr-3 text-[#901b20]" /> Quick Resources</h3>
                                        <ul className="space-y-2">
                                            {quickResources.map(resource => (
                                                <li key={resource.name}>
                                                    <Link to={resource.link} className="flex items-center text-gray-700 hover:text-[#901b20] transition duration-200 p-2 rounded-md hover:bg-red-50/50 font-medium">
                                                        {React.createElement(resource.icon, { size: 18, className: "mr-3" })}
                                                        {resource.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} hideHeader={true} containerClass="max-w-md">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Withdraw Application</h3>
                            <p className="mt-2 text-sm text-gray-500">{confirmMessage}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" onClick={() => { if (confirmAction) confirmAction(); setShowConfirmModal(false); }} className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Confirm</button>
                    <button type="button" onClick={() => setShowConfirmModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default MyApplicationsPage;