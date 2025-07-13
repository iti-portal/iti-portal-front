import React, { useEffect, useState, useCallback, useRef } from "react";
import { Briefcase, Eye, ChevronDown, ChevronUp, Search, RefreshCw, Filter, User, FileText, Clock, Mail, Calendar } from "lucide-react";
import Alert from "../../../../components/UI/Alert";

function AdminApplications() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    program: "all",
    track: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const observer = useRef();
  const [lastFilteredLength, setLastFilteredLength] = useState(0);
  const [networkRetryCount, setNetworkRetryCount] = useState(0);

  const itemsPerPage = 10;

  const applyFilters = useCallback((applications) => {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.trim() !== '');
    
    const filtered = applications.filter(application => {
      // Enhanced search term filter that handles multiple words
      const matchesSearch = searchTerms.length === 0 || 
        searchTerms.every(term => 
          (application.user?.profile?.first_name?.toLowerCase().includes(term) ||
          application.user?.profile?.last_name?.toLowerCase().includes(term) ||
          application.user?.email?.toLowerCase().includes(term) ||
          application.job?.title?.toLowerCase().includes(term) ||
          application.status?.toLowerCase().includes(term) ||
          (application.user?.profile?.program?.toLowerCase().includes(term)) ||
          (application.user?.profile?.track?.toLowerCase().includes(term))
        ));

      // Status filter
      const matchesStatus = filters.status === "all" || 
        application.status === filters.status;

      // Program filter
      const matchesProgram = filters.program === "all" || 
        application.user?.profile?.program === filters.program;

      // Track filter
      const matchesTrack = filters.track === "all" || 
        application.user?.profile?.track === filters.track;

      return matchesSearch && matchesStatus && matchesProgram && matchesTrack;
    });

    // Check if filtering resulted in the same number of items but with different filters
    if (filtered.length === lastFilteredLength && filtered.length > 0 && 
        (searchTerm !== "" || filters.status !== "all" || filters.program !== "all" || filters.track !== "all")) {
      setNotification({
        show: true,
        type: 'info',
        message: 'No changes in results with current filters. Try different criteria.'
      });
    }
    
    setLastFilteredLength(filtered.length);
    return filtered;
  }, [searchTerm, filters, lastFilteredLength]);

  const fetchApplications = useCallback(async (pageNum, reset = false) => {
    try {
      if (pageNum === 1 || reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const queryParams = new URLSearchParams({
        page: pageNum,
        per_page: itemsPerPage,
      });

      const response = await fetch(`http://localhost:8000/api/admin/applications?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data && Array.isArray(data.data.applications)) {
        if (pageNum === 1 || reset) {
          setAllApplications(data.data.applications);
          setPage(1);
        } else {
          setAllApplications(prev => [...prev, ...data.data.applications]);
        }
        
        setHasMore(data.data.pagination.current_page < data.data.pagination.last_page);
        setNetworkRetryCount(0);
      } else {
        throw new Error("Invalid data structure received from API");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setNetworkRetryCount(prev => prev + 1);
        
        if (networkRetryCount < 3) {
          setTimeout(() => fetchApplications(pageNum, reset), 1000 * networkRetryCount);
          return;
        }
        
        setError("Network connection lost. Please check your internet and try again.");
        setNotification({
          show: true,
          type: 'error',
          message: 'Network connection lost. Please check your internet and try again.'
        });
      } else if (error.name === 'AbortError') {
        setError("Request timed out. Please try again.");
        setNotification({
          show: true,
          type: 'error',
          message: 'Request timed out. Please try again.'
        });
      } else {
        setError(error.message);
        setNotification({
          show: true,
          type: 'error',
          message: error.message
        });
      }
      
      if (pageNum > 1) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, networkRetryCount]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (allApplications.length > 0) {
        const filtered = applyFilters(allApplications);
        setFilteredApplications(filtered);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [allApplications, applyFilters]);

  useEffect(() => {
    fetchApplications(1);
  }, [fetchApplications]);

  useEffect(() => {
    if (page > 1 && hasMore && !loadingMore) {
      fetchApplications(page);
    }
  }, [page, hasMore, loadingMore, fetchApplications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "all",
      program: "all",
      track: "all"
    });
    setPage(1);
    fetchApplications(1, true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      applied: "bg-red-100 text-red-700",
      reviewed: "bg-purple-100 text-purple-700",
      interviewed: "bg-indigo-100 text-indigo-700",
      hired: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
      withdrawn: "bg-gray-100 text-gray-700"
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  const ProgramBadge = ({ program }) => {
    const programColors = {
      itp: "bg-red-100 text-red-700",
      ptp: "bg-purple-100 text-purple-700",
      dip: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700"
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          programColors[program] || "bg-gray-100 text-gray-700"
        }`}
      >
        {program ? program.toUpperCase() : 'N/A'}
      </span>
    );
  };

  const lastApplicationRef = useCallback(node => {
    if (loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 0.5,
      rootMargin: '100px'
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  return (
    <div className="flex flex-col min-h-screen w-5/6 mx-auto">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <main className="flex-1 overflow-auto">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Briefcase className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error.includes('Network') ? 'Connection Error' : 'Error Loading Applications'}
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setNetworkRetryCount(0);
                  fetchApplications(1, true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border p-6">
            <div className="w-full space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="text-red-500" />
                  Applications Management
                </h2>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  Showing {filteredApplications.length} of {allApplications.length} applications
                  {hasMore && !loadingMore && ' (scroll to load more)'}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, email, job title, status..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={toggleFilters}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    title="Reset all filters"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Program</label>
                      <select
                        name="program"
                        value={filters.program}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="all">All Programs</option>
                        <option value="itp">ITP</option>
                        <option value="ptp">PTP</option>
                        <option value="dip">DIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Track</label>
                      <select
                        name="track"
                        value={filters.track}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="all">All Tracks</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Data Science">Data Science</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((application, index) => (
                  <div 
                    key={application.id || index}
                    ref={index === filteredApplications.length - 1 ? lastApplicationRef : null}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-white group hover:border-red-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl w-14 h-14 flex items-center justify-center text-red-600 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                          {application.user?.profile?.first_name || 'N/A'} {application.user?.profile?.last_name || ''}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
                          <Mail className="w-3 h-3" />
                          <span>{application.user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge status={application.status} />
                          <ProgramBadge program={application.user?.profile?.program} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="font-medium truncate">{application.job?.title || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Applied {formatDate(application.applied_at)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {application.documents?.length || 0} documents
                      </div>
                      <button
                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 group-hover:underline transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  <span className="ml-2">Loading more applications...</span>
                </div>
              )}

              {!hasMore && !loading && filteredApplications.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  No more applications to load
                </div>
              )}

              {!loading && filteredApplications.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="mb-4">
                    {searchTerm ? "No matches for your search criteria." : "No applications match your current filters."}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium block mx-auto transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminApplications;