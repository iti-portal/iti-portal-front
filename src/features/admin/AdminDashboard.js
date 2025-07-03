import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-[#901b20] mb-4 text-center">Admin Dashboard</h1>
        <p className="text-gray-700 text-center mb-8">
          Welcome, Admin! Here you can manage users, view statistics, and perform administrative tasks.
        </p>
        {/* Add your admin dashboard content/components here */}
        <div className="flex flex-col items-center space-y-4">
          <button className="px-6 py-2 rounded-lg font-semibold bg-[#901b20] text-white hover:bg-[#a83236] transition">
            Manage Users
          </button>
          <button className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;