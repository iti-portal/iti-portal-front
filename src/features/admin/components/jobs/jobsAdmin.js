import React, { useEffect, useState } from "react";
import { Briefcase, Eye, Trash2 ,Clock, DollarSign, BarChart2, MapPin, CheckCircle, XCircle} from "lucide-react";
import Modal from "../../../../components/UI/Modal";
import Alert from "../../../../components/UI/Alert";import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function JobAdmin() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    location: "all",
    status: "all",
    jobType: "all",
    sortBy: ""
  });
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });





const MySwal = withReactContent(Swal);

const handleJobDetailsClick = (job) => {
  MySwal.fire({
    title: <strong>{job.title}</strong>,
    html: (
      <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Job Header */}
        <div className="flex items-start gap-4">
          <div className="bg-red-100 rounded-lg w-16 h-16 flex items-center justify-center text-red-600">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                job.status === 'open' ? 'bg-green-50 text-green-600' :
                job.status === 'closed' ? 'bg-red-50 text-red-600' :
                'bg-gray-50 text-gray-600'
              }`}>
                {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
             
            </div>
          </div>
        </div>

        {/* Job Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Job Type</p>
            <p className="text-sm font-medium">
              {job.job_type?.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="text-sm font-medium">
              {job.experience_level?.charAt(0).toUpperCase() + job.experience_level?.slice(1)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Salary Range</p>
            <p className="text-sm font-medium">
              {job.salary_min ? `$${job.salary_min.toLocaleString()}` : 'N/A'} - 
              {job.salary_max ? ` $${job.salary_max.toLocaleString()}` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="text-sm font-medium">
              {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
            <BarChart2 className="w-4 h-4 mr-2 text-red-700" />
            JOB DESCRIPTION
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {job.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-red-700" />
              REQUIREMENTS
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          </div>
        )}

        {/* Skills */}
        {job.job_skills?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">REQUIRED SKILLS</h4>
            <div className="flex flex-wrap gap-2">
              {job.job_skills.map((jobSkill) => (
                <span 
                  key={jobSkill.skill.id} 
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    jobSkill.is_required ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {jobSkill.skill.name}
                  {jobSkill.is_required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </span>
              ))}
            </div>
            
          </div>
        )}

        {/* Application Stats */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">APPLICATIONS</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-500">Total</p>
              <p className="text-sm font-medium text-red-600">{job.applications_count || 0}</p>
            </div>
           
          </div>
        </div>

        {/* Company Status Warning */}
        {job.company?.status === 'suspended' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-red-600">
              <span className="font-medium">Note:</span> This job is posted by a company that is currently suspended. 
              Proceed with caution when interacting with this listing.
            </p>
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
  const itemsPerPage = 10;

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const showPagination = filteredJobs.length > itemsPerPage;

  const handleDeleteJob = async (jobId) => {
    const jobToDelete = jobs.find(j => j.id === jobId);
    if (!jobToDelete) return;

    const deleteHandler = async () => {
      setDeletingId(jobId);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/company/jobs/${jobId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete job");
        }
        await fetchAllJobs();
        setNotification({ show: true, type: 'success', message: 'Job deleted successfully!' });
      } catch (error) {
        console.error("Delete error:", error);
        setNotification({ show: true, type: 'error', message: 'Failed to delete job' });
      } finally {
        setDeletingId(null);
      }
    };

    setConfirmModalContent({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the job "${jobToDelete.title}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteHandler();
        setConfirmModalOpen(false);
      }
    });
    setConfirmModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  async function fetchAllJobs() {
    try {
      setLoading(true);
      setError(null);
      
      let allJobs = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/jobs?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.data && data.data.data && Array.isArray(data.data.data)) {
          allJobs = [...allJobs, ...data.data.data];
          
          if (data.data.next_page_url) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          throw new Error("Invalid data structure received from API");
        }
      }
      
      setJobs(allJobs);
      setFilteredJobs(allJobs);
      
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Failed to load jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const applyFilters = () => {
    let result = [...jobs];

    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.location !== "all") {
      result = result.filter(job => 
        filters.location === "remote" ? job.is_remote : !job.is_remote
      );
    }

    if (filters.status !== "all") {
      result = result.filter(job => job.status === filters.status);
    }

    if (filters.jobType !== "all") {
      result = result.filter(job => job.job_type === filters.jobType);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "title_asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title_desc":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "company":
          result.sort((a, b) => {
            const aCompany = a.company?.email || '';
            const bCompany = b.company?.email || '';
            return aCompany.localeCompare(bCompany);
          });
          break;
        case "salary":
          result.sort((a, b) => {
            const aSalary = parseFloat(a.salary_max) || 0;
            const bSalary = parseFloat(b.salary_max) || 0;
            return bSalary - aSalary;
          });
          break;
        case "date":
          result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        default:
          break;
      }
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
      closed: "bg-gray-100 text-gray-700",
      expired: "bg-red-100 text-red-700",
      paused: "bg-orange-100 text-orange-700",
      suspended: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-700"
    };

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  const getJobTypeBadge = (type) => {
    const typeColors = {
      'full_time': "bg-blue-100 text-blue-700",
      'part_time': "bg-purple-100 text-purple-700",
      'contract': "bg-orange-100 text-orange-700",
      'internship': "bg-teal-100 text-teal-700",
      'freelance': "bg-pink-100 text-pink-700"
    };

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || "bg-gray-100 text-gray-700"}`}
      >
        {type ? type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ') : 'N/A'}
      </span>
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmModalContent.title}
      >
        <p>{confirmModalContent.message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmModalContent.onConfirm}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </Modal>

      <main className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Briefcase className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Jobs
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchAllJobs}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
            <div className="w-full space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Jobs Management</h2>

              </div>

              {/* Filters - Only shown when data is loaded */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="text"
                  placeholder="Search job titles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                />

                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-1/3"
                >
                  <option value="all">All Locations</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                </select>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-1/3"
                >
                  <option value="all">All Statuses</option>
                  <option value="closed">Closed</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>

                <select
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-1/3"
                >
                  <option value="all">All Job Types</option>
                  <option value="part_time">Part Time</option>
                  <option value="full_time">Full Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>

                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-1/3"
                >
                  <option value="">Sort By</option>
                  <option value="title_asc">Job Title (A-Z)</option>
                  <option value="title_desc">Job Title (Z-A)</option>
                  <option value="company">Company Name</option>
                  <option value="salary">Salary (High to Low)</option>
                  <option value="date">Date Posted (Newest First)</option>
                </select>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                {/* Table */}
                <div className="min-w-[1000px] w-full">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="text-gray-700">
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">#</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Job Title</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Company</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Location</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Job Type</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Salary</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Status</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Posted Date</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedJobs.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-6 text-center text-gray-400 text-sm">
                            No jobs found. {searchTerm ? "Try a different search term." : ""}
                          </td>
                        </tr>
                      ) : (
                        paginatedJobs.map((job, index) => (
                          <tr key={job.id || index} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="font-medium text-gray-600">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="font-medium text-gray-900">
                                <div className="truncate max-w-[150px] sm:max-w-[200px]" title={job.title}>
                                  {job.title || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                <div className="truncate max-w-[120px] sm:max-w-[160px]" title={job.company?.email || 'N/A'}>
                                  {job.company?.email || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                {job.is_remote ? 'Remote' : 'On-site'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              {getJobTypeBadge(job.job_type)}
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600 font-medium">
                                {job.salary_min && job.salary_max 
                                  ? `$${parseFloat(job.salary_min).toLocaleString()} - $${parseFloat(job.salary_max).toLocaleString()}` 
                                  : 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              {getStatusBadge(job.status)}
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                {job.created_at ? formatDate(job.created_at) : 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="flex items-center justify-center gap-2.5">
                                <button 
                                  className="group relative flex items-center justify-center h-8 w-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                                  onClick={() => console.log('View job:', job.id)}
                                >
                                  <Eye className="w-4 h-4"
                                  onClick={() => handleJobDetailsClick(job)}
                                  />
                                </button>
                                <button 
                                  className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                                  onClick={() => handleDeleteJob(job.id)}
                                >
                                  {deletingId === job.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {showPagination && (
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
                    <div>
                      <span className="hidden sm:inline">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} results
                      </span>
                      <span className="sm:hidden">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const start = Math.max(0, Math.min(currentPage - 3, totalPages - 5));
                        const pageIndex = start + i;
                        
                        if (pageIndex >= 0 && pageIndex < totalPages) {
                          return (
                            <button
                              key={pageIndex}
                              className={`px-3 py-1 rounded ${
                                currentPage === pageIndex + 1
                                  ? 'bg-red-700 text-white'
                                  : 'border border-gray-300 bg-white hover:bg-gray-100'
                              }`}
                              onClick={() => handlePageChange(pageIndex + 1)}
                            >
                              {pageIndex + 1}
                            </button>
                          );
                        }
                        return null;
                      }).filter(Boolean)}
                      
                      <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default JobAdmin;