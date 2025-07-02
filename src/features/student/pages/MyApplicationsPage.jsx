// src/features/student/pages/MyApplicationsPage.jsx
// This page displays the student's job applications dashboard with redesigned sections
// for Recent Applications Activity and Quick Resources, and added search functionality.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Importing the ApplicationCard component
import ApplicationCard from "../components/applications/ApplicationCard";       

// Importing icons from lucide-react (all necessary icons for new design)
import { 
    Loader2, XCircle, Info, ExternalLink, Briefcase, Clock, CalendarCheck, Award, 
    Search, Users, Calendar, BarChart2, CheckCircle, TrendingUp, 
    BookOpen, Lightbulb, GraduationCap, FileText, User 
} from 'lucide-react'; 

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]); // Stores all applications fetched from backend
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState(''); // New state for search input
    const navigate = useNavigate();

    // State for Recent Applications Activity
    const [recentApplicationsActivity, setRecentApplicationsActivity] = useState([]);

    // Dummy data for Quick Resources (replace with actual data if fetched from backend)
    const quickResources = [
        { name: 'Update My Profile', icon: User, link: '/student/profile/edit' },
        { name: 'View My Achievements', icon: Award, link: '/student/achievements' },
        { name: 'Interview Preparation Tips', icon: Lightbulb, link: '/articles/interview-tips' }, 
        { name: 'Salary Negotiation Guide', icon: FileText, link: '/articles/salary-negotiation' }, 
    ];

    // Function to fetch applications from the API
    const fetchApplications = useCallback(async () => {
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
            // Fetch all applications for the logged-in student (no filter/search in API call)
            const response = await axios.get('http://localhost:8000/api/my-applications?include_match_score=true', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const fetchedApplications = response.data.data.applications; 
                if (Array.isArray(fetchedApplications)) {
                    setApplications(fetchedApplications);
                    // Populate recentApplicationsActivity: sort by created_at and take top 5
                    const sortedRecent = [...fetchedApplications]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 5);
                    setRecentApplicationsActivity(sortedRecent);
                } else {
                    setApplications([]); 
                    setRecentApplicationsActivity([]);
                }
            } else {
                setError(response.data.message || 'Failed to fetch applications due to a server issue.');
                setApplications([]); // Ensure applications are empty on error
                setRecentApplicationsActivity([]);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                    navigate('/login'); 
                } else if (err.response.status === 404) {
                    setError('No applications found for your account.');
                    setApplications([]); 
                    setRecentApplicationsActivity([]);
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
    }, [navigate]);

    // Fetch applications on component mount
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Helper function to get status badge styling for recent activity
    const getStatusBadgeForRecentActivity = (status) => {
        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-800';
        let displayText = status ? status.replace(/_/g, ' ').toUpperCase() : 'N/A';

        switch (status) {
            case 'applied':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                break;
            case 'reviewed': 
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                displayText = 'UNDER REVIEW'; 
                break;
            case 'interviewed': 
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                displayText = 'INTERVIEW SCHEDULED'; 
                break;
            case 'hired': 
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                displayText = 'ACCEPTED'; 
                break;
            case 'rejected':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                break;
            default:
                break;
        }
        return (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center ${bgColor} ${textColor}`}>
                {displayText}
            </span>
        );
    };

    // Calculate statistics and filter/search applications based on activeFilter and searchQuery
    const { totalApplications, pendingReview, interviewScheduled, offersReceived, filteredApplications } = useMemo(() => {
        let total = applications.length;
        let pending = 0; 
        let interview = 0; 
        let offers = 0;    

        // Calculate stats for all applications first
        applications.forEach(app => {
            if (app.status === 'applied' || app.status === 'reviewed') {
                pending++;
            }
            if (app.status === 'interviewed') {
                interview++;
            }
            if (app.status === 'hired') { 
                offers++;
            }
        });

        // Apply filtering and searching
        const filtered = applications.filter(app => {
            // Apply status filter
            const statusMatch = activeFilter === 'all' || app.status === activeFilter;

            // Apply search filter on job title (case-insensitive)
            const jobTitle = app.job?.title || '';
            const searchMatch = jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });

        return {
            totalApplications: total,
            pendingReview: pending,
            interviewScheduled: interview,
            offersReceived: offers,
            filteredApplications: filtered
        };
    }, [applications, activeFilter, searchQuery]); 

    // Function to handle CV download using axios (passed to ApplicationCard)
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

    // Function to handle withdrawing an application (passed to ApplicationCard)
    const handleWithdrawApplication = useCallback(async (applicationId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) {
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
            const response = await axios.delete(`http://localhost:8000/api/job-applications/${applicationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                fetchApplications(); // Re-fetch to update the list and stats
                alert('Application withdrawn successfully!'); 
            } else {
                setError(response.data.message || 'Failed to withdraw application.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error withdrawing application. Please try again.');
            console.error('Withdraw application error:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchApplications, navigate]); 

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-7xl"> {/* Increased max-width */}
                <h2 className="text-4xl font-extrabold bg-iti-gradient-text text-center mb-8 pb-4 border-b-2 border-gray-200">
                    My Job Applications
                </h2>

                {/* Loading & Error Messages */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin h-16 w-16 text-iti-primary mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Loading your applications and dashboard...</p>
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
                        {/* Top Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                <Briefcase className="h-8 w-8 text-iti-primary mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
                                <p className="text-gray-600 text-sm">Total Applications</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{pendingReview}</p>
                                <p className="text-gray-600 text-sm">Pending Review</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                <CalendarCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{interviewScheduled}</p>
                                <p className="text-gray-600 text-sm">Interviews Scheduled</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{offersReceived}</p>
                                <p className="text-gray-600 text-sm">Offers Received</p>
                            </div>
                        </div>

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
                                         filter === 'interviewed' ? 'INTERVIEW SCHEDULED' :
                                         filter === 'hired' ? 'ACCEPTED' :
                                         filter === 'rejected' ? 'REJECTED' :
                                         ''}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="relative flex-grow-0 w-full md:w-auto">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by job title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iti-primary focus:border-transparent transition duration-200 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Main Content Area (Applications List & Side Panels) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Changed gap to 8 */}
                            {/* Applications List (2/3 width on large screens) */}
                            <div className="lg:col-span-2">
                                {filteredApplications.length === 0 ? (
                                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative mb-6 shadow-md text-center">
                                        <Info className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                                        <strong className="font-bold block mb-2">No Applications Found!</strong>
                                        <span className="block mb-3">
                                            {activeFilter === 'all' && !searchQuery
                                                ? 'You have not submitted any job applications yet.' 
                                                : `No applications found matching your criteria.`
                                            }
                                        </span>
                                        <Link 
                                            to="/jobs" 
                                            className="inline-flex items-center bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Browse Jobs
                                            <ExternalLink size={18} className="ml-2" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredApplications.map((app) => (
                                            // Make sure ApplicationCard is imported correctly and accepts these props
                                            <ApplicationCard 
                                                key={app.id} 
                                                application={app} 
                                                handleDownloadCV={handleDownloadCV} 
                                                handleWithdrawApplication={handleWithdrawApplication} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Side Panels (1/3 width on large screens) */}
                            <div className="lg:col-span-1 space-y-8"> {/* Changed space-y to 8 */}
                                {/* Recent Applications Activity */}
                                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg shadow-xl border border-blue-100">
                                    <h3 className="text-xl font-extrabold text-blue-700 mb-4 flex items-center border-b pb-2 border-blue-300">
                                        <Clock size={22} className="mr-3 text-blue-500" /> Recent Activity
                                    </h3>
                                    {recentApplicationsActivity.length > 0 ? ( 
                                        <ul className="space-y-3">
                                            {recentApplicationsActivity.map((app) => (
                                                <li key={app.id} className="flex items-start text-gray-800 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                                                    <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                                                    <div>
                                                        <p className="font-semibold text-base">{app.job?.title || 'N/A'}</p>
                                                        <p className="text-sm flex items-center">
                                                            Status: {getStatusBadgeForRecentActivity(app.status)}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-0.5">Applied On: {new Date(app.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600 text-sm">No recent application activity.</p>
                                    )}
                                </div>

                                {/* Quick Resources */}
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-xl border border-red-200">
                                    <h3 className="text-xl font-extrabold text-red-700 mb-4 flex items-center border-b pb-2 border-red-300">
                                        <BookOpen size={22} className="mr-3 text-red-500" /> Quick Resources
                                    </h3>
                                    <ul className="space-y-3">
                                        {quickResources.map((resource, index) => (
                                            <li key={index}>
                                                <Link 
                                                    to={resource.link} 
                                                    className="flex items-center text-red-600 hover:text-red-800 hover:underline transition duration-200 p-2 rounded-md hover:bg-red-50"
                                                >
                                                    {React.createElement(resource.icon, { size: 18, className: "mr-2 flex-shrink-0" })}
                                                    <span className="font-medium">{resource.name}</span>
                                                    {resource.link.startsWith('http') && <ExternalLink size={14} className="ml-2 text-red-300 flex-shrink-0" />}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
