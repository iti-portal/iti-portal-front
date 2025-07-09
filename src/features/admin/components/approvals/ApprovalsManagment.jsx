import React, { useEffect, useState, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchPendingApprovals, approveUser, rejectUser } from '../../../../services/approvalApi';

const Approvals = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const response = await fetchPendingApprovals();
        setPendingApprovals(response.data.data.data);
      } catch (error) {
        console.error('Error fetching approvals:', error);
        toast.error('Failed to load approvals.');
      } finally {
        setLoading(false);
      }
    };

    loadApprovals();
  }, []);

  const handleApprove = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to approve this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await approveUser(id);
                setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
                toast.dismiss();
                toast.success('User approved successfully!');
              } catch (err) {
                console.error('Error approving user:', err);
                toast.error('Failed to approve user.');
              }
            }}
            className="px-3 py-1 text-white bg-green-600 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleReject = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to reject this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await rejectUser(id);
                setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
                toast.dismiss();
                toast.success('User rejected successfully!');
              } catch (err) {
                console.error('Error rejecting user:', err);
                toast.error('Failed to reject user.');
              }
            }}
            className="px-3 py-1 text-white bg-red-600 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const tabs = [
    { name: 'All', count: pendingApprovals.length },
    {
      name: 'Users',
      count: pendingApprovals.filter((a) => a.roles?.[0]?.name === 'student').length,
    },
    {
      name: 'Companies',
      count: pendingApprovals.filter((a) => a.roles?.[0]?.name === 'company').length,
    },
  ];

  const filteredApprovals = useMemo(() => {
    return pendingApprovals.filter((approval) => {
      const role = approval.roles?.[0]?.name;
      if (activeTab === 'All') return true;
      if (activeTab === 'Users') return role === 'student';
      if (activeTab === 'Companies') return role === 'company';
      return true;
    });
  }, [activeTab, pendingApprovals]);

  const ApprovalCard = ({ approval }) => {
    const role = approval.roles?.[0]?.name;
    const isCompany = role === 'company';
    const type = isCompany ? 'Company' : 'User';
    const name = isCompany
      ? approval.company_profile?.company_name || approval.email
      : approval.profile
        ? `${approval.profile.first_name} ${approval.profile.last_name}`
        : approval.email;
    const submitted = new Date(approval.created_at).toLocaleDateString();

    return (
      <motion.div
        whileHover={{ scale: 1.025, boxShadow: '0 4px 16px 0 rgba(144,27,32,0.08)' }}
        transition={{ type: 'tween', duration: 0.18 }}
        className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-150"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-[#f3f4f6] flex-shrink-0 flex items-center justify-center text-[#901b20] font-bold text-lg">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">{name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                isCompany ? 'text-[#901b20] bg-[#901b20]/10' : 'text-yellow-700 bg-yellow-100'
              }`}>
                {type}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Submitted: {submitted}</p>
            <div className="space-y-0.5 text-xs text-gray-600">
              <p>Email: {approval.email}</p>
              {isCompany ? (
                <>
                  {approval.company_profile?.location && <p>Location: {approval.company_profile.location}</p>}
                  {approval.company_profile?.industry && <p>Industry: {approval.company_profile.industry}</p>}
                  {approval.company_profile?.company_size && <p>Size: {approval.company_profile.company_size}</p>}
                </>
              ) : (
                <>
                  {approval.profile?.phone && <p>Phone: {approval.profile.phone}</p>}
                  {approval.profile?.branch && <p>Branch: {approval.profile.branch}</p>}
                  {approval.profile?.track && <p>Track: {approval.profile.track}</p>}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => handleReject(approval.id)}
            className="px-4 py-1.5 text-sm font-medium text-[#901b20] bg-white border border-[#901b20] rounded hover:bg-[#901b20]/10 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => handleApprove(approval.id)}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#901b20] rounded hover:bg-[#901b20]/90 transition-colors"
          >
            Approve
          </button>
        </div>
      </motion.div>
    );
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>

          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.name
                    ? 'bg-[#901b20] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {filteredApprovals.length === 0 ? (
            <motion.div
              key="no-approvals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500"
            >
              No approvals found.
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Approvals;