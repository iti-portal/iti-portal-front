import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import { 
    Loader2, XCircle, Users, Briefcase, Clock, CalendarCheck, 
    Search, Info, CheckCircle, ChevronLeft, ChevronRight, Building2,
    User, FileText, Mail, Calendar, Filter, RefreshCw 
} from 'lucide-react'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const AdminApplicationsPage = () => {
    const navigate = useNavigate();


     const handleApplicationDetailsClick = (application) => {
    MySwal.fire({
      title: <strong>Application Details</strong>,
      html: (
        <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 rounded-lg w-16 h-16 flex items-center justify-center text-red-600">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">
                {application.user?.profile?.first_name || 'N/A'} {application.user?.profile?.last_name || ''}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  application.status === 'approved' ? 'bg-green-50 text-green-600' :
                  application.status === 'rejected' ? 'bg-red-50 text-red-600' :
                  application.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                </span>
                <span className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Applied {new Date(application.applied_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">JOB INFORMATION</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mt-1">
                {application.job?.job_type
                  ? application.job.job_type
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'N/A'} • {application.job?.experience_level
                  ? application.job.experience_level.charAt(0).toUpperCase() + application.job.experience_level.slice(1)
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Program</p>
              <p className="text-sm font-medium">
                {application.user?.profile?.program?.toUpperCase() || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Track</p>
              <p className="text-sm font-medium">
                {application.user?.profile?.track || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Student Status</p>
              <p className="text-sm font-medium">
                {application.user?.profile?.student_status?.charAt(0).toUpperCase() + 
                 application.user?.profile?.student_status?.slice(1) || 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">CONTACT INFORMATION</h4>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-700">
                  {application.user?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-700">
                  {application.user?.profile?.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">LinkedIn</p>
                <p className="text-sm text-gray-700">
                  {application.user?.profile?.linkedin ? (
                    <a href={application.user.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                      View Profile
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">GitHub</p>
                <p className="text-sm text-gray-700">
                  {application.user?.profile?.github ? (
                    <a href={application.user.profile.github} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                      View Profile
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-red-700" />
              COVER LETTER
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {application.cover_letter || 'No cover letter provided'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">APPLICATION STATUS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-500">Status</p>
                <p className="text-sm font-medium text-red-600">
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'N/A'}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-500">Reviewed</p>
                <p className="text-sm font-medium text-red-600">
                  {application.is_reviewed ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-500">Profile Viewed</p>
                <p className="text-sm font-medium text-red-600">
                  {application.profile_viewed_at ? new Date(application.profile_viewed_at).toLocaleDateString() : 'No'}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-500">CV Downloaded</p>
                <p className="text-sm font-medium text-red-600">
                  {application.cv_downloaded_at ? new Date(application.cv_downloaded_at).toLocaleDateString() : 'No'}
                </p>
              </div>
            </div>
          </div>

          {application.company_notes && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-red-700" />
                COMPANY NOTES
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {application.company_notes}
                </p>
              </div>
            </div>
          )}
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
  };

    const [applications, setApplications] = useState([]); 
    const [stats, setStats] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isGridLoading, setIsGridLoading] = useState(false); // New state for grid loading
    const [error, setError] = useState(null); 

    const [activeFilter, setActiveFilter] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState(''); 

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [isConfirmModal, setIsConfirmModal] = useState(false);

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
        if (modalAction) modalAction();
        closeModal();
    }, [modalAction, closeModal]);

    const fetchApplications = useCallback(async (page = 1, filter = activeFilter, query = searchQuery, isInitialLoad = false) => {
        // Set appropriate loading state
        if (isInitialLoad) {
            setIsLoading(true);
        } else {
            setIsGridLoading(true);
        }
        setError(null); 

        const token = localStorage.getItem('token');
        if (!token) {
            openModal('Authentication Error', 'Please log in again.', false, () => navigate('/login'));
            setIsLoading(false);
            setIsGridLoading(false);
            return;
        }

        try {
            const params = {
                page,
                per_page: itemsPerPage,
                _t: Date.now()
            };

            if (filter !== 'all') params.status = filter;
            if (query) params.search = query; 

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/applications`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params
            });

            if (response.data.success && response.data.data?.applications) { 
                setApplications(response.data.data.applications);
                setTotalPages(response.data.data.pagination.last_page); 
                setTotalItems(response.data.data.pagination.total);
            } else {
                setApplications([]);
                setTotalPages(1); 
                setTotalItems(0);
                setError('Failed to fetch applications.');
            }

        } catch (err) {
            if (err.response?.status === 401) {
                openModal('Session Expired', 'Please log in again.', false, () => navigate('/login'));
            } else if (err.response?.status === 404) {
                setApplications([]); 
                setTotalPages(1);
                setTotalItems(0);
            } else {
                setError(err.response?.data?.message || 'An error occurred while fetching applications.');
            }
        } finally {
            setIsLoading(false);
            setIsGridLoading(false);
        }
    }, [navigate, openModal]); 

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/applications/statistics`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { _t: Date.now() }
            });

            if (response.data.success && response.data.data) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);

    // Initial load and when filter/search changes
    useEffect(() => {
        // Reset to page 1 when filter or search changes
        setCurrentPage(1);
        fetchApplications(1, activeFilter, searchQuery, true); // Mark as initial load
        fetchStats();
    }, [activeFilter, searchQuery, fetchApplications, fetchStats]);

    // When page changes
    useEffect(() => {
        if (currentPage !== 1) {
            fetchApplications(currentPage, activeFilter, searchQuery, false); // Not initial load
        }
    }, [currentPage, activeFilter, searchQuery, fetchApplications]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

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

    const StatusBadge = ({ status }) => {
        const statusColors = {
            applied: "bg-blue-100 text-blue-800",
            reviewed: "bg-purple-100 text-purple-800",
            interviewed: "bg-indigo-100 text-indigo-800",
            hired: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800",
            withdrawn: "bg-gray-100 text-gray-800"
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                statusColors[status] || "bg-gray-100 text-gray-800"
            }`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
        );
    };

    const ProgramBadge = ({ program }) => {
        const programColors = {
            itp: "bg-red-100 text-red-800",
            ptp: "bg-purple-100 text-purple-800",
            dip: "bg-green-100 text-green-800",
            other: "bg-gray-100 text-gray-800"
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                programColors[program] || "bg-gray-100 text-gray-800"
            }`}>
                {program ? program.toUpperCase() : 'N/A'}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 ">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Briefcase className="mr-3 h-6 w-6 text-red-500" />
                            Applications Management
                        </h2>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="animate-spin h-12 w-12 text-red-500 mb-4" />
                                <p className="text-gray-600">Loading applications data...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                        <button 
                                            onClick={() => {
                                                setCurrentPage(1);
                                                fetchApplications(1, activeFilter, searchQuery, true);
                                            }}
                                            className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                                        >
                                            <RefreshCw className="mr-1 h-4 w-4" />
                                            Try again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {stats && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                                                        <Users className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Total Applications</p>
                                                        <p className="text-2xl font-semibold text-gray-900">{stats.total_applications || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                                        <Clock className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Under Review</p>
                                                        <p className="text-2xl font-semibold text-gray-900">
                                                            {(stats.status_breakdown?.applied || 0) + (stats.status_breakdown?.reviewed || 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                                        <CalendarCheck className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Interviews</p>
                                                        <p className="text-2xl font-semibold text-gray-900">{stats.status_breakdown?.interviewed || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                                        <CheckCircle className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Hired</p>
                                                        <p className="text-2xl font-semibold text-gray-900">{stats.status_breakdown?.hired || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {stats.top_companies_by_applications?.length > 0 && (
                                            <div className="bg-white p-5 rounded-lg shadow border border-gray-200 mb-8">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                    <Building2 className="mr-2 h-5 w-5 text-red-500" />
                                                    Top Companies by Applications
                                                </h3>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {stats.top_companies_by_applications.map((company, index) => (
                                                                <tr key={index} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.company_name || 'N/A'}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.applications_count || 0}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.company_email || 'N/A'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'applied', 'reviewed', 'interviewed', 'hired', 'rejected'].map(filter => (
                                            <button
                                                key={filter}
                                                onClick={() => handleFilterChange(filter)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    activeFilter === filter 
                                                        ? 'bg-red-600 text-white shadow-sm' 
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                }`}
                                            >
                                                {filter === 'all' ? 'All' :
                                                 filter === 'applied' ? 'Applied' :
                                                 filter === 'reviewed' ? 'Reviewed' :
                                                 filter === 'interviewed' ? 'Interview' :
                                                 filter === 'hired' ? 'Hired' :
                                                 filter === 'rejected' ? 'Rejected' :
                                                 ''}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative w-full sm:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search applications..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Applications Grid Section with Partial Loading */}
                                <div className="relative">
                                    {isGridLoading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="animate-spin h-8 w-8 text-red-500 mb-2" />
                                                <p className="text-sm text-gray-600">Loading applications...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {applications.length === 0 ? (
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <Info className="h-5 w-5 text-yellow-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        No applications found matching your criteria.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {applications.map(application => (
                                                <div 
                                                    key={application.id}
                                                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                                                >
                                                    <div className="p-5">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg w-12 h-12 flex items-center justify-center text-red-600">
                                                                    <User className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                                    {application.user?.profile?.first_name || 'N/A'} {application.user?.profile?.last_name || ''}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                                    <span className="truncate">{application.user?.email || 'N/A'}</span>
                                                                </p>
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    <StatusBadge status={application.status} />
                                                                    <ProgramBadge program={application.user?.profile?.program} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 space-y-2">
                                                            <div className="flex items-center text-sm text-gray-700">
                                                                <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                                                                <span className="truncate">{application.job?.title || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <Calendar className="flex-shrink-0 mr-1.5 h-3 w-3" />
                                                                <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">

                                                            <button
                                                               onClick={() => {handleApplicationDetailsClick(application)}}
                                                                className="text-sm font-medium text-red-600 hover:text-red-500"
                                                            >
                                                                View details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-8 px-4">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                                                    <span className="font-medium">{totalItems}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                    {getPageNumbers().map(pageNumber => (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                currentPage === pageNumber
                                                                    ? 'z-10 bg-red-700 border-red-500 text-white'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden sm:max-w-sm sm:w-full">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{modalTitle}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{modalMessage}</p>
                            </div>
                        </div>
                        <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end space-x-3">
                            {isConfirmModal && (
                                <button
                                    onClick={closeModal}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleModalConfirm}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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