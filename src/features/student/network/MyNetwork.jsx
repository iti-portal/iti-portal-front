import React, { useState, useMemo, useEffect } from 'react';
import { Search, User, MapPin, Users, Filter, Send } from 'lucide-react';
import UserCard from './UserCard';
import Navbar from '../../../components/Layout/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getConnectedUsers, 
  getPendingConnections, 
  getSentConnections,
  acceptConnection,
  rejectConnection,
  disconnectConnection
} from '../../../services/connectionsApi';

const NetworkHub = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [sentConnections, setSentConnections] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Filter state
  const [selectedIntake, setSelectedIntake] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // Transform API data to consistent format based on type
  const transformUserData = (apiData, type) => {
    if (!apiData) return [];
    
    return apiData.map(item => {
      let userData;
      if (type === 'connections') {
        userData = {
          ...item.user,
          connection_id: item.connection_id,
          connected_at: item.connected_at
        };
      } else if (type === 'requests') {
        userData = {
          ...item.requester,
          connection_id: item.connection_id,
          requested_at: item.requested_at,
          message: item.message
        };
      } else if (type === 'sent') {
        userData = {
          ...item.addressee,
          connection_id: item.connection_id,
          requested_at: item.requested_at,
          message: item.message
        };
      }

      return {
        id: userData.id,
        connection_id: userData.connection_id,
        email: userData.email,
        first_name: userData.full_name?.split(' ')[0] || userData.email?.split('@')[0] || 'User',
        last_name: userData.full_name?.split(' ').slice(1).join(' ') || '',
        username: userData.profile?.username || '',
        image: userData.profile?.profile_picture,
        track: userData.profile?.track || 'ITI Member',
        branch: userData.profile?.branch || 'Unknown',
        intake: userData.profile?.intake || 'N/A',
        program: userData.profile?.program || 'Unknown',
        connected_at: userData.connected_at,
        requested_at: userData.requested_at,
        message: userData.message,
        profile: userData.profile || null,
        mutual_connections_count: 0
      };
    });
  };

  // Calculate filter options from all data
  const filterOptions = useMemo(() => {
    const allData = [...connections, ...connectionRequests, ...sentConnections];
    
    const intakes = [...new Set(allData.map(user => user.intake).filter(Boolean))].sort();
    const tracks = [...new Set(allData.map(user => user.track).filter(Boolean))].sort();
    const programs = [...new Set(allData.map(user => user.program).filter(Boolean))].sort();
    const branches = [...new Set(allData.map(user => user.branch).filter(Boolean))].sort();

    return { intakes, tracks, programs, branches };
  }, [connections, connectionRequests, sentConnections]);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      let response;
      
      switch (activeTab) {
        case 'connections':
          response = await getConnectedUsers(page);
          setConnections(transformUserData(response.data.data, 'connections'));
          break;
        case 'requests':
          response = await getPendingConnections(page);
          setConnectionRequests(transformUserData(response.data.data, 'requests'));
          break;
        case 'sent':
          response = await getSentConnections(page);
          setSentConnections(transformUserData(response.data.data, 'sent'));
          break;
        default:
          break;
      }

      if (response?.data) {
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError(err.message || 'Failed to load connections');
      setLoading(false);
      toast.error('Failed to load connections');
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAcceptRequest = async (connectionId) => {
    try {
      await acceptConnection(connectionId);
      const acceptedUser = connectionRequests.find(req => req.connection_id === connectionId);
      if (acceptedUser) {
        setConnections(prev => [...prev, acceptedUser]);
      }
      setConnectionRequests(prev => prev.filter(req => req.connection_id !== connectionId));
      toast.success('Connection request accepted successfully');
    } catch (err) {
      console.error('Error accepting request:', err);
      toast.error(err.response?.data?.message || 'Failed to accept connection');
    }
  };

  const handleDeclineRequest = async (connectionId) => {
    try {
      await rejectConnection(connectionId);
      setConnectionRequests(prev => prev.filter(req => req.connection_id !== connectionId));
      toast.success('Connection request declined successfully');
    } catch (err) {
      console.error('Error declining request:', err);
      toast.error(err.response?.data?.message || 'Failed to decline request');
    }
  };


  const handleDisconnect = async (userId) => {
    try {
        await disconnectConnection(userId);
        setConnections(prev => prev.filter(conn => conn.id !== userId));
        toast.success('Connection removed successfully');
    } catch (err) {
        console.error('Error disconnecting:', err);
        toast.error(err.response?.data?.message || 'Failed to disconnect');
    }
  };



  // Clear all filters
  const clearFilters = () => {
    setSelectedIntake('');
    setSelectedTrack('');
    setSelectedProgram('');
    setSelectedBranch('');
    setSearchTerm('');
  };

  // Filter function for any user list
  const filterUsers = (users) => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email?.toLowerCase() || '';
      const username = user.username?.toLowerCase() || '';
      const track = user.track?.toLowerCase() || '';
      const branch = user.branch?.toLowerCase() || '';
      const message = user.message?.toLowerCase() || '';

      // Search filter
      const matchesSearch = searchTerm === '' ||
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        username.includes(searchLower) ||
        track.includes(searchLower) ||
        branch.includes(searchLower) ||
        message.includes(searchLower);

      // Dropdown filters
      const matchesIntake = selectedIntake === '' || user.intake === selectedIntake;
      const matchesTrack = selectedTrack === '' || user.track === selectedTrack;
      const matchesProgram = selectedProgram === '' || user.program === selectedProgram;
      const matchesBranch = selectedBranch === '' || user.branch === selectedBranch;

      return matchesSearch && matchesIntake && matchesTrack && matchesProgram && matchesBranch;
    });
  };

  const filteredConnections = useMemo(() => filterUsers(connections), [
    connections, searchTerm, selectedIntake, selectedTrack, selectedProgram, selectedBranch
  ]);

  const filteredRequests = useMemo(() => filterUsers(connectionRequests), [
    connectionRequests, searchTerm, selectedIntake, selectedTrack, selectedProgram, selectedBranch
  ]);

  const filteredSentRequests = useMemo(() => filterUsers(sentConnections), [
    sentConnections, searchTerm, selectedIntake, selectedTrack, selectedProgram, selectedBranch
  ]);

  const RequestCard = React.memo(({ user }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
        <img 
          src={user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{user.first_name} {user.last_name}</h3>
      <p className="text-sm text-gray-600 mb-1">{user.track}</p>
      <p className="text-xs text-gray-500 mb-1">Intake {user.intake} • {user.branch}</p>
      {user.message && (
        <p className="text-xs text-gray-500 italic mb-2">"{user.message}"</p>
      )}
      <p className="text-xs text-gray-400 mb-4">
        Requested on: {new Date(user.requested_at).toLocaleDateString()}
      </p>
      <div className="flex gap-2 w-full">
        <button 
          onClick={() => handleAcceptRequest(user.connection_id)}
          className="flex-1 bg-[#901b20] hover:bg-[#7a1519] text-white text-sm py-2 px-4 rounded transition-colors"
        >
          Accept
        </button>
        <button 
          onClick={() => handleDeclineRequest(user.connection_id)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 px-4 rounded transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  ));

  const SentRequestCard = React.memo(({ user, onWithdraw }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
        <img 
          src={user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibfont-semibold text-gray-900 mb-1">{user.first_name} {user.last_name}</h3>
      <p className="text-sm text-gray-600 mb-1">{user.track}</p>
      <p className="text-xs text-gray-500 mb-1">Intake {user.intake} • {user.branch}</p>
      <p className="text-xs text-gray-400 mb-4">
        Sent on: {new Date(user.requested_at).toLocaleDateString()}
      </p>
        <button 
        disabled
        className="w-full bg-gray-200 text-gray-400 text-sm py-2 px-4 rounded transition-colors cursor-not-allowed"
        >
        Request Sent
        </button>

    </div>
  ));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Network Hub</h1>
            
            <div className="flex mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('connections')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'connections'
                        ? 'text-white bg-[#901b20] border-b-2 border-[#901b20]'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    My Connections
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'requests'
                        ? 'text-white bg-[#901b20] border-b-2 border-[#901b20]'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Connection Requests
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'sent'
                        ? 'text-white bg-[#901b20] border-b-2 border-[#901b20]'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Sent Requests
                </button>
            </div>
            
            {/* Filter section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intake</label>
                  <select
                    value={selectedIntake}
                    onChange={(e) => setSelectedIntake(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none"
                  >
                    <option value="">All Intakes</option>
                    {filterOptions.intakes.map(intake => (
                      <option key={intake} value={intake}>Intake {intake}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Track</label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none"
                  >
                    <option value="">All Tracks</option>
                    {filterOptions.tracks.map(track => (
                      <option key={track} value={track}>{track}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none"
                  >
                    <option value="">All Programs</option>
                    {filterOptions.programs.map(program => (
                      <option key={program} value={program}>{program.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none"
                  >
                    <option value="">All Branches</option>
                    {filterOptions.branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#901b20] hover:text-[#7a1619] font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#901b20] mb-4"></div>
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Error: {error}</p>
              <button 
                onClick={() => fetchData()}
                className="mt-4 text-sm bg-[#901b20] text-white px-4 py-2 rounded hover:bg-[#7a1619]"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'connections' && (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                      {filteredConnections.length} of {connections.length} connections
                    </p>
                    {pagination.totalPages > 1 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1">
                          Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>

                  {filteredConnections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredConnections.map(user => (
                        <UserCard 
                          key={`connection-${user.connection_id}`}
                          user={user} 
                          isConnected={true}
                          onDisconnect={() => handleDisconnect(user.connection_id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {connections.length === 0 ? 'No connections yet' : 'No connections match your filters'}
                      </h3>
                      <p className="text-gray-600">
                        {connections.length === 0 
                          ? 'Start connecting with other members to build your network'
                          : 'Try adjusting your search criteria or clearing filters'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'requests' && (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                      {filteredRequests.length} of {connectionRequests.length} requests
                    </p>
                  </div>

                  {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredRequests.map(user => (
                        <RequestCard 
                          key={`request-${user.connection_id}`}
                          user={user} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {connectionRequests.length === 0 ? 'No pending requests' : 'No requests match your filters'}
                      </h3>
                      <p className="text-gray-600">
                        {connectionRequests.length === 0 
                          ? 'When someone sends you a connection request, it will appear here'
                          : 'Try adjusting your search criteria or clearing filters'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'sent' && (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                      {filteredSentRequests.length} of {sentConnections.length} sent requests
                    </p>
                  </div>

                  {filteredSentRequests.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredSentRequests.map(user => (
                        <SentRequestCard 
                          key={`sent-${user.connection_id}`}
                          user={user}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {sentConnections.length === 0 ? 'No sent requests' : 'No sent requests match your filters'}
                      </h3>
                      <p className="text-gray-600">
                        {sentConnections.length === 0 
                          ? 'When you send connection requests, they will appear here'
                          : 'Try adjusting your search criteria or clearing filters'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default NetworkHub;