import React, { useState } from 'react';

/**
 * UsersList component displays user data with filtering and pagination
 */
const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock users data
  const mockUsers = [
    { id: 1, name: 'Ahmed Mohamed', email: 'ahmed.mohamed@example.com', role: 'student', status: 'active' },
    { id: 2, name: 'Sara Ahmed', email: 'sara.ahmed@example.com', role: 'alumni', status: 'active' },
    { id: 3, name: 'Omar Khaled', email: 'omar.khaled@example.com', role: 'company', status: 'inactive' },
    { id: 4, name: 'Nada Ibrahim', email: 'nada.ibrahim@example.com', role: 'staff', status: 'active' },
    { id: 5, name: 'Mahmoud Ali', email: 'mahmoud.ali@example.com', role: 'student', status: 'pending' },
    { id: 6, name: 'Amira Hassan', email: 'amira.hassan@example.com', role: 'alumni', status: 'active' },
    { id: 7, name: 'Khaled Samir', email: 'khaled.samir@example.com', role: 'company', status: 'active' },
    { id: 8, name: 'Laila Mostafa', email: 'laila.mostafa@example.com', role: 'staff', status: 'inactive' },
  ];
  
  // Filter users based on search term and role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRole === 'all' || user.role === userRole;
    return matchesSearch && matchesRole;
  });
  
  // Pagination
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage, 
    currentPage * usersPerPage
  );
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20]"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="company">Company</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'student' ? 'bg-blue-100 text-blue-800' : 
                        user.role === 'alumni' ? 'bg-green-100 text-green-800' :
                        user.role === 'company' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#901b20] hover:text-[#a83236] mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-[#901b20] text-white border-[#901b20]'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
