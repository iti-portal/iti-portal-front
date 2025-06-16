import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

/**
 * Staff list data
 */
const staffList = [
  {
    id: 1,
    email: 'staff@example.com',
    password: 'staff12345',
    full_name: 'John Doe',
    position: 'HR Manager',
    department: 'Human Resources',
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    password: 'jsmith123',
    full_name: 'Jane Smith',
    position: 'IT Specialist',
    department: 'IT',
  },
  {
    id: 3,
    email: 'michael.brown@example.com',
    password: 'mbrown123',
    full_name: 'Michael Brown',
    position: 'Finance Analyst',
    department: 'Finance',
  },
  {
    id: 4,
    email: 'lisa.white@example.com',
    password: 'lwhite123',
    full_name: 'Lisa White',
    position: 'Marketing Lead',
    department: 'Marketing',
  },
  {
    id: 5,
    email: 'david.jones@example.com',
    password: 'djones123',
    full_name: 'David Jones',
    position: 'Operations Manager',
    department: 'Operations',
  },
  {
    id: 6,
    email: 'emily.taylor@example.com',
    password: 'etaylor123',
    full_name: 'Emily Taylor',
    position: 'Recruiter',
    department: 'Human Resources',
  },
  {
    id: 7,
    email: 'chris.evans@example.com',
    password: 'cevans123',
    full_name: 'Chris Evans',
    position: 'IT Specialist',
    department: 'IT',
  },
  {
    id: 8,
    email: 'sarah.miller@example.com',
    password: 'smiller123',
    full_name: 'Sarah Miller',
    position: 'Finance Analyst',
    department: 'Finance',
  },
  {
    id: 9,
    email: 'paul.wilson@example.com',
    password: 'pwilson123',
    full_name: 'Paul Wilson',
    position: 'Marketing Lead',
    department: 'Marketing',
  },
  {
    id: 10,
    email: 'anna.moore@example.com',
    password: 'amoore123',
    full_name: 'Anna Moore',
    position: 'Operations Manager',
    department: 'Operations',
  },
  {
    id: 11,
    email: 'tom.harris@example.com',
    password: 'tharris123',
    full_name: 'Tom Harris',
    position: 'Recruiter',
    department: 'Human Resources',
  },
  {
    id: 12,
    email: 'kate.clark@example.com',
    password: 'kclark123',
    full_name: 'Kate Clark',
    position: 'IT Specialist',
    department: 'IT',
  },
];

/**
 * StaffManagement component for admin staff management
 * @returns {React.ReactElement} Staff management component
 */
const StaffManagement = () => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  const positions = ['All Positions', ...Array.from(new Set(staffList.map(s => s.position)))];
  const departments = ['All Departments', ...Array.from(new Set(staffList.map(s => s.department)))];

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return staffList.filter(staff => {
      const matchesSearch = 
        staff.full_name.toLowerCase().includes(search.toLowerCase()) ||
        staff.email.toLowerCase().includes(search.toLowerCase()) ||
        staff.position.toLowerCase().includes(search.toLowerCase()) ||
        staff.department.toLowerCase().includes(search.toLowerCase());
      
      const matchesPosition = positionFilter === 'All Positions' || staff.position === positionFilter;
      const matchesDepartment = departmentFilter === 'All Departments' || staff.department === departmentFilter;
      
      return matchesSearch && matchesPosition && matchesDepartment;
    });
  }, [search, positionFilter, departmentFilter]);

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
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">
          <div className="truncate max-w-[120px] sm:max-w-[180px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          <div className="truncate max-w-[120px] sm:max-w-[200px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 180,
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ getValue }) => (
        <div className="text-gray-800">
          <div className="truncate max-w-[100px] sm:max-w-[140px]" title={getValue()}>
            {getValue()}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ getValue }) => (
        <div className="text-gray-800">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            getValue() === 'IT' 
              ? 'bg-blue-100 text-blue-700' 
              : getValue() === 'HR' || getValue() === 'Human Resources'
              ? 'bg-green-100 text-green-700'
              : getValue() === 'Finance'
              ? 'bg-yellow-100 text-yellow-700'
              : getValue() === 'Marketing'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <span className="hidden sm:inline">{getValue()}</span>
            <span className="sm:hidden">
              {getValue() === 'Human Resources' ? 'HR' : getValue().substring(0, 3)}
            </span>
          </span>
        </div>
      ),
      size: 100,
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
            title="Edit Staff"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-amber-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Edit Staff</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button 
            className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
            title="Delete Staff"
          >
            <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-red-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Delete Staff</div>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Staff Management</h2>
          <button className="bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition w-full md:w-auto">
            + Add New Staff
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex-grow text-sm w-full sm:w-auto"
          />
          <select
            value={positionFilter}
            onChange={e => setPositionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
          >
            {positions.map(position => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-full sm:w-auto"
          >
            {departments.map(department => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </div>

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
                        No staff found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
      </div>
    </div>
  );
};

export default StaffManagement;
