// src/features/company/applicants/pages/CompanyJobApplicationsPage.jsx
// This page allows a company to manage applications for a specific job.
// Filtering and searching are now handled on the frontend.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import the new CompanyApplicationCard component
import CompanyApplicationCard from '../../applicants/components/CompanyApplicationCard'; 

// Importing icons from lucide-react
import { 
    Loader2, XCircle, Briefcase, Users, BarChart2, Calendar, 
    Info, Clock, CalendarCheck, Award, ExternalLink, Search, SlidersHorizontal,
    CheckCircle 
} from 'lucide-react'; 

const CompanyJobApplicationsPage = () => {
    const { jobId } = useParams(); // Get jobId from URL (e.g., /company/jobs/:jobId/applications)
    const navigate = useNavigate();

    const [allApplications, setAllApplications] = useState([]); // Stores all applications fetched from backend
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Overall loading for applications and stats
    const [error, setError] = useState(null); // Overall error for applications and stats

    const [jobData, setJobData] = useState(null); // New state to store job details
    const [isJobDataLoading, setIsJobDataLoading] = useState(true); // Loading state for job details
    const [jobDataError, setJobDataError] = useState(null); // Error state for job details

    const [activeFilter, setActiveFilter] = useState('all'); // Filter for applications list (frontend)
    const [searchQuery, setSearchQuery] = useState(''); // State for search input (frontend)
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false); // State for advanced filter modal/sidebar

    // Function to fetch job details (title, etc.) independently
    const fetchJobDetails = useCallback(async () => {
        setIsJobDataLoading(true);
        setJobDataError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success && response.data.data) {
                setJobData(response.data.data);
            } else {
                setJobDataError(response.data.message || 'Failed to fetch job details.');
            }
        } catch (err) {
            setJobDataError(err.response?.data?.message || 'Error fetching job details.');
            console.error('Error fetching job details:', err);
        } finally {
            setIsJobDataLoading(false);
        }
    }, [jobId]);

    // Function to fetch ALL job applications and statistics
    // This function no longer takes activeFilter or searchQuery as parameters for backend call
    const fetchJobApplicationsAndStats = useCallback(async () => {
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
            // 1. Fetch ALL Applications for this jobId
            // Removed activeFilter and searchQuery from backend URL
            const applicationsUrl = `http://localhost:8000/api/company/applications?job_id=${jobId}&include_match_score=true`;
            
            const applicationsResponse = await axios.get(applicationsUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (applicationsResponse.data.success && Array.isArray(applicationsResponse.data.data)) {
                setAllApplications(applicationsResponse.data.data); // Store all applications
                setError(null); 
            } else {
                // If backend returns success:false, it's still an error for the initial fetch
                setAllApplications([]); 
                setError(applicationsResponse.data.message || 'Failed to fetch applications due to an unknown issue.');
            }

            // 2. Fetch Statistics (still backend-driven)
            const statsUrl = `http://localhost:8000/api/jobs/${jobId}/applications/stats`;
            const statsResponse = await axios.get(statsUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (statsResponse.data.success && statsResponse.data.data) {
                setStats(statsResponse.data.data);
            } else {
                setStats(null);
                console.error(statsResponse.data.message || 'Failed to fetch application statistics.');
            }

        } catch (err) {
            if (err.response) {
                const errorMessage = err.response.data?.message || 'Server error occurred. Please try again.';
                
                if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                    navigate('/login');
                } else if (err.response.status === 404 && errorMessage.includes('Job or applications not found for this job ID')) {
                    setError(errorMessage); 
                } else {
                    setAllApplications([]); // Clear applications on critical error
                    setError(errorMessage); 
                }
            } else if (err.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [jobId, navigate]); 

    // Effect to fetch job details (runs once per jobId)
    useEffect(() => {
        fetchJobDetails();
    }, [fetchJobDetails]);

    // Effect to fetch all applications and stats (runs once per jobId)
    useEffect(() => {
        fetchJobApplicationsAndStats();
    }, [fetchJobApplicationsAndStats]);

    // Handler for downloading CV (passed to CompanyApplicationCard)
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
            console.error('CV download error:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    }, [navigate]);

    // Handler for updating application status (passed to CompanyApplicationCard)
    // Uses the PATCH /api/company/applications/{id}/status endpoint
    const handleUpdateApplicationStatus = useCallback(async (applicationId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change this application's status to ${newStatus.toUpperCase()}?`)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            navigate('/login');
            return;
        }

        setIsLoading(true); 
        try {
            const response = await axios.patch(`http://localhost:8000/api/company/applications/${applicationId}/status`, 
                { status: newStatus }, 
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                alert(`Application status updated to ${newStatus.toUpperCase()} successfully!`);
                fetchJobApplicationsAndStats(); // Re-fetch all applications to update UI
            } else {
                setError(response.data.message || 'Failed to update application status.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating application status. Please try again.');
            console.error('Update status error:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchJobApplicationsAndStats, navigate]);

    // Memoized job title for display in the header
    const jobTitle = useMemo(() => {
        if (isJobDataLoading) {
            return 'Loading Job Details...';
        }
        if (jobDataError) {
            // Check for specific "Job ID not found" message
            if (jobDataError.includes('Details for job with ID:') || jobDataError.includes('Job not found')) {
                return `Job Not Found: ID ${jobId}`;
            }
            return `Error Loading Job: ID ${jobId}`; // Generic error for job details
        }
        if (jobData && jobData.title) {
            return jobData.title;
        }
        return `Job ID: ${jobId}`; 
    }, [jobData, jobId, isJobDataLoading, jobDataError]);

    // Filter and search applications on the frontend
    const filteredAndSearchedApplications = useMemo(() => {
        let currentApplications = allApplications;

        // Apply status filter
        if (activeFilter !== 'all') {
            currentApplications = currentApplications.filter(app => app.status === activeFilter);
        }

        // Apply search query filter (case-insensitive on first name, last name, email)
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentApplications = currentApplications.filter(app => {
                const fullName = `${app.user?.profile?.first_name || ''} ${app.user?.profile?.last_name || ''}`.toLowerCase();
                const email = (app.user?.email || '').toLowerCase();
                return fullName.includes(lowerCaseQuery) || email.includes(lowerCaseQuery);
            });
        }

        return currentApplications;
    }, [allApplications, activeFilter, searchQuery]);


    return (
        <div className="min-h-screen  py-10">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-6xl">
                {/* Page Header: Job Title */}
                <h2 className="text-4xl font-extrabold bg-iti-gradient-text text-center mb-8 pb-4 border-b-2 border-gray-200">
                    Applicants for: {jobTitle} 
                </h2>

                {/* Job Data Error Message (only if it's a critical error, not just "not found" in title) */}
                {jobDataError && !jobDataError.includes('Details for job with ID:') && !jobDataError.includes('Job not found') && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
                        <strong className="font-bold">Error loading job details:</strong>
                        <span className="block sm:inline ml-2"> {jobDataError}</span>
                        <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setJobDataError(null)}>
                            <XCircle className="h-6 w-6 text-red-500" />
                        </span>
                    </div>
                )}

                {/* Overall Loading & Error Messages (for applications and stats) */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin h-16 w-16 text-iti-primary mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Loading applicants and statistics...</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2"> {error}</span>
                        <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setError(null)}>
                            <XCircle className="h-6 w-6 text-red-500" />
                        </span>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {/* Statistics Cards */}
                        {stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Total Applicants Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <Users className="h-8 w-8 text-iti-primary mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
                                    <p className="text-gray-600 text-sm">Total Applicants</p>
                                </div>
                                {/* Applied + Reviewed Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <Info className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">
                                        {(stats.status_breakdown?.applied || 0) + (stats.status_breakdown?.reviewed || 0)}
                                    </p>
                                    <p className="text-gray-600 text-sm">Under Review</p>
                                </div>
                                {/* Interviewed Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <CalendarCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.status_breakdown?.interviewed || 0}</p>
                                    <p className="text-gray-600 text-sm">Interviewed</p>
                                </div>
                                {/* Hired Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.status_breakdown?.hired || 0}</p>
                                    <p className="text-gray-600 text-sm">Hired</p>
                                </div>
                                {/* Rejected Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.status_breakdown?.rejected || 0}</p>
                                    <p className="text-gray-600 text-sm">Rejected</p>
                                </div>
                                {/* Applications This Week Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.applications_this_week || 0}</p>
                                    <p className="text-gray-600 text-sm">This Week</p>
                                </div>
                                {/* Applications This Month Card */}
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <BarChart2 className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.applications_this_month || 0}</p>
                                    <p className="text-gray-600 text-sm">This Month</p>
                                </div>
                            </div>
                        )}

                        {/* Filter Buttons and Search Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            {/* Filter Tabs */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 flex-grow">
                                {['all', 'applied', 'reviewed', 'interviewed', 'hired', 'rejected'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`py-2 px-4 rounded-full text-sm font-semibold transition duration-200 
                                            ${activeFilter === filter 
                                                ? 'bg-iti-primary text-white shadow-md' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                        }
                                    >
                                        {filter === 'all' ? 'ALL' :
                                         filter === 'applied' ? 'APPLIED' :
                                         filter === 'reviewed' ? 'UNDER REVIEW' :
                                         filter === 'interviewed' ? 'INTERVIEWED' :
                                         filter === 'hired' ? 'HIRED' :
                                         filter === 'rejected' ? 'REJECTED' :
                                         ''}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative flex-grow">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search applicants by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iti-primary focus:border-transparent transition duration-200 shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsAdvancedFilterOpen(true)} 
                                    className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 shadow-sm flex items-center"
                                    title="Advanced Filters"
                                >
                                    <SlidersHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {filteredAndSearchedApplications.length === 0 ? ( // Use filteredAndSearchedApplications here
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative mb-6 shadow-md text-center">
                                <Info className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                                <strong className="font-bold block mb-2">No Applicants Found!</strong>
                                <span className="block">
                                    {activeFilter === 'all' && !searchQuery
                                        ? `There are no applications for ${jobTitle} yet.` 
                                        : `No applicants found matching your criteria for "${jobTitle}".`
                                    }
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAndSearchedApplications.map(app => ( // Map over filteredAndSearchedApplications
                                    <CompanyApplicationCard
                                        key={app.id}
                                        application={app}
                                        handleDownloadCV={handleDownloadCV}
                                        handleUpdateApplicationStatus={handleUpdateApplicationStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CompanyJobApplicationsPage;
