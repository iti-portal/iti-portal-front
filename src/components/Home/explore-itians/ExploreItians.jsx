import React, { useState, useMemo, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import UserCard from './UserCard ';
import { fetchUsers } from '../../../services/usersApi';

const ExploreItians = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetchUsers();
        
        console.log('API Response:', response);

        // Extract users array from the nested structure
        const usersArray = response?.data?.users?.data || [];
        
        if (!Array.isArray(usersArray)) {
          throw new Error('Users data is not in expected array format');
        }

        // Transform the data to match component's expected structure
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
            profile 
          };
        });

        setUsers(transformedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const tracks = ['Open Source', 'PD', 'AI', 'Java', 'Web and UI', 'Testing', 'Mobile Development'];
  const programs = ['PTP', 'ITP'];
  const branches = ['Smart', 'Mansoura', 'Alexandria', 'Asyut', 'Aswan', 'Tanta', 'Zagazig', 'Menofia'];

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

  const clearFilters = () => {
    setSelectedIntake('');
    setSelectedTrack('');
    setSelectedProgram('');
    setSelectedBranch('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Itians</h1>
          <p className="text-gray-600">Connect with students and alumni</p>
        </div>

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
                {Array.from({ length: 45 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num.toString()}>Intake {num}</option>
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
                {tracks.map(track => (
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
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
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
                {branches.map(branch => (
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
                Showing {filteredUsers.length} of {users.length} members
              </p>
            </div>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map(user => (
                  <UserCard key={user.id} user={user} />
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
    </div>
  );
};

export default ExploreItians;