// src/features/admin/pages/AdminApplicationsPage.jsx
// This page provides an administrative view for managing all job applications in the system,
// now with pagination, using the dedicated AdminApplicationCard component, refined error handling,
// a new section for Top Companies by Applications, and custom modal for alerts/confirmations.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';

// Importing the AdminApplicationCard component
import AdminApplicationCard from '../components/applications/AdminApplicationCard'; 

// Importing icons from lucide-react
import { 
    Loader2, XCircle, Users, Briefcase, Clock, CalendarCheck, 
    Search, Info, CheckCircle, ChevronLeft, ChevronRight, Building2 
} from 'lucide-react'; 

const AdminApplicationsPage = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]); 
    const [stats, setStats] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    const [activeFilter, setActiveFilter] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState(''); 

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Fixed items per page, matching backend default

    // Modal states for custom alerts/confirmations
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null); // Function to execute on confirm
    const [isConfirmModal, setIsConfirmModal] = useState(false); // True for confirmation, false for alert

    // Function to show the custom modal
    const openModal = useCallback((title, message, isConfirm = false, onConfirm = null) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsConfirmModal(isConfirm);
        setModalAction(() => onConfirm); // Store the callback
        setShowModal(true);
    }, []);

    // Function to close the custom modal
    const closeModal = useCallback(() => {
        setShowModal(false);
        setModalTitle('');
        setModalMessage('');
        setModalAction(null);
        setIsConfirmModal(false);
    }, []);

    // Function to handle modal confirmation
    const handleModalConfirm = useCallback(() => {
        if (modalAction) {
            modalAction(); // Execute the stored action
        }
        closeModal();
    }, [modalAction, closeModal]);

    // Function to fetch all job applications (Admin) and global statistics
    const fetchAllApplicationsAndStats = useCallback(async () => {
        setIsLoading(true);
        setError(null); 

        const token = localStorage.getItem('token');
        if (!token) {
            openModal('Authentication Error', 'Authentication token not found. Please log in again.', false, () => navigate('/login'));
            setIsLoading(false);
            return;
        }

        try {
            // Prepare parameters for applications API
            const applicationsParams = {
                page: currentPage,
                per_page: itemsPerPage,
                _t: Date.now() // Cache busting
            };

            // Add filters if active
            if (activeFilter !== 'all') {
                applicationsParams.status = activeFilter;
            }
            if (searchQuery) {
                applicationsParams.search = searchQuery; 
            }

            // 1. Fetch All Applications (Admin Endpoint)
            const applicationsResponse = await axios.get(`http://localhost:8000/api/admin/applications`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: applicationsParams
            });

            if (applicationsResponse.data.success && applicationsResponse.data.data && Array.isArray(applicationsResponse.data.data.applications)) { 
                setApplications(applicationsResponse.data.data.applications);
                setTotalPages(applicationsResponse.data.data.pagination.last_page); 
            } else {
                setApplications([]);
                setTotalPages(1); 
                setError(applicationsResponse.data.message || 'Failed to fetch all applications with unexpected data structure.');
            }

            // 2. Fetch Global Applications Statistics (Admin Endpoint)
            const statsUrl = `http://localhost:8000/api/admin/applications/statistics`; 
            const statsResponse = await axios.get(statsUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    _t: Date.now() 
                }
            });

            if (statsResponse.data.success && statsResponse.data.data) {
                setStats(statsResponse.data.data);
            } else {
                setStats(null);
                console.error(statsResponse.data.message || 'Failed to fetch global application statistics with unexpected data structure.');
            }

        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    openModal('Session Expired', 'Your session has expired. Please log in again.', false, () => navigate('/login'));
                } else if (err.response.status === 404) {
                    setError(null); 
                    setApplications([]); 
                    setTotalPages(1); 
                }
                else {
                    setError(err.response.data?.message || `Server error occurred: ${err.response.status}. Please try again.`);
                }
            } else if (err.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate, currentPage, activeFilter, searchQuery, openModal]); 

    // Fetch all applications and stats on component mount or when pagination/filter/search changes
    useEffect(() => {
        fetchAllApplicationsAndStats();
    }, [fetchAllApplicationsAndStats]); 

    // filteredAndSearchedApplications will now directly use the 'applications' state,
    // as filtering and searching is handled by the backend before pagination.
    const filteredAndSearchedApplications = useMemo(() => {
        return applications; 
    }, [applications]);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Generate page numbers for pagination control
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; 

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // Admin action handlers (will call backend PATCH/DELETE endpoints)
    const handleUpdateApplicationStatus = useCallback(async (applicationId, newStatus) => {
        openModal(
            'Confirm Status Change',
            `Are you sure you want to change this application's status to ${newStatus.toUpperCase()}?`,
            true,
            async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.patch(`http://localhost:8000/api/admin/applications/${applicationId}/status`, 
                        { status: newStatus }, 
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    if (response.data.success) {
                        openModal('Success', `Application status updated to ${newStatus.toUpperCase()} successfully!`);
                        fetchAllApplicationsAndStats(); 
                    } else {
                        openModal('Error', response.data.message || 'Failed to update application status.');
                    }
                } catch (err) {
                    openModal('Error', err.response?.data?.message || 'Error updating application status.');
                    console.error('Admin status update error:', err);
                }
            }
        );
    }, [fetchAllApplicationsAndStats, openModal]);

    const handleDeleteApplication = useCallback(async (applicationId) => {
        openModal(
            'Confirm Deletion',
            'Are you sure you want to permanently delete this application? This action cannot be undone.',
            true,
            async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.delete(`http://localhost:8000/api/admin/applications/${applicationId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        openModal('Success', 'Application deleted successfully!');
                        fetchAllApplicationsAndStats(); 
                    } else {
                        openModal('Error', response.data.message || 'Failed to delete application.');
                    }
                } catch (err) {
                    openModal('Error', err.response?.data?.message || 'Error deleting application.');
                    console.error('Admin delete application error:', err);
                }
            }
        );
    }, [fetchAllApplicationsAndStats, openModal]);

    return (
        <div className="min-h-screen  py-10">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-7xl">
                <h2 className="text-4xl font-extrabold bg-iti-gradient-text text-center mb-8 pb-4 border-b-2 border-gray-200">
                    Admin Dashboard: All Applications
                </h2>

                {/* Loading & Error Messages */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin h-16 w-16 text-iti-primary mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Loading all applications and global statistics...</p>
                    </div>
                )}
                {/* Display error ONLY if error state has a value */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2"> {error}</span>
                        <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setError(null)}>
                            <XCircle className="h-6 w-6 text-red-500" />
                        </span>
                    </div>
                )}

                {/* Show content only if not loading and no error */}
                {!isLoading && !error && ( 
                    <>
                        {/* Global Statistics Cards */}
                        {stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <Users className="h-8 w-8 text-iti-primary mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.total_applications || 0}</p>
                                    <p className="text-gray-600 text-sm">Total Applications</p>
                                </div>
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                    {/* Sum 'applied' and 'reviewed' for 'Under Review' */}
                                    <p className="text-3xl font-bold text-gray-900">
                                        {(stats.status_breakdown?.applied || 0) + (stats.status_breakdown?.reviewed || 0)}
                                    </p>
                                    <p className="text-gray-600 text-sm">Under Review</p>
                                </div>
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <CalendarCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.status_breakdown?.interviewed || 0}</p>
                                    <p className="text-gray-600 text-sm">Interviews Scheduled</p>
                                </div>
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-3xl font-bold text-gray-900">{stats.status_breakdown?.hired || 0}</p>
                                    <p className="text-gray-600 text-sm">Hired Applications</p>
                                </div>
                            </div>
                        )}

                        {/* Top Companies by Applications Section */}
                        {stats && stats.top_companies_by_applications && stats.top_companies_by_applications.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Building2 size={24} className="mr-2 text-iti-primary" /> Top Companies by Applications
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applications Count</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {stats.top_companies_by_applications.map((company, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {company.company_name || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                        {company.applications_count || 0}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                        {company.company_email || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                                        onClick={() => {
                                            setActiveFilter(filter);
                                            setCurrentPage(1); // Reset to first page on filter change
                                        }}
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

                            {/* Search Bar */}
                            <div className="relative flex-grow-0 w-full md:w-auto">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, job, or company..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // Reset to first page on search change
                                    }}
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iti-primary focus:border-transparent transition duration-200 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Applications List */}
                        {filteredAndSearchedApplications.length === 0 ? (
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative mb-6 shadow-md text-center">
                                <Info className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                                <strong className="font-bold block mb-2">No Applications Found!</strong>
                                <span className="block">No applications found matching your criteria.</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAndSearchedApplications.map(app => (
                                    <AdminApplicationCard 
                                        key={app.id} 
                                        application={app} 
                                        handleUpdateApplicationStatus={handleUpdateApplicationStatus}
                                        handleDeleteApplication={handleDeleteApplication}
                                        // handleDownloadCV={handleDownloadCV} // Removed from card props
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                {getPageNumbers().map(pageNumber => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-2 rounded-full font-semibold transition duration-200 
                                            ${currentPage === pageNumber 
                                                ? 'bg-iti-primary text-white shadow-md' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                        }
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Modal Component */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{modalTitle}</h3>
                        <p className="text-gray-700 mb-6">{modalMessage}</p>
                        <div className="flex justify-end space-x-3">
                            {isConfirmModal && (
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleModalConfirm}
                                className={`px-4 py-2 rounded-md transition duration-200 
                                    ${isConfirmModal ? 'bg-iti-primary text-white hover:bg-iti-primary-dark' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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

export default AdminApplicationsPage;
