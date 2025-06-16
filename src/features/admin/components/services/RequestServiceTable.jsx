import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

/**
 * Initial request data
 */
const initialRequestData = [
  { id: 1, name: 'Nihal Zain', email: 'nihalzain50@gmail.com', serviceTitle: 'Website Development', approved: null },
  { id: 2, name: 'Sara Ahmed', email: 'sara.ahmed@example.com', serviceTitle: 'Mobile App Design', approved: null },
  { id: 3, name: 'Ali Hassan', email: 'ali.hassan@example.com', serviceTitle: 'Website Development', approved: null },
];

const serviceTitles = ['All Services', ...Array.from(new Set(initialRequestData.map(r => r.serviceTitle)))];

/**
 * Alert component for notifications
 */
const Alert = ({ show, type, message, onClose }) => {
  if (!show) return null;
  
  const bgColor = type === 'success' 
    ? 'bg-green-100 border-green-400 text-green-700' 
    : type === 'error' 
    ? 'bg-red-100 border-red-400 text-red-700'
    : 'bg-blue-100 border-blue-400 text-blue-700';
  
  return (
    <div className={`${bgColor} px-4 py-3 rounded relative border`} role="alert">
      <span className="block sm:inline">{message}</span>
      <span 
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={onClose}
      >
        <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
        </svg>
      </span>
    </div>
  );
};

/**
 * RequestServiceTable component for handling service requests
 * @param {Object} props Component props
 * @param {Function} props.onBack Function to handle back navigation
 * @returns {React.ReactElement} Request service table component
 */
const RequestServiceTable = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const [requestData, setRequestData] = useState(initialRequestData);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return requestData.filter(req =>
      (serviceFilter === 'All Services' || req.serviceTitle === serviceFilter) &&
      (
        req.name.toLowerCase().includes(search.toLowerCase()) ||
        req.email.toLowerCase().includes(search.toLowerCase()) ||
        req.serviceTitle.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, serviceFilter, requestData]);
  
  const showAlert = useCallback((type, message, duration = 3000) => {
    setAlert({ show: true, type, message });
    if (duration) {
      setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), duration);
    }
  }, []);

  const handleShowProfile = useCallback((req) => {
    showAlert('info', `Show profile for ${req.name}`);
  }, [showAlert]);

  const handleApprove = useCallback((req) => {
    setRequestData(prev =>
      prev.map(r => r.id === req.id ? { ...r, approved: true } : r)
    );
    showAlert('success', `Approved request for ${req.name}`);
  }, [showAlert]);

  const handleNotApprove = useCallback((req) => {
    setRequestData(prev =>
      prev.map(r => r.id === req.id ? { ...r, approved: false } : r)
    );
    showAlert('error', `Not approved request for ${req.name}`);
  }, [showAlert]);

  const handleCloseAlert = useCallback(() => setAlert({ show: false, type: 'info', message: '' }), []);
  
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">
          <div className="truncate max-w-[100px] sm:max-w-[150px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          <div className="truncate max-w-[100px] sm:max-w-[200px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'serviceTitle',
      header: 'Service',
      cell: ({ getValue }) => (
        <div className="text-gray-800">
          <div className="truncate max-w-[80px] sm:max-w-[140px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'approved',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue();
        if (value === true) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <span className="hidden sm:inline">Approved</span>
              <span className="sm:hidden">✓</span>
            </span>
          );
        }
        if (value === false) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              <span className="hidden sm:inline">Rejected</span>
              <span className="sm:hidden">✗</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">⏳</span>
          </span>
        );
      },
      size: 80,
    },
    {      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            className="group relative flex items-center justify-center h-8 w-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
            onClick={() => handleShowProfile(row.original)}
            title="Show Profile"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-blue-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">View Profile</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
          <button
            className="group relative flex items-center justify-center h-8 w-8 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-50 disabled:hover:text-green-600"
            onClick={() => handleApprove(row.original)}
            disabled={row.original.approved === true}
            title="Approve Request"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-green-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Approve Request</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          <button
            className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-600"
            onClick={() => handleNotApprove(row.original)}
            disabled={row.original.approved === false}
            title="Reject Request"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-red-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Reject Request</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
      ),
      size: 130,
    },
  ], [handleApprove, handleNotApprove, handleShowProfile]);

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
      {/* Alert */}
      <div className="mb-4">
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex-grow text-sm w-full sm:w-auto"
        />
        <select
          value={serviceFilter}
          onChange={e => setServiceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
        >
          {serviceTitles.map(title => (
            <option key={title}>{title}</option>
          ))}
        </select>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden w-full">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Requested Services</h3>
        </div>
        {/* Table container with fixed height and scroll on medium+ screens */}
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
            
            {/* Page numbers - show fewer on mobile */}
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
    </div>
  );
};

export default RequestServiceTable;
