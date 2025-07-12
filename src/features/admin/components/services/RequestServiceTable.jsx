import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { getUnusedServices, getAlumniServiceDetails, evaluateService, deleteService } from '../../../../services/servicesService';

/**
 * RequestServiceTable component for handling service requests
 * @param {Object} props Component props
 * @param {Function} props.onBack Function to handle back navigation
 * @returns {React.ReactElement} Request service table component
 */
const RequestServiceTable = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch request data from API
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUnusedServices();
        
        if (response.success && response.data) {
          setRequestData(response.data.services.data);
        } else {
          throw new Error(response.message || 'Failed to fetch request data');
        }
      } catch (err) {
        console.error('Error fetching request data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, []);

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => setShowErrorToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const serviceTypes = ['All Services', ...Array.from(new Set(requestData.map(s => s.service_type)))];

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return requestData.filter(service => {
      const matchesSearch = 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        `${service.first_name} ${service.last_name}`.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = serviceFilter === 'All Services' || service.service_type === serviceFilter;
      
      return matchesSearch && matchesType;
    });
  }, [requestData, search, serviceFilter]);

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

  // Handle evaluate service
  const handleEvaluate = (service) => {
    setSelectedService(service);
    setShowEvaluateModal(true);
  };

  // Submit evaluation
  const submitEvaluation = async (evaluation, feedback) => {
    try {
      setEvaluating(true);
      const response = await evaluateService(selectedService.id, evaluation, feedback);
      
      if (response.success) {
        // Remove the evaluated service from the request list
        setRequestData(prev => prev.filter(s => s.id !== selectedService.id));
        setSuccessMessage(`Service "${selectedService.title}" has been evaluated as ${evaluation}`);
        setShowSuccessToast(true);
        setShowEvaluateModal(false);
      } else {
        throw new Error(response.message || 'Failed to evaluate service');
      }
    } catch (err) {
      console.error('Error evaluating service:', err);
      setErrorMessage('Failed to evaluate service: ' + err.message);
      setShowErrorToast(true);
    } finally {
      setEvaluating(false);
    }
  };

  // Handle delete service
  const handleDelete = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  // Submit delete
  const submitDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteService(selectedService.id);
      
      if (response.success) {
        // Remove the deleted service from the request list
        setRequestData(prev => prev.filter(s => s.id !== selectedService.id));
        setSuccessMessage(`Service "${selectedService.title}" has been deleted successfully`);
        setShowSuccessToast(true);
        setShowDeleteModal(false);
      } else {
        throw new Error(response.message || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setErrorMessage('Failed to delete service: ' + err.message);
      setShowErrorToast(true);
    } finally {
      setDeleting(false);
    }
  };

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
              : getValue() === 'business_session'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <span className="hidden sm:inline">{getValue().replace('_', ' ')}</span>
            <span className="sm:hidden">
              {getValue() === 'course_teaching' ? 'Course' : 
               getValue() === 'consulting' ? 'Consult' : 
               getValue() === 'business_session' ? 'Business' : getValue()}
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
      header: 'Alumni',
      cell: ({ row }) => (
        <div className="text-gray-800">
          <div className="truncate max-w-[100px] sm:max-w-[150px]" title={`${row.original.first_name} ${row.original.last_name}`}>
            {row.original.first_name} {row.original.last_name}
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
          <div className="truncate max-w-[80px] sm:max-w-[160px]" title={getValue() || 'No description'}>
            {getValue() || '-'}
          </div>
        </div>
      ),
      size: 140,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
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
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Evaluate"
            onClick={() => handleEvaluate(row.original)}
            disabled={evaluating}
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-green-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Evaluate</div>
            {evaluating ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
          </button>
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
            onClick={() => handleDelete(row.original)}
            disabled={deleting}
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-red-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Delete</div>
            {deleting ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            )}
          </button>
        </div>
      ),
      size: 130,
    },
  ], [loadingProfile, evaluating, deleting, handleViewProfile, handleEvaluate, handleDelete]);

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
        {/* Header */}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex-grow text-sm w-full sm:w-auto"
            disabled={loading}
          />
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
            disabled={loading}
          >
            {serviceTypes.map(type => (
              <option key={type} value={type}>
                {type === 'All Services' ? type : type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading service requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Service Requests</h3>
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
                          No service requests found.
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
              </div>
            </div>
          </div>
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

      {/* Evaluate Modal */}
      {showEvaluateModal && selectedService && (
        <EvaluateModal
          service={selectedService}
          onClose={() => setShowEvaluateModal(false)}
          onEvaluate={submitEvaluation}
          isEvaluating={evaluating}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedService && (
        <DeleteModal
          service={selectedService}
          onClose={() => setShowDeleteModal(false)}
          onDelete={submitDelete}
          isDeleting={deleting}
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-green-400 hover:text-green-600 transition-colors ml-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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

// Evaluate Modal Component
const EvaluateModal = ({ service, onClose, onEvaluate, isEvaluating }) => {
  const [evaluation, setEvaluation] = useState('positive');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onEvaluate(evaluation, feedback);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Evaluate Service</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isEvaluating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Service: {service.title}</h4>
            <p className="text-sm text-gray-600">Alumni: {service.first_name} {service.last_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation *
            </label>
            <select
              value={evaluation}
              onChange={(e) => setEvaluation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isEvaluating}
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isEvaluating}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isEvaluating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isEvaluating}
            >
              {isEvaluating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Evaluating...
                </>
              ) : (
                'Submit Evaluation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Modal Component
const DeleteModal = ({ service, onClose, onDelete, isDeleting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Delete Service</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 rounded-lg p-4 flex items-start">
            <svg className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800 mb-2">Are you sure you want to delete this service?</h4>
              <p className="text-sm text-red-700">This action cannot be undone. The service will be permanently removed from the system.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Service: {service.title}</h4>
            <p className="text-sm text-gray-600">Alumni: {service.first_name} {service.last_name}</p>
            <p className="text-sm text-gray-600 mt-1">Type: {service.service_type.replace('_', ' ')}</p>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                'Delete Service'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestServiceTable;
