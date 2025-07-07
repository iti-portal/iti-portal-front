import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { retrieveStaff, deleteStaff, suspendUser, unsuspendUser, createStaff } from '../../../../services/staffService';

/**
 * StaffManagement component for admin staff management
 * @returns {React.ReactElement} Staff management component
 */
const StaffManagement = () => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    email: '',
    password: '',
    full_name: '',
    position: '',
    department: ''
  });

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await retrieveStaff();
        
        if (response.success && response.data) {
          // Transform API data to match our component structure
          const transformedData = response.data.data.map(staff => ({
            id: staff.id,
            email: staff.email,
            full_name: staff.staff_profile?.full_name || 'N/A',
            position: staff.staff_profile?.position || 'N/A',
            department: staff.staff_profile?.department || 'N/A',
            status: staff.status,
            created_at: staff.created_at,
            updated_at: staff.updated_at,
          }));
          
          setStaffData(transformedData);
        } else {
          throw new Error(response.message || 'Failed to fetch staff data');
        }
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  // Handle staff deletion
  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await deleteStaff(staffId);
      // Remove the deleted staff from local state
      setStaffData(prev => prev.filter(staff => staff.id !== staffId));
      alert('Staff member deleted successfully');
    } catch (err) {
      console.error('Error deleting staff:', err);
      alert('Failed to delete staff member: ' + err.message);
    }
  };

  // Handle staff suspension
  const handleSuspendStaff = async (staffId, currentStatus) => {
    const isSuspended = currentStatus === 'suspended';
    const action = isSuspended ? 'unsuspend' : 'suspend';
    
    // Only allow suspend/unsuspend for approved or suspended users
    if (currentStatus !== 'approved' && currentStatus !== 'suspended') {
      alert(`Cannot ${action} a user with ${currentStatus} status. Only approved users can be suspended.`);
      return;
    }
    
    if (!window.confirm(`Are you sure you want to ${action} this staff member?`)) {
      return;
    }

    try {
      let result;
      if (isSuspended) {
        result = await unsuspendUser(staffId);
      } else {
        result = await suspendUser(staffId);
      }

      if (result.success) {
        // Update the staff status in local state
        setStaffData(prev => prev.map(staff => 
          staff.id === staffId 
            ? { ...staff, status: result.data.user.status }
            : staff
        ));
        alert(`Staff member ${action}ed successfully`);
      } else {
        throw new Error(result.message || `Failed to ${action} staff member`);
      }
    } catch (err) {
      console.error(`Error ${action}ing staff:`, err);
      alert(`Failed to ${action} staff member: ` + err.message);
    }
  };

  // Handle adding new staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newStaffForm.email || !newStaffForm.password || !newStaffForm.full_name || 
        !newStaffForm.position || !newStaffForm.department) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setAddingStaff(true);
      
      const result = await createStaff(newStaffForm);
      
      if (result.success) {
        // Transform the new staff data to match our component structure
        const newStaff = {
          id: result.data.user.id,
          email: result.data.user.email,
          full_name: result.data.user.staff_profile.full_name,
          position: result.data.user.staff_profile.position,
          department: result.data.user.staff_profile.department,
          status: result.data.user.status,
          created_at: result.data.user.created_at,
          updated_at: result.data.user.updated_at,
        };
        
        // Add the new staff to local state
        setStaffData(prev => [newStaff, ...prev]);
        
        // Reset form and close modal
        setNewStaffForm({
          email: '',
          password: '',
          full_name: '',
          position: '',
          department: ''
        });
        setShowAddModal(false);
        
        alert('Staff member added successfully');
      } else {
        throw new Error(result.message || 'Failed to add staff member');
      }
    } catch (err) {
      console.error('Error adding staff:', err);
      alert('Failed to add staff member: ' + err.message);
    } finally {
      setAddingStaff(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStaffForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const positions = ['All Positions', ...Array.from(new Set(staffData.map(s => s.position)))];
  const departments = ['All Departments', ...Array.from(new Set(staffData.map(s => s.department)))];

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return staffData.filter(staff => {
      const matchesSearch = 
        staff.full_name.toLowerCase().includes(search.toLowerCase()) ||
        staff.email.toLowerCase().includes(search.toLowerCase()) ||
        staff.position.toLowerCase().includes(search.toLowerCase()) ||
        staff.department.toLowerCase().includes(search.toLowerCase());
      
      const matchesPosition = positionFilter === 'All Positions' || staff.position === positionFilter;
      const matchesDepartment = departmentFilter === 'All Departments' || staff.department === departmentFilter;
      
      return matchesSearch && matchesPosition && matchesDepartment;
    });
  }, [staffData, search, positionFilter, departmentFilter]);

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
              : getValue() === 'HR' || getValue() === 'Human Resources' || getValue().includes('Supervision')
              ? 'bg-green-100 text-green-700'
              : getValue() === 'Finance'
              ? 'bg-yellow-100 text-yellow-700'
              : getValue() === 'Marketing'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <span className="hidden sm:inline">{getValue()}</span>
            <span className="sm:hidden">
              {getValue().length > 10 ? getValue().substring(0, 8) + '...' : getValue()}
            </span>
          </span>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            getValue() === 'approved' 
              ? 'bg-green-100 text-green-700' 
              : getValue() === 'suspended'
              ? 'bg-red-100 text-red-700'
              : getValue() === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : getValue() === 'rejected'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {getValue() === 'approved' ? 'Active' : getValue().charAt(0).toUpperCase() + getValue().slice(1)}
          </span>
        </div>
      ),
      size: 80,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const staff = row.original;
        const isSuspended = staff.status === 'suspended';
        const isApproved = staff.status === 'approved';
        const canSuspendUnsuspend = isApproved || isSuspended;
        
        return (
          <div className="flex items-center justify-center gap-2.5">
            {canSuspendUnsuspend && (
              <button 
                className={`group relative flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 shadow-sm ${
                  isSuspended 
                    ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                }`}
                title={isSuspended ? 'Unsuspend Staff' : 'Suspend Staff'}
                onClick={() => handleSuspendStaff(staff.id, staff.status)}
              >
                <div className={`hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10 ${
                  isSuspended ? 'bg-green-700' : 'bg-orange-700'
                }`}>
                  {isSuspended ? 'Unsuspend Staff' : 'Suspend Staff'}
                </div>
                {isSuspended ? (
                  // Unsuspend icon (unlock)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                ) : (
                  // Suspend icon (lock)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                )}
              </button>
            )}
            <button 
              className="group relative flex items-center justify-center h-8 w-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
              title="Delete Staff"
              onClick={() => handleDeleteStaff(staff.id)}
            >
              <div className="hidden sm:block absolute opacity-0 group-hover:opacity-100 top-full left-1/2 -translate-x-1/2 mt-2 bg-red-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap z-10">Delete Staff</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        );
      },
      size: 110,
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
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition w-full md:w-auto"
          >
            + Add New Staff
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">Failed to load staff data: {error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 animate-spin text-[#901b20] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-gray-600">Loading staff data...</span>
            </div>
          </div>
        )}

        {/* Filters - only show when not loading */}
        {!loading && !error && (
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
        )}

        {/* Table - only show when not loading and no error */}
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
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Staff Member</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newStaffForm.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newStaffForm.password}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={newStaffForm.full_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newStaffForm.position}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                    placeholder="Enter position"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={newStaffForm.department}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Supervision On PTP / ITP">Supervision On PTP / ITP</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingStaff}
                    className="flex-1 px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#a83236] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingStaff ? 'Adding...' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
