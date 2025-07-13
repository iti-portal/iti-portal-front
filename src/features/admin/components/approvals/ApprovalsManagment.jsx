import React, { useEffect, useState, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW: Imports for the profile popup ---
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Globe, Image as ImageIcon } from 'lucide-react';

import { fetchPendingApprovals, approveUser, rejectUser } from '../../../../services/approvalApi';

const Approvals = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: Initialize SweetAlert2 ---
  const MySwal = withReactContent(Swal);

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
    // ... existing approve logic is unchanged
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
    // ... existing reject logic is unchanged
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
  
  // --- NEW: Function to show the profile popup ---
  const handleShowProfile = (approval) => {
    const isCompany = approval.roles?.[0]?.name === 'company';
    const profile = approval.profile;
    const companyProfile = approval.company_profile;
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

    const getFullImageUrl = (path) => path ? `${baseUrl}/storage/${path}` : null;

    MySwal.fire({
      title: <strong>{isCompany ? companyProfile.company_name : `${profile.first_name} ${profile.last_name}`}'s Profile</strong>,
      html: (
        <div className="text-left space-y-4 max-h-[70vh] overflow-y-auto p-1">
          {isCompany ? (
            // --- COMPANY PROFILE VIEW ---
            <>
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center text-red-600 overflow-hidden">
                  {companyProfile.logo ? (
                    <img src={getFullImageUrl(companyProfile.logo)} alt={companyProfile.company_name} className="rounded-full w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-medium">{companyProfile.company_name?.charAt(0) || ''}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{companyProfile.company_name}</h3>
                  <p className="text-gray-600">{companyProfile.industry}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">ABOUT</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{companyProfile.description || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-medium">{companyProfile.industry || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Company Size</p><p className="text-sm font-medium">{companyProfile.company_size || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Location</p><p className="text-sm font-medium">{companyProfile.location || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Established</p><p className="text-sm font-medium">{companyProfile.established_at ? new Date(companyProfile.established_at).getFullYear() : 'N/A'}</p></div>
              </div>
              {companyProfile.website && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">WEBSITE</h4>
                  <div className="flex items-center text-sm"><Globe className="w-4 h-4 mr-2 text-gray-400" /><a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{companyProfile.website}</a></div>
                </div>
              )}
            </>
          ) : (
            // --- USER PROFILE VIEW ---
            <>
              <div className="flex items-start gap-4">
                <img src={getFullImageUrl(profile.profile_picture) || '/avatar.png'} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-red-100" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{`${profile.first_name} ${profile.last_name}`}</h3>
                  <p className="text-gray-600">{profile.track} - {profile.branch}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">SUMMARY</h4>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-700">{profile.summary || 'N/A'}</p></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium">{approval.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium">{profile.phone || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Track</p><p className="text-sm font-medium">{profile.track || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Branch</p><p className="text-sm font-medium">{profile.branch || 'N/A'}</p></div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">DOCUMENTS</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'NID Front', url: getFullImageUrl(profile.nid_front_image) },
                    { title: 'NID Back', url: getFullImageUrl(profile.nid_back_image) }
                  ].map(doc => (
                    <div key={doc.title} className="bg-gray-100 rounded-lg p-3 text-center">
                      {doc.url ? <img src={doc.url} alt={doc.title} className="w-full h-24 object-contain rounded"/> : <div className="h-24 flex items-center justify-center text-gray-400"><ImageIcon size={32}/></div>}
                      <p className="text-xs mt-2 text-gray-600">{doc.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: '800px',
      padding: '1.5rem',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        title: 'text-2xl font-bold text-gray-800 mb-4',
        htmlContainer: 'text-left',
        closeButton: 'text-gray-400 hover:text-gray-600'
      }
    });
  };

  const tabs = [
    { name: 'All', count: pendingApprovals.length },
    { name: 'Users', count: pendingApprovals.filter((a) => a.roles?.[0]?.name === 'student' || a.roles?.[0]?.name === 'alumni').length },
    { name: 'Companies', count: pendingApprovals.filter((a) => a.roles?.[0]?.name === 'company').length, },
  ];

  const filteredApprovals = useMemo(() => {
    return pendingApprovals.filter((approval) => {
      const role = approval.roles?.[0]?.name;
      if (activeTab === 'All') return true;
      if (activeTab === 'Users') return role === 'student' || role === 'alumni';
      if (activeTab === 'Companies') return role === 'company';
      return true;
    });
  }, [activeTab, pendingApprovals]);

  const ApprovalCard = ({ approval }) => {
    const role = approval.roles?.[0]?.name;
    const isCompany = role === 'company';
    const type = isCompany ? 'Company' : (role === 'alumni' ? 'Alumni' : 'Student');
    const name = isCompany ? approval.company_profile?.company_name || approval.email : (approval.profile ? `${approval.profile.first_name} ${approval.profile.last_name}` : approval.email);
    const submitted = new Date(approval.created_at).toLocaleDateString();

    return (
      <motion.div
        whileHover={{ scale: 1.025, boxShadow: '0 4px 16px 0 rgba(144,27,32,0.08)' }}
        transition={{ type: 'tween', duration: 0.18 }}
        className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col"
      >
        <div className="flex-grow">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-[#f3f4f6] flex-shrink-0 flex items-center justify-center text-[#901b20] font-bold text-lg">
              {name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-base truncate">{name}</h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${isCompany ? 'text-[#901b20] bg-[#901b20]/10' : 'text-yellow-700 bg-yellow-100'}`}>
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
                  </>
                ) : (
                  <>
                    {approval.profile?.branch && <p>Branch: {approval.profile.branch}</p>}
                    {approval.profile?.track && <p>Track: {approval.profile.track}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* --- MODIFIED: Added a Profile button and adjusted layout --- */}
        <div className="flex items-center justify-end gap-2 mt-5">
           <button
            onClick={() => handleShowProfile(approval)}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors flex-1 text-center"
          >
            Profile
          </button>
          <button
            onClick={() => handleReject(approval.id)}
            className="px-4 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
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
    // ... loading UI is unchanged
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
    // ... main component return is unchanged
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button key={tab.name} onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.name ? 'bg-[#901b20] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {filteredApprovals.length === 0 ? (
            <motion.div key="no-approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="text-center text-gray-500 py-16"
            >
              No pending approvals in this category.
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
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