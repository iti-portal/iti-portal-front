import React, { useEffect, useState } from "react";
import AdminSidebar from '../layout/AdminSidebar';
import AdminNavbar from '../layout/AdminNavbar';
import { Briefcase, Clock, Check, X, User, Mail, Phone, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/UI/Modal";
import Alert from "../../../../components/UI/Alert";

function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [copyApplications, setCopyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const [processingId, setProcessingId] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch("http://127.0.0.1:8000/api/company/applications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data.data);       
      setCopyApplications(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (applicationId, status) => {
    const applicationToUpdate = applications.find(a => a.id === applicationId);
    if (!applicationToUpdate) return;

    const handleUpdate = async () => {
      setProcessingId(applicationId);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/company/applications/${applicationId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          throw new Error("Failed to update application status");
        }

        await fetchApplications();
        setNotification({ show: true, type: 'success', message: `Application ${status} successfully!` });
      } catch (error) {
        console.error("Update error:", error);
        setNotification({ show: true, type: 'error', message: 'Failed to update application status' });
      } finally {
        setProcessingId(null);
      }
    };

    setConfirmModalContent({
      title: 'Confirm Status Update',
      message: `Are you sure you want to mark this application as ${status}?`,
      onConfirm: () => {
        handleUpdate();
        setConfirmModalOpen(false);
      }
    });
    setConfirmModalOpen(true);
  };

  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const showPagination = applications.length > itemsPerPage;

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
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      hired: "bg-blue-100 text-blue-700"
    };

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filterData = copyApplications.filter((application) =>
        application.job_seeker?.name.toLowerCase().includes(term.toLowerCase()) ||
        application.job?.title.toLowerCase().includes(term.toLowerCase())
      );
      setApplications(filterData);
      setCurrentPage(1);
    } else {
      setApplications(copyApplications);
    }
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSortOption(selected);

    const sorted = [...applications];

    if (selected === "name_asc") {
      sorted.sort((a, b) => (a.job_seeker?.name || '').localeCompare(b.job_seeker?.name || ''));
    } else if (selected === "name_desc") {
      sorted.sort((a, b) => (b.job_seeker?.name || '').localeCompare(a.job_seeker?.name || ''));
    } else if (selected === "job_title") {
      sorted.sort((a, b) => (a.job?.title || '').localeCompare(b.job?.title || ''));
    } else if (selected === "date_asc") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (selected === "date_desc") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selected === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    }

    setApplications(sorted);
    setCurrentPage(1);
  };

  const displayApplications = showPagination ? paginatedApplications : applications;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar/>
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
            className="px-4 py-2 rounded-lg text-white bg-[#901b20] hover:bg-[#a83236] transition-colors"
          >
            Confirm
          </button>
        </div>
      </Modal>
   
      <div className="flex flex-1 bg-gray-50 overflow-hidden">
        <AdminSidebar />
        
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Search by applicant or job title..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                  />

                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-1/3"
                  >
                    <option value="">Sort By</option>
                    <option value="name_asc">Applicant Name (A-Z)</option>
                    <option value="name_desc">Applicant Name (Z-A)</option>
                    <option value="job_title">Job Title</option>
                    <option value="date_asc">Date (Oldest First)</option>
                    <option value="date_desc">Date (Newest First)</option>
                    <option value="status">Status</option>
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
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Job Title</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Applied Date</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Status</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayApplications.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-gray-400 text-sm">
                              {searchTerm ? "No applications match your search. Try a different search term." : "No applications found."}
                            </td>
                          </tr>
                        ) : (
                          displayApplications.map((application, index) => (
                            <tr key={application.id || index} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="font-medium text-gray-600">
                                  {(currentPage - 1) * itemsPerPage + index + 1}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="font-medium text-gray-900">
                                  <div className="truncate max-w-[120px] sm:max-w-[180px]" title={application.job_seeker?.name}>
                                    {application.job_seeker?.name || 'N/A'}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="text-gray-600">
                                  <div className="truncate max-w-[100px] sm:max-w-[140px]" title={application.job?.title || 'N/A'}>
                                    {application.job?.title || 'N/A'}
                                  </div>
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
                                <div className="flex items-center justify-center gap-2.5">
                                  {application.status !== 'approved' && (
                                    <button 
                                      className={`group relative flex items-center justify-center h-8 w-8 rounded-lg hover:text-white transition-all duration-200 shadow-sm
                                        ${processingId === application.id && application.status === 'approved' 
                                          ? 'bg-gray-100 text-gray-400' 
                                          : 'bg-green-50 text-green-600 hover:bg-green-600'}`}
                                      onClick={() => handleUpdateStatus(application.id, 'approved')}
                                      disabled={processingId === application.id}
                                    >
                                      {processingId === application.id && application.status === 'approved' ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                      ) : (
                                        <Check className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                  {application.status !== 'rejected' && (
                                    <button 
                                      className={`group relative flex items-center justify-center h-8 w-8 rounded-lg hover:text-white transition-all duration-200 shadow-sm
                                        ${processingId === application.id && application.status === 'rejected' 
                                          ? 'bg-gray-100 text-gray-400' 
                                          : 'bg-red-50 text-red-600 hover:bg-red-600'}`}
                                      onClick={() => handleUpdateStatus(application.id, 'rejected')}
                                      disabled={processingId === application.id}
                                    >
                                      {processingId === application.id && application.status === 'rejected' ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {showPagination && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
                      <div>
                        <span className="hidden sm:inline">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, applications.length)} of {applications.length} results
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
    </div>
  );
}

export default CompanyApplications;