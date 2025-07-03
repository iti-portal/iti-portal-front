import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import RequestServiceTable from './RequestServiceTable';

/**
 * Example service data
 */
const serviceList = [
  {
    id: 1,
    alumni_id: 101,
    service_type: 'freelance',
    title: 'Web Design',
    description: 'Designed a website for a local business.',
    feedback: 'Great experience!',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
  {
    id: 2,
    alumni_id: 102,
    service_type: 'course_teaching',
    title: 'React Course',
    description: 'Taught a React course for beginners.',
    feedback: null,
    has_taught_or_presented: true,
    evaluation: 'neutral',
  },
  {
    id: 3,
    alumni_id: 103,
    service_type: 'consulting',
    title: 'IT Consulting',
    description: 'Provided IT consulting for a startup.',
    feedback: 'Very helpful!',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
  {
    id: 4,
    alumni_id: 104,
    service_type: 'freelance',
    title: 'Logo Design',
    description: 'Created a logo for a new brand.',
    feedback: 'Loved the creativity!',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
  {
    id: 5,
    alumni_id: 105,
    service_type: 'course_teaching',
    title: 'Python Bootcamp',
    description: 'Led a bootcamp for Python beginners.',
    feedback: 'Well structured course.',
    has_taught_or_presented: true,
    evaluation: 'positive',
  },
  {
    id: 6,
    alumni_id: 106,
    service_type: 'consulting',
    title: 'Business Analysis',
    description: 'Analyzed business processes for efficiency.',
    feedback: 'Insightful recommendations.',
    has_taught_or_presented: false,
    evaluation: 'neutral',
  },
  {
    id: 7,
    alumni_id: 107,
    service_type: 'freelance',
    title: 'Mobile App UI',
    description: 'Designed UI for a mobile application.',
    feedback: 'Modern and user-friendly.',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
  {
    id: 8,
    alumni_id: 108,
    service_type: 'course_teaching',
    title: 'Data Science Workshop',
    description: 'Conducted a workshop on data science basics.',
    feedback: null,
    has_taught_or_presented: true,
    evaluation: 'positive',
  },
  {
    id: 9,
    alumni_id: 109,
    service_type: 'consulting',
    title: 'Cloud Migration',
    description: 'Assisted in migrating services to the cloud.',
    feedback: 'Smooth transition.',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
  {
    id: 10,
    alumni_id: 110,
    service_type: 'freelance',
    title: 'SEO Optimization',
    description: 'Improved website SEO for better ranking.',
    feedback: 'Traffic increased!',
    has_taught_or_presented: false,
    evaluation: 'positive',
  },
];

const serviceTypes = ['All Types', ...Array.from(new Set(serviceList.map(s => s.service_type)))];
const evaluations = ['All Evaluations', ...Array.from(new Set(serviceList.map(s => s.evaluation).filter(Boolean)))];

/**
 * ServiceManagement component for admin service management
 * @returns {React.ReactElement} Service management component
 */
const ServiceManagement = () => {
  const [showRequestTable, setShowRequestTable] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [evaluationFilter, setEvaluationFilter] = useState('All Evaluations');

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return serviceList.filter(service => {
      const matchesSearch = 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        (service.feedback && service.feedback.toLowerCase().includes(search.toLowerCase()));
      
      const matchesType = typeFilter === 'All Types' || service.service_type === typeFilter;
      const matchesEvaluation = evaluationFilter === 'All Evaluations' || service.evaluation === evaluationFilter;
      
      return matchesSearch && matchesType && matchesEvaluation;
    });
  }, [search, typeFilter, evaluationFilter]);

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
      accessorKey: 'has_taught_or_presented',
      header: 'Taught',
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className={`inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs leading-5 sm:leading-6 font-bold ${
            getValue() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {getValue() ? 'Y' : 'N'}
          </span>
        </div>
      ),
      size: 60,
    },
    {
      accessorKey: 'evaluation',
      header: 'Status',
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            getValue() === 'positive' 
              ? 'bg-green-100 text-green-700' 
              : getValue() === 'neutral'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="hidden sm:inline">{getValue() || '-'}</span>
            <span className="sm:hidden">
              {getValue() === 'positive' ? '✓' : getValue() === 'neutral' ? '~' : '-'}
            </span>
          </span>
        </div>
      ),
      size: 70,
    },
    {      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2.5">
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
            title="View Details"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-blue-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">View Details</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-200 shadow-sm"
            title="Edit Service"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-amber-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Edit Service</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
            title="Delete Service"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-red-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Delete Service</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      ),
      size: 130,
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
          <RequestServiceTable onBack={() => setShowRequestTable(false)} />
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
              <select
                value={evaluationFilter}
                onChange={e => setEvaluationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
              >
                {evaluations.map(evaluation => (
                  <option key={evaluation}>{evaluation}</option>
                ))}
              </select>
            </div>

            {/* Table */}
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
