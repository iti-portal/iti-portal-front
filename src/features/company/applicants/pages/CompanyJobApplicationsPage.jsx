// src/features/company/applicants/pages/CompanyJobApplicationsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompanyApplicationCard from '../../applicants/components/CompanyApplicationCard';
import { 
    Loader2, XCircle, Briefcase, Users, BarChart2, Calendar, 
    Info, Clock, CalendarCheck, Search, SlidersHorizontal, CheckCircle,
    Eye, Download, Mail, Phone, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';

const CompanyJobApplicationsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // State management
    const [allApplications, setAllApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobData, setJobData] = useState(null);
    const [isJobDataLoading, setIsJobDataLoading] = useState(true);
    const [jobDataError, setJobDataError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'applied_at', direction: 'desc' });

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

    // Data fetching
    const fetchJobDetails = useCallback(async () => {
        setIsJobDataLoading(true);
        setJobDataError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success && response.data.data) {
                setJobData(response.data.data);
            } else {
                setJobDataError(response.data.message || 'Failed to fetch job details.');
            }
        } catch (err) {
            setJobDataError(err.response?.data?.message || 'Error fetching job details.');
        } finally {
            setIsJobDataLoading(false);
        }
    }, [jobId]);

    const fetchJobApplicationsAndStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
            openModal('Authentication Error', 'Please log in again.', false, () => navigate('/login'));
            setIsLoading(false);
            return;
        }

        try {
            // Fetch applications
            const applicationsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/company/applications?job_id=${jobId}&include_match_score=true`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (applicationsResponse.data.success) {
                setAllApplications(applicationsResponse.data.data || []);
            } else {
                setError(applicationsResponse.data.message || 'Failed to fetch applications.');
            }

            // Fetch stats
            const statsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/jobs/${jobId}/applications/stats`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred.';
            if (err.response?.status === 401) {
                openModal('Session Expired', 'Please log in again.', false, () => navigate('/login'));
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [jobId, navigate, openModal]);

    // Effects
    useEffect(() => { fetchJobDetails(); }, [fetchJobDetails]);
    useEffect(() => { fetchJobApplicationsAndStats(); }, [fetchJobApplicationsAndStats]);

    // Handlers
    const handleDownloadCV = useCallback(async (applicationId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            openModal('Authentication Error', 'Please log in again.', false, () => navigate('/login'));
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/job-applications/${applicationId}/download-cv`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const filename = response.headers['content-disposition']?.split('filename=')[1] || `cv_${applicationId}.pdf`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            openModal('Success', 'CV downloaded successfully!');
        } catch (err) {
            openModal('Error', err.response?.data?.message || 'Failed to download CV.');
        }
    }, [navigate, openModal]);

    const handleUpdateApplicationStatus = useCallback((applicationId, newStatus) => {
        openModal(
            'Confirm Status Change',
            `Change status to ${newStatus.toUpperCase()}?`,
            true,
            async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    openModal('Authentication Error', 'Please log in again.', false, () => navigate('/login'));
                    return;
                }

                try {
                    await axios.patch(
                        `${process.env.REACT_APP_API_URL}/company/applications/${applicationId}/status`,
                        { status: newStatus },
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    openModal('Success', 'Status updated successfully!');
                    fetchJobApplicationsAndStats();
                } catch (err) {
                    openModal('Error', err.response?.data?.message || 'Failed to update status.');
                }
            }
        );
    }, [fetchJobApplicationsAndStats, navigate, openModal]);

    // Sorting functionality
    const handleSort = useCallback((key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    // Memoized values
    const jobTitle = useMemo(() => {
        if (isJobDataLoading) return 'Loading...';
        if (jobDataError) return jobDataError.includes('not found') ? `Job ID: ${jobId}` : 'Error loading job';
        return jobData?.title || `Job ID: ${jobId}`;
    }, [jobData, jobId, isJobDataLoading, jobDataError]);

    const filteredAndSearchedApplications = useMemo(() => {
        let filtered = [...allApplications];
        
        if (activeFilter !== 'all') {
            filtered = filtered.filter(app => app.status === activeFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app => {
                const name = `${app.user?.profile?.first_name || ''} ${app.user?.profile?.last_name || ''}`.toLowerCase();
                const email = (app.user?.email || '').toLowerCase();
                return name.includes(query) || email.includes(query);
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            const aValue = sortConfig.key === 'match_score' 
                ? a.match_data?.score || 0 
                : a[sortConfig.key] || '';
            const bValue = sortConfig.key === 'match_score' 
                ? b.match_data?.score || 0 
                : b[sortConfig.key] || '';

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [allApplications, activeFilter, searchQuery, sortConfig]);

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-iti-primary to-blue-600">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                Applicants for: {jobTitle}
                            </h2>
                            <button 
                                onClick={() => navigate(-1)}
                                className="text-white hover:text-gray-200 flex items-center"
                            >
                                <ArrowRight className="h-5 w-5 rotate-180 mr-1" />
                                Back to Jobs
                            </button>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {jobDataError && !jobDataError.includes('not found') && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
                            <div className="flex items-center">
                                <XCircle className="h-5 w-5 text-red-400 mr-3" />
                                <p className="text-red-700">{jobDataError}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
                            <div className="flex items-center">
                                <XCircle className="h-5 w-5 text-red-400 mr-3" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin h-12 w-12 text-iti-primary" />
                        </div>
                    )}

                    {/* Content */}
                    {!isLoading && !error && (
                        <>
                            {/* Statistics */}
                            {stats && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                                    <StatCard 
                                        icon={<Users className="h-6 w-6" />}
                                        value={stats.total || 0}
                                        label="Total Applicants"
                                        color="text-blue-600"
                                    />
                                    <StatCard 
                                        icon={<Eye className="h-6 w-6" />}
                                        value={(stats.status_breakdown?.applied || 0) + (stats.status_breakdown?.reviewed || 0)}
                                        label="Under Review"
                                        color="text-purple-600"
                                    />
                                    <StatCard 
                                        icon={<CalendarCheck className="h-6 w-6" />}
                                        value={stats.status_breakdown?.interviewed || 0}
                                        label="Interviewed"
                                        color="text-indigo-600"
                                    />
                                    <StatCard 
                                        icon={<CheckCircle className="h-6 w-6" />}
                                        value={stats.status_breakdown?.hired || 0}
                                        label="Hired"
                                        color="text-green-600"
                                    />
                                </div>
                            )}

                            {/* Filters */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-iti-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {['all', 'applied', 'reviewed', 'interviewed', 'hired', 'rejected'].map(filter => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                    activeFilter === filter 
                                                        ? 'bg-iti-primary text-white shadow-md'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                }`}
                                            >
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                <div className="mt-4">
                                    <button 
                                        onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                                        className="flex items-center text-sm text-iti-primary hover:text-blue-700"
                                    >
                                        {isAdvancedFilterOpen ? (
                                            <ChevronUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 mr-1" />
                                        )}
                                        Advanced Filters
                                    </button>

                                    {isAdvancedFilterOpen && (
                                        <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Sort By
                                                    </label>
                                                    <select
                                                        value={sortConfig.key}
                                                        onChange={(e) => handleSort(e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-iti-primary focus:ring-iti-primary text-sm"
                                                    >
                                                        <option value="applied_at">Application Date</option>
                                                        <option value="match_score">Match Score</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Order
                                                    </label>
                                                    <select
                                                        value={sortConfig.direction}
                                                        onChange={(e) => setSortConfig(prev => ({
                                                            ...prev,
                                                            direction: e.target.value
                                                        }))}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-iti-primary focus:ring-iti-primary text-sm"
                                                    >
                                                        <option value="desc">Descending</option>
                                                        <option value="asc">Ascending</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Applications */}
                            <div className="p-6">
                                {filteredAndSearchedApplications.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Info className="mx-auto h-10 w-10 text-gray-400" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No applicants found</h3>
                                        <p className="mt-1 text-gray-500">
                                            {activeFilter === 'all' && !searchQuery
                                                ? 'No applications for this job yet.'
                                                : 'No matches for your current filters.'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {filteredAndSearchedApplications.map(app => (
                                            <CompanyApplicationCard
                                                key={app.id}
                                                application={app}
                                                handleDownloadCV={handleDownloadCV}
                                                handleUpdateApplicationStatus={handleUpdateApplicationStatus}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
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
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleModalConfirm}
                                className={`px-4 py-2 rounded-md text-white transition-colors ${
                                    isConfirmModal 
                                        ? 'bg-iti-primary hover:bg-blue-700'
                                        : 'bg-blue-500 hover:bg-blue-600'
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

// StatCard component for statistics display
const StatCard = ({ icon, value, label, color }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
            <div className={`p-2 rounded-full ${color.replace('text', 'bg')} bg-opacity-10 mr-3`}>
                {React.cloneElement(icon, { className: `${color} h-5 w-5` })}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    </div>
);

export default CompanyJobApplicationsPage;