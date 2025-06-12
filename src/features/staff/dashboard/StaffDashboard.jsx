import React from 'react';

const Staff = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-[#901b20] mb-4 text-center">Staff</h1>
        <p className="text-gray-700 text-center mb-8">
          Meet our dedicated staff members.
        </p>
        {/* Add your staff content/components here */}
        <ul className="list-disc pl-6 text-gray-800">
          <li>John Doe - Manager</li>
          <li>Jane Smith - Coordinator</li>
          {/* Add more staff as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Staff;