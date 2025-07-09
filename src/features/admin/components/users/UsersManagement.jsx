import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Trash2, UserX, UserCheck } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

import {
  fetchUsers as fetchUsersApi,
  approveUser,
  suspendUser,
  unsuspendUser,
  deleteUser,
} from '../../../../services/usersApi';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [trackFilter, setTrackFilter] = useState('All Tracks');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All Student Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState({});

  const getProgramColor = (program) => {
  switch (program?.toLowerCase()) {
    case 'itp':
      return 'bg-blue-100 text-blue-800';
    case 'icc':
      return 'bg-purple-100 text-purple-800';
    case 'ics':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'suspended':
      return 'bg-orange-100 text-orange-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStudentStatusColor = (status) => {
  switch (status) {
    case 'graduate':
      return 'bg-emerald-100 text-emerald-800';
    case 'current':
      return 'bg-blue-100 text-blue-800';
    case 'dropped':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsersApi(currentPage);
      if (data.success) {
        setUsers(data.data.users.data);
        setTotalPages(data.data.users.last_page || Math.ceil(data.data.users.total / data.data.users.per_page));
        setTotalUsers(data.data.users.total || data.data.users.data.length);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, currentPage]);

  const handleApprove = async (user) => {
    setActionLoading(prev => ({ ...prev, [`approve-${user.id}`]: true }));
    try {
      const data = await approveUser(user.id);
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'approved' } : u));
        toast.success(`User ${user.profile?.first_name} ${user.profile?.last_name} has been approved.`);
      } else {
        throw new Error(data.message || 'Failed to approve user');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to approve user.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve-${user.id}`]: false }));
    }
  };

  const handleSuspend = async (user) => {
    setActionLoading(prev => ({ ...prev, [`suspend-${user.id}`]: true }));
    try {
      const data = await suspendUser(user.id);
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'suspended' } : u));
        toast.success(`User ${user.profile?.first_name} ${user.profile?.last_name} has been suspended.`);
      } else {
        throw new Error(data.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to suspend user.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`suspend-${user.id}`]: false }));
    }
  };

  const handleUnsuspend = async (user) => {
    setActionLoading(prev => ({ ...prev, [`unsuspend-${user.id}`]: true }));
    try {
      const data = await unsuspendUser(user.id);
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
        toast.success(`User ${user.profile?.first_name} ${user.profile?.last_name} has been unsuspended.`);
      } else {
        throw new Error(data.message || 'Failed to unsuspend user');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to unsuspend user.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`unsuspend-${user.id}`]: false }));
    }
  };

  // Handle delete user with toast confirmation
  const handleDelete = async (user) => {
    const confirmDelete = () => {
      toast.dismiss();
      performDelete(user);
    };

    const cancelDelete = () => {
      toast.dismiss();
    };

    toast.warn(
      <div>
        <p>Are you sure you want to delete <strong>{user.profile?.first_name} {user.profile?.last_name}</strong>?</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={confirmDelete}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const performDelete = async (user) => {
    setActionLoading(prev => ({ ...prev, [`delete-${user.id}`]: true }));
    try {
      const data = await deleteUser(user.id);
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setTotalUsers(prev => prev - 1);
        toast.success(`User ${user.profile?.first_name} ${user.profile?.last_name} has been deleted.`);
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to delete user.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${user.id}`]: false }));
    }
  };

  // Render action buttons based on user status
  const renderActionButtons = (user) => {

    return (
      <div className="flex items-center gap-2">
        {/* Delete button (show for all statuses except rejected) */}
        {user.status !== 'rejected' && (
          <button
            onClick={() => handleDelete(user)}
            disabled={actionLoading[`delete-${user.id}`]}
            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={12} />
            {actionLoading[`delete-${user.id}`] ? 'Deleting...' : 'Delete'}
          </button>
        )}

        {/* Suspend button for active and approved users */}
        {(user.status === 'active' || user.status === 'approved') && (
          <button
            onClick={() => handleSuspend(user)}
            disabled={actionLoading[`suspend-${user.id}`]}
            className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserX size={12} />
            {actionLoading[`suspend-${user.id}`] ? 'Suspending...' : 'Suspend'}
          </button>
        )}

        {/* Unsuspend button for suspended users */}
        {user.status === 'suspended' && (
          <button
            onClick={() => handleUnsuspend(user)}
            disabled={actionLoading[`unsuspend-${user.id}`]}
            className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck size={12} />
            {actionLoading[`unsuspend-${user.id}`] ? 'Unsuspending...' : 'Unsuspend'}
          </button>
        )}

        {/* Approve button for pending users */}
        {user.status === 'pending' && (
          <button
            onClick={() => handleApprove(user)}
            disabled={actionLoading[`approve-${user.id}`]}
            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck size={12} />
            {actionLoading[`approve-${user.id}`] ? 'Approving...' : 'Approve'}
          </button>
        )}
      </div>
    );
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const profile = user.profile || {};
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    
    const matchesSearch = searchTerm === '' || 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.username && profile.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
    const matchesProgram = programFilter === 'All Programs' || profile.program === programFilter;
    const matchesTrack = trackFilter === 'All Tracks' || profile.track === trackFilter;
    const matchesStudentStatus = studentStatusFilter === 'All Student Status' || profile.student_status === studentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesProgram && matchesTrack && matchesStudentStatus;
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'search') setSearchTerm(value);
    if (filterType === 'status') setStatusFilter(value);
    if (filterType === 'program') setProgramFilter(value);
    if (filterType === 'track') setTrackFilter(value);
    if (filterType === 'studentStatus') setStudentStatusFilter(value);
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
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueValues = (field) => {
    const values = users.map(user => {
      if (field === 'status') return user.status;
      if (field === 'program') return user.profile?.program;
      if (field === 'track') return user.profile?.track;
      if (field === 'student_status') return user.profile?.student_status;
      return null;
    }).filter(value => value && value !== null);
    return [...new Set(values)];
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <ToastContainer position="top-right"/>
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading users: {error}</div>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <ToastContainer position="top-right"/>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6 overflow-x-auto">
          <div className="flex gap-4 items-center min-w-max">
            {/* Search */}
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option>All Statuses</option>
                {getUniqueValues('status').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Program Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={programFilter}
                onChange={(e) => handleFilterChange('program', e.target.value)}
              >
                <option>All Programs</option>
                {getUniqueValues('program').map(program => (
                  <option key={program} value={program}>{program?.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Track Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={trackFilter}
                onChange={(e) => handleFilterChange('track', e.target.value)}
              >
                <option>All Tracks</option>
                {getUniqueValues('track').map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Student Status Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={studentStatusFilter}
                onChange={(e) => handleFilterChange('studentStatus', e.target.value)}
              >
                <option>All Student Status</option>
                {getUniqueValues('student_status').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <tr>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Name</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Username</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Program</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Track</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Student Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Created</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 tracking-wide text-base">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/60 transition-colors group">
                    <td className="py-2 px-3 text-gray-900 font-medium whitespace-nowrap group-hover:text-blue-700">{user.profile ? `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.trim() : 'N/A'}</td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{user.profile?.username || 'N/A'}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProgramColor(user.profile?.program)}`}>{user.profile?.program?.toUpperCase() || 'N/A'}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{user.profile?.track || 'N/A'}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStudentStatusColor(user.profile?.student_status)}`}>{user.profile?.student_status || 'N/A'}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{formatDate(user.created_at)}</td>
                    <td className="py-2 px-3">{renderActionButtons(user)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-600">
              Showing {filteredUsers.length === 0 ? 0 : ((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, filteredUsers.length)} of {totalUsers} results
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-2 py-1 text-xs rounded-lg text-gray-500 hover:text-red-900 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {totalPages > 0 && (
                <>
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button 
                        onClick={() => setCurrentPage(1)}
                        className="px-2 py-1 text-xs rounded-lg text-gray-500 hover:text-red-900 hover:bg-red-50 transition"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-1 text-xs text-gray-400">...</span>}
                    </>
                  )}
                  {getPageNumbers().map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-1 text-xs rounded-lg font-semibold transition-colors ${currentPage === page ? 'bg-red-900 text-white shadow' : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-1 text-xs text-gray-400">...</span>}
                      <button 
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-2 py-1 text-xs rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition"
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
                className="px-2 py-1 text-xs rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Users;