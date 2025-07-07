import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import RequestServiceTable from './RequestServiceTable';
import { getUsedServices, getAlumniServiceDetails } from '../../../../services/servicesService';

/**
 * ServiceManagement component for admin service management
 * @returns {React.ReactElement} Service management component
 */
const ServiceManagement = () => {
  const [showRequestTable, setShowRequestTable] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch services data from API
  useEffect(() => {
    fetchServicesData();
  }, []);

  // Auto-dismiss error toast after 5 seconds
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUsedServices();
      
      if (response.success && response.data) {
        setServicesData(response.data.services.data);
      } else {
        throw new Error(response.message || 'Failed to fetch services data');
      }
    } catch (err) {
      console.error('Error fetching services data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle returning from request table and refresh data
  const handleBackFromRequests = () => {
    setShowRequestTable(false);
    // Refresh services data to show any newly evaluated services
    fetchServicesData();
  };

  // Handle view profile
  const handleViewProfile = async (serviceId) => {
    try {
      setLoadingProfile(true);
      const response = await getAlumniServiceDetails(serviceId);
      
      if (response.success && response.data) {
        setSelectedProfile(response.data.details);
        setShowProfileModal(true);
      } else {
        throw new Error(response.message || 'Failed to fetch profile details');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setErrorMessage('Failed to load profile details: ' + err.message);
      setShowErrorToast(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  const serviceTypes = ['All Types', ...Array.from(new Set(servicesData.map(s => s.service_type)))];

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return servicesData.filter(service => {
      const matchesSearch = 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        (service.feedback && service.feedback.toLowerCase().includes(search.toLowerCase())) ||
        `${service.first_name} ${service.last_name}`.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'All Types' || service.service_type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [servicesData, search, typeFilter]);

  // Define columns
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => (
        <div className="font-medium text-gray-600 text-center">
          {row.index + 1}
        </div>
      ),
      size: 40,
    },
    {
      accessorKey: 'service_type',
      header: 'Type',
      cell: ({ getValue }) => (
        <div className="text-gray-800">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            getValue() === 'freelance' 
              ? 'bg-blue-100 text-blue-700' 
              : getValue() === 'course_teaching'
              ? 'bg-green-100 text-green-700'
              : getValue() === 'consulting'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <span className="hidden sm:inline">{getValue().replace('_', ' ')}</span>
            <span className="sm:hidden">
              {getValue() === 'course_teaching' ? 'Course' : getValue() === 'consulting' ? 'Consult' : getValue()}
            </span>
          </span>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">
          <div className="truncate max-w-[100px] sm:max-w-[150px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          <div className="truncate max-w-[80px] sm:max-w-[160px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 140,
    },
    {
      accessorKey: 'feedback',
      header: 'Feedback',
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          <div className="truncate max-w-[70px] sm:max-w-[120px]" title={getValue() || 'No feedback'}>
            {getValue() || '-'}
          </div>
        </div>
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="View Profile"
            onClick={() => handleViewProfile(row.original.id)}
            disabled={loadingProfile}
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-blue-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">View Profile</div>
            {loadingProfile ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
      ),
      size: 80,
    },
  ], []);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="w-full space-y-4 md:space-y-6">
        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Service Management</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              className={`${
                !showRequestTable ? 'bg-[#901b20] text-white' : 'bg-gray-100 text-gray-700'
              } px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition w-full sm:w-auto`}
              onClick={() => setShowRequestTable(false)}
            >
              Services
            </button>
            <button
              className={`${
                showRequestTable ? 'bg-[#901b20] text-white' : 'bg-gray-100 text-gray-700'
              } px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition w-full sm:w-auto`}
              onClick={() => setShowRequestTable(true)}
            >
              Requests
            </button>
          </div>
        </div>

        {showRequestTable ? (
          <RequestServiceTable onBack={handleBackFromRequests} />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex-grow text-sm w-full sm:w-auto"
              />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
              >
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All Types' ? type : type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Services</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden w-full">
              <div className="overflow-x-auto md:overflow-hidden w-full">
                <div className="md:max-h-[500px] md:overflow-y-auto w-full">
                  <table className="w-full min-w-[600px]">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="text-gray-700">
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="py-2 px-2 sm:py-3 sm:px-4 text-center cursor-pointer hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium border-b border-gray-200"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                {header.isPlaceholder ? null : (
                                  <>
                                    <span className="truncate">
                                      {flexRender(header.column.columnDef.header, header.getContext())}
                                    </span>
                                    {{
                                      asc: ' 🔼',
                                      desc: ' 🔽',
                                    }[header.column.getIsSorted()] ?? null}
                                  </>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="border-t hover:bg-gray-50 transition-colors">
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-center">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {table.getRowModel().rows.length === 0 && (
                        <tr>
                          <td colSpan={columns.length} className="py-6 text-center text-gray-400 text-sm">
                            No services found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t text-xs sm:text-sm text-gray-600 gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <span className="hidden sm:inline">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} results
                  </span>
                  <span className="sm:hidden">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                  <button
                    className="px-2 sm:px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="hidden sm:inline">&lt; Previous</span>
                    <span className="sm:hidden">&lt;</span>
                  </button>
                  
                  {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
                    const currentPage = table.getState().pagination.pageIndex;
                    const totalPages = table.getPageCount();
                    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                    const pageIndex = start + i;
                    
                    if (pageIndex >= 0 && pageIndex < totalPages) {
                      return (
                        <button
                          key={pageIndex}
                          className={`px-2 sm:px-3 py-1 rounded ${
                            currentPage === pageIndex
                              ? 'bg-[#901b20] text-white'
                              : 'border border-gray-300 bg-white hover:bg-gray-100'
                          }`}
                          onClick={() => table.setPageIndex(pageIndex)}
                        >
                          {pageIndex + 1}
                        </button>
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                  
                  <button
                    className="px-2 sm:px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="hidden sm:inline">Next &gt;</span>
                    <span className="sm:hidden">&gt;</span>
                  </button>
                </div>                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Alumni Service Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Alumni Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Alumni Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800">{selectedProfile.first_name} {selectedProfile.last_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{selectedProfile.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Track:</span>
                    <p className="text-gray-800">{selectedProfile.track || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Intake:</span>
                    <p className="text-gray-800">{selectedProfile.intake || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Service Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Service Type:</span>
                    <p className="text-gray-800 capitalize">{selectedProfile.service_type?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Title:</span>
                    <p className="text-gray-800">{selectedProfile.title || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Description:</span>
                    <p className="text-gray-800">{selectedProfile.description || 'N/A'}</p>
                  </div>
                  {selectedProfile.evaluation && (
                    <div>
                      <span className="font-medium text-gray-600">Evaluation:</span>
                      <p className="text-gray-800 capitalize">{selectedProfile.evaluation}</p>
                    </div>
                  )}
                  {selectedProfile.feedback && (
                    <div>
                      <span className="font-medium text-gray-600">Feedback:</span>
                      <p className="text-gray-800">{selectedProfile.feedback}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {(selectedProfile.created_at || selectedProfile.updated_at) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {selectedProfile.created_at && (
                      <div>
                        <span className="font-medium text-gray-600">Created:</span>
                        <p className="text-gray-800">{new Date(selectedProfile.created_at).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedProfile.updated_at && (
                      <div>
                        <span className="font-medium text-gray-600">Last Updated:</span>
                        <p className="text-gray-800">{new Date(selectedProfile.updated_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setShowErrorToast(false)}
              className="text-red-400 hover:text-red-600 transition-colors ml-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
