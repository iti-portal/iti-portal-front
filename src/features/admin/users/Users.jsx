import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Trash2, UserX } from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=40&h=40&fit=crop&crop=face',
      name: 'Eleanor Pena',
      email: 'eleanor.pena@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-07-28'
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      name: 'Ronald Grahams',
      email: 'ronald.grahams@example.com',
      role: 'Staff',
      status: 'Active',
      lastLogin: '2024-07-27'
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      name: 'Jenny King',
      email: 'jenny.king@example.com',
      role: 'Student',
      status: 'Pending',
      lastLogin: '2024-07-26'
    },
    {
      id: 4,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      name: 'Marvin Steward',
      email: 'marvin.steward@example.com',
      role: 'Alumni',
      status: 'Active',
      lastLogin: '2024-07-28'
    },
    {
      id: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      name: 'Kathryn Ryan',
      email: 'kathryn.ryan@example.com',
      role: 'Staff',
      status: 'Inactive',
      lastLogin: '2024-07-20'
    },
    {
      id: 6,
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
      name: 'Ralph Jones',
      email: 'ralph.jones@example.com',
      role: 'Company',
      status: 'Active',
      lastLogin: '2024-07-27'
    },
    {
      id: 7,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
      name: 'Albert Salazar',
      email: 'albert.salazar@example.com',
      role: 'Student',
      status: 'Pending',
      lastLogin: '2024-07-25'
    },
    {
      id: 8,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      name: 'Diana Sanchez',
      email: 'diana.sanchez@example.com',
      role: 'Staff',
      status: 'Active',
      lastLogin: '2024-07-28'
    },
    {
      id: 9,
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=40&h=40&fit=crop&crop=face',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Alumni',
      status: 'Inactive',
      lastLogin: '2024-07-15'
    },
    {
      id: 10,
      avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=40&h=40&fit=crop&crop=face',
      name: 'Alice Foster',
      email: 'alice.foster@example.com',
      role: 'Student',
      status: 'Active',
      lastLogin: '2024-07-28'
    },
    {
      id: 11,
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=40&h=40&fit=crop&crop=face',
      name: 'Michael Green',
      email: 'michael.green@example.com',
      role: 'Company',
      status: 'Active',
      lastLogin: '2024-07-27'
    },
    {
      id: 12,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
      name: 'Linda Johnson',
      email: 'linda.johnson@example.com',
      role: 'Staff',
      status: 'Pending',
      lastLogin: '2024-07-26'
    },
    {
      id: 13,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-07-29'
    },
    {
      id: 14,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face',
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      role: 'Student',
      status: 'Active',
      lastLogin: '2024-07-28'
    },
    {
      id: 15,
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=40&h=40&fit=crop&crop=face',
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'Alumni',
      status: 'Inactive',
      lastLogin: '2024-07-22'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Staff':
        return 'bg-blue-100 text-blue-800';
      case 'Student':
        return 'bg-green-100 text-green-800';
      case 'Alumni':
        return 'bg-orange-100 text-orange-800';
      case 'Company':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === 'search') setSearchTerm(value);
    if (filterType === 'role') setRoleFilter(value);
    if (filterType === 'status') setStatusFilter(value);
  };

  // Handle actions
  const handleSuspend = (user) => {
    console.log('Suspending user:', user.name);
    //
  };

  const handleDelete = (user) => {
    console.log('Deleting user:', user.name);
    //
  };


  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust startPage if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <button className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" style={{backgroundColor: '#901b20'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#7a1419'} onMouseLeave={(e) => e.target.style.backgroundColor = '#901b20'}>
            <Plus size={16} />
            Add New User
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role:</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleFilter}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>Student</option>
                  <option>Alumni</option>
                  <option>Company</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Avatar</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSuspend(user)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                        >
                          <UserX size={12} />
                          Suspend
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {totalPages > 0 && (
                <>
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button 
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-sm text-gray-500">...</span>}
                    </>
                  )}
                  
                  {getPageNumbers().map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        currentPage === page 
                          ? 'text-white' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      style={currentPage === page ? {backgroundColor: '#901b20'} : {}}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-sm text-gray-500">...</span>}
                      <button 
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
              
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;