import React, { useState } from 'react';

const Approvals = () => {
  const [activeTab, setActiveTab] = useState('All');

  const pendingApprovals = [
    {
      id: 'A001',
      name: 'Alice Johnson',
      type: 'User',
      nationalId: '1234567890',
      submitted: '2024-03-10',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A002',
      name: 'Global Innovations Ltd.',
      type: 'Company',
      businessType: 'Tech Solutions',
      submitted: '2024-03-12',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A003', 
      name: 'Robert Smith',
      type: 'User',
      nationalId: '0987654321',
      submitted: '2024-03-15',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A004',
      name: 'Future Ventures Co.',
      type: 'Company', 
      businessType: 'Investment Firm',
      submitted: '2024-03-18',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A005',
      name: 'Sophia Lee',
      type: 'User',
      nationalId: '1122334455',
      submitted: '2024-03-20',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A006',
      name: 'Artistic Creations Studio',
      type: 'Company',
      businessType: 'Creative Agency', 
      submitted: '2024-03-22',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'A007',
      name: 'David Chen',
      type: 'User',
      nationalId: '5566778899',
      submitted: '2024-03-25',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const tabs = [
    { name: 'All', count: 7 },
    { name: 'Users', count: 4 },
    { name: 'Companies', count: 3 }
  ];

  const ApprovalCard = ({ approval }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {approval.name.charAt(0)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-lg">{approval.name}</h3>
            {approval.type === 'Company' && (
              <span className="px-2 py-1 text-xs font-medium text-[#901b20] bg-[#901b20]/10 rounded">
                Company
              </span>
            )}
            {approval.type === 'User' && (
              <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                User
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            Submitted: {approval.submitted}
          </p>
          
          <div className="space-y-1 text-sm text-gray-600">
            {approval.nationalId && (
              <p>National ID: {approval.nationalId}</p>
            )}
            {approval.businessType && (
              <p>Business Type: {approval.businessType}</p>
            )}
            <p>ID: {approval.id}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-6">
        <button className="px-4 py-2 text-sm font-medium text-[#901b20] bg-white border border-[#901b20] rounded hover:bg-[#901b20]/10 transition-colors">
          Reject
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-[#901b20] rounded hover:bg-[#901b20]/90 transition-colors">
          Approve
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>
          
          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.name
                    ? 'bg-[#901b20] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Approvals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingApprovals
            .filter((approval) => {
              if (activeTab === 'All') return true;
              if (activeTab === 'Users') return approval.type === 'User';
              if (activeTab === 'Companies') return approval.type === 'Company';
              return true;
            })
            .map((approval) => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Approvals;