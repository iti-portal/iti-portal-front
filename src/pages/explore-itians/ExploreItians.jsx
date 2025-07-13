// src/pages/Explore/ExploreItians.js

import React, { useState, useMemo, useEffect } from 'react';
import { Search, User, XCircle } from 'lucide-react'; // Added XCircle for clear button
import { motion, AnimatePresence } from 'framer-motion';
import UserCard from './UserCard '; // Corrected import (removed space)
import { fetchUsers } from '../../services/usersApi';
import Navbar from '../../components/Layout/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';

const ExploreItians = () => {
  // --- ALL LOGIC REMAINS UNCHANGED ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOptions, setFilterOptions] = useState({ tracks: [], programs: [], branches: [], intakes: [] });
  const [connectedUsers, setConnectedUsers] = useState([]);
  const { user: currentUser } = useAuth();

  const handleConnectionSuccess = (userId) => { setConnectedUsers(prev => [...prev, userId]); };
  
  useEffect(() => { const getUsers = async () => { try { setLoading(true); setError(''); const response = await fetchUsers(); const usersArray = response?.data?.users?.data || []; if (!Array.isArray(usersArray)) throw new Error('Users data is not in expected array format'); const transformedUsers = usersArray.map(user => ({ id: user.id, first_name: user.profile?.first_name || 'Unknown', last_name: user.profile?.last_name || '', username: user.profile?.username || '', intake: user.profile?.intake || '', track: user.profile?.track || 'Unknown', program: user.profile?.program || 'Unknown', branch: user.profile?.branch || 'Unknown', image: user.profile?.profile_picture || `https://ui-avatars.com/api/?name=${user.profile?.first_name || 'U'}+${user.profile?.last_name || ''}&background=901b20&color=fff&size=150`, status: user.status, mutualConnections: user.mutual_connections_count ?? 0, })); setUsers(transformedUsers); const tracks = [...new Set(usersArray.map(u => u.profile?.track).filter(Boolean))]; const programs = [...new Set(usersArray.map(u => u.profile?.program).filter(Boolean))]; const branches = [...new Set(usersArray.map(u => u.profile?.branch).filter(Boolean))]; const intakes = [...new Set(usersArray.map(u => u.profile?.intake).filter(Boolean))]; setFilterOptions({ tracks, programs, branches, intakes: intakes.sort((a, b) => parseInt(b) - parseInt(a)) }); } catch (err) { console.error('Error fetching users:', err); setError(err.response?.data?.message || err.message || 'Failed to fetch users'); } finally { setLoading(false); } }; getUsers(); }, []);

  const filteredUsers = useMemo(() => { return users.filter(user => { if (currentUser && user.id === currentUser.id) return false; const fullName = `${user.first_name} ${user.last_name}`.toLowerCase(); const matchesSearch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()); const matchesIntake = selectedIntake === '' || user.intake.toString() === selectedIntake; const matchesTrack = selectedTrack === '' || user.track === selectedTrack; const matchesProgram = selectedProgram === '' || user.program === selectedProgram; const matchesBranch = selectedBranch === '' || user.branch === selectedBranch; return matchesSearch && matchesIntake && matchesTrack && matchesProgram && matchesBranch; }); }, [searchTerm, selectedIntake, selectedTrack, selectedProgram, selectedBranch, users, currentUser]);

  const usersToDisplay = useMemo(() => { return filteredUsers.filter(user => !connectedUsers.includes(user.id)); }, [filteredUsers, connectedUsers]);

  const clearFilters = () => { setSearchTerm(''); setSelectedIntake(''); setSelectedTrack(''); setSelectedProgram(''); setSelectedBranch(''); };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger effect for children
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white/50 rounded-lg shadow-sm p-4 border border-white/30 animate-pulse">
                <div className="flex items-center space-x-4"><div className="w-16 h-16 bg-gray-300 rounded-full"></div><div className="flex-1 space-y-2"><div className="h-4 bg-gray-300 rounded w-3/4"></div><div className="h-3 bg-gray-300 rounded w-1/2"></div></div></div>
                <div className="h-3 bg-gray-300 rounded mt-4 w-full"></div><div className="h-3 bg-gray-300 rounded mt-2 w-5/6"></div><div className="mt-4 h-8 bg-gray-300 rounded-lg w-full"></div>
            </motion.div>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
      <ToastContainer />
      <Navbar />
      
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

      <main className="pt-24 pb-10 px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-4">
              <User className="text-[#901b20] mr-2" />
              <span className="text-[#901b20] font-semibold text-sm">COMMUNITY</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">ITIans</span></h1>
            <p className="text-gray-600 text-lg">Connect with students and alumni across all tracks and intakes.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div className="lg:col-span-2"><label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input id="search-input" type="text" placeholder="Search by name or username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition" /></div></div>
              <div><label htmlFor="intake-select" className="block text-sm font-medium text-gray-700 mb-2">Intake</label><select id="intake-select" value={selectedIntake} onChange={(e) => setSelectedIntake(e.target.value)} className="w-full border border-gray-200 bg-white/50 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition appearance-none"><option value="">All</option>{filterOptions.intakes.map(intake => <option key={intake} value={intake}>{intake}</option>)}</select></div>
              <div><label htmlFor="track-select" className="block text-sm font-medium text-gray-700 mb-2">Track</label><select id="track-select" value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)} className="w-full border border-gray-200 bg-white/50 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition appearance-none"><option value="">All</option>{filterOptions.tracks.map(track => <option key={track} value={track}>{track}</option>)}</select></div>
              <div><label htmlFor="program-select" className="block text-sm font-medium text-gray-700 mb-2">Program</label><select id="program-select" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="w-full border border-gray-200 bg-white/50 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition appearance-none"><option value="">All</option>{filterOptions.programs.map(program => <option key={program} value={program}>{program.toUpperCase()}</option>)}</select></div>
              <div><label htmlFor="branch-select" className="block text-sm font-medium text-gray-700 mb-2">Branch</label><select id="branch-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-full border border-gray-200 bg-white/50 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition appearance-none"><option value="">All</option>{filterOptions.branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}</select></div>
            </div>
            <div className="mt-4 flex justify-between items-center"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearFilters} className="text-sm text-[#901b20] hover:underline font-medium flex items-center gap-1"><XCircle size={14}/> Clear All Filters</motion.button><p className="text-sm text-gray-500">Found {usersToDisplay.length} member(s)</p></div>
          </motion.div>
          
          {loading ? renderLoadingSkeleton()
           : error ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"><User className="text-white text-3xl" /></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3><p className="text-gray-600 mb-8 text-lg">{error}</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.reload()} className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">Try Again</motion.button>
            </motion.div>
           ) : usersToDisplay.length > 0 ? (
            <motion.div
              layout // Animate layout changes smoothly
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {usersToDisplay.map(user => (
                  <motion.div
                    key={user.id}
                    layout // Individual item layout animation
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                  >
                    <UserCard user={user} onConnectionSuccess={handleConnectionSuccess} currentUser={currentUser} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
           ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <User className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Members Found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ExploreItians;