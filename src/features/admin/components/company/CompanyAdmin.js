import React, { useEffect, useState } from "react";
import AdminSidebar from '../layout/AdminSidebar';
import AdminNavbar from '../layout/AdminNavbar';
import { Building, Eye, Trash2 ,Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/UI/Modal";
import Alert from "../../../../components/UI/Alert";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
function JobAdmin() {
  const [companies, setCompanies] = useState([]);
  const [copyCompanies, setCopyCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const [deletingId, setDeletingId] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchCompanies();
  }, []);



  async function fetchCompanies() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}//companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      const approvedCompanies = data.data.filter(company => 
        company.user?.status === "approved"
      );
      
      setCompanies(approvedCompanies);       
      setCopyCompanies(approvedCompanies);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to load companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteCompany = async (companyId) => {
    const companyToDelete = companies.find(c => c.id === companyId);
    if (!companyToDelete) return;

    const handleDelete = async () => {
      setDeletingId(companyId);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/companies/${companyId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete company");
        }

        await fetchCompanies();
        setNotification({ show: true, type: 'success', message: 'Company deleted successfully!' });
      } catch (error) {
        console.error("Delete error:", error);
        setNotification({ show: true, type: 'error', message: 'Failed to delete company' });
      } finally {
        setDeletingId(null);
      }
    };

    setConfirmModalContent({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${companyToDelete.company_name}"? This action cannot be undone.`,
      onConfirm: () => {
        handleDelete();
        setConfirmModalOpen(false);
      }
    });
    setConfirmModalOpen(true);
  };

  const paginatedCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const showPagination = companies.length > itemsPerPage;

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
      approved: "bg-green-100 text-green-700",
      suspended: "bg-red-100 text-red-700",
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700"
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
      const filterData = copyCompanies.filter((company) =>
        company.company_name.toLowerCase().includes(term.toLowerCase())
      );
      setCompanies(filterData);
      setCurrentPage(1);
    } else {
      setCompanies(copyCompanies);
    }
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSortOption(selected);

    const sorted = [...companies];

    if (selected === "name_asc") {
      sorted.sort((a, b) => a.company_name.localeCompare(b.company_name));
    } else if (selected === "name_desc") {
      sorted.sort((a, b) => b.company_name.localeCompare(a.company_name));
    } else if (selected === "location") {
      sorted.sort((a, b) => a.location.localeCompare(b.location));
    } else if (selected === "industry") {
      sorted.sort((a, b) => (a.industry || '').localeCompare(b.industry || ''));
    } else if (selected === "company_size") {
      const sizeOrder = {
        '1-10': 1,
        '11-50': 2,
        '51-200': 3,
        '201-500': 4,
        '501-1000': 5,
        '1000+': 6
      };
      sorted.sort((a, b) => {
        const aSize = sizeOrder[a.company_size] || 0;
        const bSize = sizeOrder[b.company_size] || 0;
        return aSize - bSize;
      });
    }

    setCompanies(sorted);
    setCurrentPage(1);
  };

  const displayCompanies = showPagination ? paginatedCompanies : companies;


  const MySwal = withReactContent(Swal);

const handleCompanyProfileClick = (companyProfile) => {
  MySwal.fire({
    title: <strong>{companyProfile.company_name}'s Profile</strong>,
    html: (
      <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Company Header */}
        <div className="flex items-start gap-4">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center text-red-600 overflow-hidden">
            {companyProfile.logo ? (
              <img
                src={`http://127.0.0.1:8000/storage/${companyProfile.logo}`}
                alt={companyProfile.company_name}
                className="rounded-full w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `
                    <span class="text-xl font-medium">
                      ${companyProfile.company_name?.charAt(0) || ''}
                    </span>
                  `;
                }}
              />
            ) : (
              <span className="text-xl font-medium">
                {companyProfile.company_name?.charAt(0) || ''}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {companyProfile.company_name}
            </h3>
            <p className="text-gray-600">{companyProfile.industry}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600">
                {companyProfile.company_size} employees
              </span>
              <span className="text-xs text-gray-500">
                Established {companyProfile.established_at ? new Date(companyProfile.established_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">ABOUT THE COMPANY</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {companyProfile.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">COMPANY DETAILS</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Industry</p>
              <p className="text-sm font-medium">{companyProfile.industry || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Company Size</p>
              <p className="text-sm font-medium">{companyProfile.company_size || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium">{companyProfile.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Established</p>
              <p className="text-sm font-medium">
                {companyProfile.established_at ? new Date(companyProfile.established_at).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Website */}
        {companyProfile.website && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">WEBSITE</h4>
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2 text-gray-400" />
              <a 
                href={companyProfile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {companyProfile.website}
              </a>
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
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
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
                <p className="text-gray-500">Loading companies...</p>
              </div>
            </div>
          ) : error ? (
            <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Building className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Error Loading Companies
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchCompanies}
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Company Management</h2>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Search companies..."
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
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="location">Location</option>
                    <option value="industry">Industry</option>
                    <option value="company_size">Company Size</option>
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
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Company Name</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Location</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Industry</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Size</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Status</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Established</th>
                          <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayCompanies.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-6 text-center text-gray-400 text-sm">
                              {searchTerm ? "No companies match your search. Try a different search term." : "No companies found."}
                            </td>
                          </tr>
                        ) : (
                          displayCompanies.map((company, index) => (
                            <tr key={company.id || index} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="font-medium text-gray-600">
                                  {(currentPage - 1) * itemsPerPage + index + 1}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="font-medium text-gray-900">
                                  <div className="truncate max-w-[120px] sm:max-w-[180px]" title={company.company_name}>
                                    {company.company_name}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="text-gray-600">
                                  <div className="truncate max-w-[100px] sm:max-w-[140px]" title={company.location}>
                                    {company.location}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="text-gray-600">
                                  <div className="truncate max-w-[100px] sm:max-w-[140px]" title={company.industry || 'N/A'}>
                                    {company.industry || 'N/A'}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  {company.company_size || 'N/A'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                {getStatusBadge(company.user?.status)}
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="text-gray-600">
                                  {company.established_at ? formatDate(company.established_at) : 'N/A'}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="flex items-center justify-center gap-2.5">
                                  <button 
                                    className="group relative flex items-center justify-center h-8 w-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                                    onClick={() => handleCompanyProfileClick(company)}
                                 >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                                    onClick={() => handleDeleteCompany(company.id)}
                                  >
                                    {deletingId === company.id ? (
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
                  {showPagination && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
                      <div>
                        <span className="hidden sm:inline">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, companies.length)} of {companies.length} results
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

export default JobAdmin;