import React, { useState, useMemo, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import UserCard from './UserCard ';
import { fetchUsers } from '../../services/usersApi';
import Navbar from '../../components/Layout/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExploreItians = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    tracks: [],
    programs: [],
    branches: [],
    intakes: []
  });
  const [connectedUsers, setConnectedUsers] = useState([]);

  const handleConnectionSuccess = (userId) => {
    setConnectedUsers(prev => [...prev, userId]);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetchUsers();
        
        console.log('API Response:', response);

        const usersArray = response?.data?.users?.data || [];
        
        if (!Array.isArray(usersArray)) {
          throw new Error('Users data is not in expected array format');
        }

        const transformedUsers = usersArray.map(user => {
          const profile = user.profile || {};
          return {
            id: user.id,
            first_name: profile.first_name || 'Unknown',
            last_name: profile.last_name || '',
            username: profile.username || '',
            intake: profile.intake || '',
            track: profile.track || 'Unknown',
            program: profile.program || 'Unknown',
            branch: profile.branch || 'Unknown',
            image: profile.profile_picture || `https://ui-avatars.com/api/?name=${profile.first_name || 'User'}+${profile.last_name || ''}&background=901b20&color=fff&size=150`,
            profile,
            status: user.status,
            mutualConnections: user.mutual_connections_count ?? 0,
          };
        });

        setUsers(transformedUsers);

        const tracks = [...new Set(usersArray.map(user => user.profile?.track).filter(Boolean))];
        const programs = [...new Set(usersArray.map(user => user.profile?.program).filter(Boolean))];
        const branches = [...new Set(usersArray.map(user => user.profile?.branch).filter(Boolean))];
        const intakes = [...new Set(usersArray.map(user => user.profile?.intake).filter(Boolean))];

        setFilterOptions({
          tracks,
          programs,
          branches,
          intakes: intakes.sort((a, b) => parseInt(b) - parseInt(a))
        });
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        fullName.includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIntake = selectedIntake === '' || user.intake.toString() === selectedIntake;
      const matchesTrack = selectedTrack === '' || user.track === selectedTrack;
      const matchesProgram = selectedProgram === '' || user.program === selectedProgram;
      const matchesBranch = selectedBranch === '' || user.branch === selectedBranch;

      return matchesSearch && matchesIntake && matchesTrack && matchesProgram && matchesBranch;
    });
  }, [searchTerm, selectedIntake, selectedTrack, selectedProgram, selectedBranch, users]);

  // Filter out connected users
  const usersToDisplay = useMemo(() => {
    return filteredUsers.filter(user => !connectedUsers.includes(user.id));
  }, [filteredUsers, connectedUsers]);

  const clearFilters = () => {
    setSelectedIntake('');
    setSelectedTrack('');
    setSelectedProgram('');
    setSelectedBranch('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Itians</h1>
            <p className="text-gray-600">Connect with students and alumni</p>
          </div>

          {/* Filter section remains the same */}
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#901b20] mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 text-sm bg-[#901b20] text-white px-4 py-2 rounded hover:bg-[#7a1619]"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {usersToDisplay.length} of {users.length} members
                </p>
              </div>

              {usersToDisplay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {usersToDisplay.map(user => (
                    <UserCard 
                      key={user.id} 
                      user={user} 
                      onConnectionSuccess={handleConnectionSuccess}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExploreItians;