import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Users, Check, X, Send, UserX } from 'lucide-react';
import { REACT_APP_API_ASSET_URL } from '../../../services/apiConfig';
import Navbar from '../../../components/Layout/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getConnectedUsers, getPendingConnections, getSentConnections, acceptConnection, rejectConnection, disconnectConnection } from '../../../services/connectionsApi';

// --- Redesigned Card Components ---

const ConnectionCard = ({ user, onDisconnect }) => {
    const navigate = useNavigate();
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-5 text-center flex flex-col h-full">
            <img src={`${REACT_APP_API_ASSET_URL}/` + user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff`} alt={user.first_name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white shadow-md -mt-12" />
            <h3 className="font-bold text-gray-800 text-base mt-3 truncate">{user.first_name} {user.last_name}</h3>
            <p className="text-xs text-gray-500 mb-3 truncate">{user.track}</p>
            <div className="flex-grow"></div>
            <div className="space-y-2 mt-auto">
                <button
                    className="w-full text-sm font-semibold py-2 px-3 rounded-lg border border-gray-300 bg-white/50 hover:border-[#901b20] hover:text-[#901b20] transition-colors"
                    onClick={() => navigate(`/profile/${user.id}`)}
                >
                    View Profile
                </button>
                <button onClick={() => onDisconnect(user.id)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><UserX size={16}/>Disconnect</button>
            </div>
        </motion.div>
    );
};

const RequestCard = ({ user, onAccept, onDecline }) => (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-5 text-center flex flex-col h-full">
        <img src={`${REACT_APP_API_ASSET_URL}/` + user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff`} alt={user.first_name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white shadow-md -mt-12" />
        <h3 className="font-bold text-gray-800 text-base mt-3 truncate">{user.first_name} {user.last_name}</h3>
        <p className="text-xs text-gray-500 mb-3 truncate">{user.track}</p>
        {user.message && <div className="flex-grow text-xs italic text-gray-600 bg-gray-100/70 p-2 rounded-md mb-3 line-clamp-2">"{user.message}"</div>}
        <div className="space-y-2 mt-auto">
            <button onClick={() => onAccept(user.connection_id)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg text-white bg-gradient-to-r from-[#901b20] to-[#a83236] hover:shadow-lg transition-shadow"><Check size={16}/>Accept</button>
            <button onClick={() => onDecline(user.connection_id)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"><X size={16}/>Decline</button>
        </div>
    </motion.div>
);

const SentRequestCard = ({ user }) => (
     <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-5 text-center flex flex-col h-full">
        <img src={`${REACT_APP_API_ASSET_URL}/` + user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff`} alt={user.first_name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white shadow-md -mt-12" />
        <h3 className="font-bold text-gray-800 text-base mt-3 truncate">{user.first_name} {user.last_name}</h3>
        <p className="text-xs text-gray-500 mb-3 truncate">{user.track}</p>
        <div className="flex-grow"></div>
        <div className="mt-auto w-full">
            <button disabled className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"><Send size={16}/>Request Sent</button>
        </div>
    </motion.div>
);

const NetworkHub = () => {
    const [activeTab, setActiveTab] = useState('connections');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [connections, setConnections] = useState([]);
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [sentConnections, setSentConnections] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    const transformUserData = (apiData, type) => {
        // FIX: Ensure we always work with an array to prevent crashes.
        if (!Array.isArray(apiData)) return [];
        
        return apiData.map(item => {
            let userData;
            if (type === 'connections') { userData = { ...item.user, connection_id: item.connection_id, connected_at: item.connected_at }; } 
            else if (type === 'requests') { userData = { ...item.requester, connection_id: item.connection_id, requested_at: item.requested_at, message: item.message }; }
            else if (type === 'sent') { userData = { ...item.addressee, connection_id: item.connection_id, requested_at: item.requested_at, message: item.message }; }

            return { id: userData.id, connection_id: userData.connection_id, email: userData.email, first_name: userData.full_name?.split(' ')[0] || 'User', last_name: userData.full_name?.split(' ').slice(1).join(' ') || '', username: userData.profile?.username || '', image: userData.profile?.profile_picture, track: userData.profile?.track || 'ITI Member', branch: userData.profile?.branch || 'Unknown', intake: userData.profile?.intake || 'N/A', program: userData.profile?.program || 'Unknown', connected_at: userData.connected_at, requested_at: userData.requested_at, message: userData.message, profile: userData.profile || null };
        });
    };

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            let response;
            if (activeTab === 'connections') { response = await getConnectedUsers(page); setConnections(transformUserData(response.data.data, 'connections')); }
            else if (activeTab === 'requests') { response = await getPendingConnections(page); setConnectionRequests(transformUserData(response.data.data, 'requests')); }
            else if (activeTab === 'sent') { response = await getSentConnections(page); setSentConnections(transformUserData(response.data.data, 'sent')); }
            if (response?.data) { setPagination({ currentPage: response.data.current_page, totalPages: response.data.last_page, totalItems: response.data.total }); }
        } catch (err) { setError(err.message || 'Failed to load connections'); toast.error('Failed to load connections'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(1); }, [activeTab]);
    
    const handleAcceptRequest = async (id) => { try { await acceptConnection(id); const user = connectionRequests.find(req => req.connection_id === id); if(user) setConnections(p => [user, ...p]); setConnectionRequests(p => p.filter(req => req.connection_id !== id)); toast.success('Connection accepted!'); } catch (err) { toast.error(err.response?.data?.message || 'Failed to accept'); }};
    const handleDeclineRequest = async (id) => { try { await rejectConnection(id); setConnectionRequests(p => p.filter(req => req.connection_id !== id)); toast.info('Connection declined.'); } catch (err) { toast.error(err.response?.data?.message || 'Failed to decline'); }};
    const handleDisconnect = async (userId) => { try { await disconnectConnection(userId); setConnections(p => p.filter(c => c.id !== userId)); toast.info('Connection removed.'); } catch (err) { toast.error(err.response?.data?.message || 'Failed to disconnect'); }};

    const filteredConnections = useMemo(() => connections.filter(user => user.first_name.toLowerCase().includes(searchTerm.toLowerCase())), [connections, searchTerm]);
    const filteredRequests = useMemo(() => connectionRequests.filter(user => user.first_name.toLowerCase().includes(searchTerm.toLowerCase())), [connectionRequests, searchTerm]);
    const filteredSentRequests = useMemo(() => sentConnections.filter(user => user.first_name.toLowerCase().includes(searchTerm.toLowerCase())), [sentConnections, searchTerm]);

    const TABS = [
        { id: 'connections', label: 'My Connections', icon: <Users size={18}/>, data: filteredConnections },
        { id: 'requests', label: 'Connection Requests', icon: <User size={18}/>, data: filteredRequests },
        { id: 'sent', label: 'Sent Requests', icon: <Send size={18}/>, data: filteredSentRequests },
    ];
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

            <main className="pt-24 pb-10 px-4 sm:px-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Hub</span></h1>
                        <p className="text-gray-600 text-lg">Manage your professional connections and grow your network.</p>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-1.5 mb-6 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                            {TABS.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                                    {activeTab === tab.id && <motion.div layoutId="activeNetworkTab" className="absolute inset-0 bg-gradient-to-r from-[#901b20] to-[#a83236] rounded-lg shadow-md" />}
                                    <span className="relative z-10">{tab.icon}</span>
                                    {/* FIX: This is now safe because `tab.data` is guaranteed to be an array. */}
                                    <span className="relative z-10">{tab.label} ({tab.data?.length ?? 0})</span>
                                </button>
                            ))}
                        </div>
                    
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                {loading ? (
                                    <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#901b20]"></div></div>
                                ) : error ? (
                                    <div className="text-center py-20 text-red-500">{error}</div>
                                ) : (
                                    <>
                                        {activeTab === 'connections' && (
                                            (filteredConnections?.length > 0) ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-10"><AnimatePresence>{filteredConnections.map(user => <ConnectionCard key={user.id} user={user} onDisconnect={handleDisconnect} />)}</AnimatePresence></div>
                                            ) : (<div className="text-center py-20 text-gray-500"><Users className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-lg font-semibold">No Connections Yet</h3><p>Explore ITIans to build your network.</p></div>)
                                        )}
                                        {activeTab === 'requests' && (
                                            (filteredRequests?.length > 0) ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-10"><AnimatePresence>{filteredRequests.map(user => <RequestCard key={user.id} user={user} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} />)}</AnimatePresence></div>
                                            ) : (<div className="text-center py-20 text-gray-500"><User className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-lg font-semibold">No Pending Requests</h3><p>Requests to connect with you will appear here.</p></div>)
                                        )}
                                        {activeTab === 'sent' && (
                                            (filteredSentRequests?.length > 0) ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-10"><AnimatePresence>{filteredSentRequests.map(user => <SentRequestCard key={user.id} user={user} />)}</AnimatePresence></div>
                                            ) : (<div className="text-center py-20 text-gray-500"><Send className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-lg font-semibold">No Sent Requests</h3><p>Your sent connection requests will appear here.</p></div>)
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default NetworkHub;