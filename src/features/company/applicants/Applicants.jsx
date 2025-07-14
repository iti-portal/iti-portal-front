import React, { useEffect, useState } from "react";
import { Briefcase, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const navigate = useNavigate();

  const itemsPerPage = 6;

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get("http://127.0.0.1:8000/api/company/applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setApplications(response.data.data || []);
      setFilteredApplications(response.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || "Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const getUniqueJobTitles = () => {
    const jobTitles = applications
      .map(app => app.job?.title)
      .filter((title, index, self) => title && self.indexOf(title) === index);
    
    return jobTitles.sort();
  };

  const handleDownloadCV = async (application) => {
    if (!application.cv_path) {
      alert('No Resume Available - This applicant has not uploaded a resume yet.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!application.cv_downloaded_at) {
        await axios.get(
          `http://127.0.0.1:8000/api/job-applications/${application.id}/download-cv`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
              
            }
          }
        );
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/job-applications/${application.id}/download-cv`,
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          },
          responseType: 'blob'
        }
      );

      const contentDisposition = response.headers['content-disposition'];
      let filename = `CV_${application.user?.profile?.first_name || 'applicant'}_${application.user?.profile?.last_name || ''}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
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
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      fetchApplications();
    } catch (err) {
      console.error("Download error:", err);
      alert(err.response?.data?.message || 'Failed to download resume');
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, statusFilter, jobFilter, studentStatusFilter);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    applyFilters(searchTerm, status, jobFilter, studentStatusFilter);
  };

  const handleJobFilterChange = (e) => {
    const jobTitle = e.target.value;
    setJobFilter(jobTitle);
    applyFilters(searchTerm, statusFilter, jobTitle, studentStatusFilter);
  };

  const handleStudentStatusFilterChange = (e) => {
    const status = e.target.value;
    setStudentStatusFilter(status);
    applyFilters(searchTerm, statusFilter, jobFilter, status);
  };

  const applyFilters = (term, status, jobTitle, studentStatus) => {
    let filtered = [...applications];
    
    // Filter by search term (applicant name)
    if (term) {
      filtered = filtered.filter(application => {
        const fullName = `${application.user?.profile?.first_name || ''} ${application.user?.profile?.last_name || ''}`.toLowerCase();
        return fullName.includes(term);
      });
    }
    
    // Filter by application status
    if (status !== "all") {
      filtered = filtered.filter(application => application.status === status);
    }
    
    // Filter by job title
    if (jobTitle !== "all") {
      filtered = filtered.filter(application => application.job?.title === jobTitle);
    }
    
    // Filter by student status
    if (studentStatus !== "all") {
      filtered = filtered.filter(application => application.user?.profile?.student_status === studentStatus);
    }
    
    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/company/applications/${applicationId}`);
  };

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      interviewed: "bg-yellow-100 text-yellow-700",
      applied: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      hired: "bg-blue-100 text-blue-700",
      reviewed: "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Briefcase className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Applications
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchApplications}
                className="bg-[#901b20] hover:bg-[#a83236] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
            <div className="w-full space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Job Applications Management</h2>
              </div>

              {/* Filters */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input - Full width on mobile, then normal */}
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="text"
                  placeholder="Search by applicant name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="applied">Applied</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>

                <select
                  value={jobFilter}
                  onChange={handleJobFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={loading || applications.length === 0}
                >
                  <option value="all">All Jobs</option>
                  {loading ? (
                    <option disabled>Loading jobs...</option>
                  ) : applications.length === 0 ? (
                    <option disabled>No jobs available</option>
                  ) : (
                    getUniqueJobTitles().map((title, index) => (
                      <option key={index} value={title}>
                        {title}
                      </option>
                    ))
                  )}
                </select>

                <select
                  value={studentStatusFilter}
                  onChange={handleStudentStatusFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Student Statuses</option>
                  <option value="current">Current Student</option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                {/* Table */}
                <div className="min-w-[800px] w-full">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="text-gray-700">
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">#</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Applicant</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Contact</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Job Title</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Applied Date</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Status</th>
                        <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-400 text-sm">
                            {searchTerm || statusFilter !== "all" || jobFilter !== "all" || studentStatusFilter !== "all"
                              ? "No applications match your filters." 
                              : "No applications found."}
                          </td>
                        </tr>
                      ) : (
                        paginatedApplications.map((application, index) => (
                          <tr key={application.id} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="font-medium text-gray-600">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="font-medium text-gray-900">
                                {`${application.user?.profile?.first_name || ''} ${application.user?.profile?.last_name || ''}`}
                                <div className="text-xs text-gray-500">
                                  {application.user?.profile?.student_status === 'graduate' ? 'Graduate' : 'Current Student'}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                {application.user?.profile?.phone || 'No phone'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                {application.job?.title || 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="text-gray-600">
                                {application.created_at ? formatDate(application.created_at) : 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              {getStatusBadge(application.status)}
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              <div className="flex items-center justify-center gap-2">
                            <button 
                              className="group relative flex items-center justify-center h-8 w-8 rounded-lg hover:text-white transition-all duration-200 shadow-sm
                                bg-blue-50 text-blue-600 hover:bg-blue-600"
                              onClick={() => navigate(`/company/dashboard/manage-jobs/${application.job_id}/applications/${application.id}`)}
                              title="View application details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                                {/* <button 
                                  className={`group relative flex items-center justify-center h-8 w-8 rounded-lg hover:text-white transition-all duration-200 shadow-sm
                                    ${application.cv_path ? 'bg-green-50 text-green-600 hover:bg-green-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                  onClick={() => application.cv_path && handleDownloadCV(application)}
                                  disabled={!application.cv_path}
                                  title={application.cv_path ? "Download CV" : "No CV available"}
                                >
                                  <Download className="w-4 h-4" />
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredApplications.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
                    <div>
                      <span className="hidden sm:inline">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} results
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
                        let pageToShow;
                        if (totalPages <= 5) {
                          pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                          pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageToShow = totalPages - 4 + i;
                        } else {
                          pageToShow = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageToShow}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageToShow
                                ? 'bg-[#901b20] text-white'
                                : 'border border-gray-300 bg-white hover:bg-gray-100'
                            }`}
                            onClick={() => handlePageChange(pageToShow)}
                          >
                            {pageToShow}
                          </button>
                        );
                      })}
                      
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

export default CompanyApplications;