import React, { useState, useRef, useCallback, useMemo,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementCard from '../components/common/AchievementCard';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { deleteAchievement } from '../../../services/achievementsService';
import Navbar from '../../../components/Layout/Navbar';
import Modal from '../../../components/UI/Modal';
import { Plus, Search, Star, RefreshCw, Layers } from 'lucide-react';

const MyAchievements = () => {
    const navigate = useNavigate();
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
    const { achievements, loading, loadingMore, error, hasMore, loadMore, refresh } = useMyAchievements();
    const observer = useRef();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAchievements, setFilteredAchievements] = useState([]);
    const [activeTypeFilter, setActiveTypeFilter] = useState(null);
    
    useEffect(() => {
        let filtered = achievements;
        if (activeTypeFilter) { filtered = filtered.filter(a => a.type === activeTypeFilter); }
        if (searchQuery.trim()) { filtered = filtered.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.description?.toLowerCase().includes(searchQuery.toLowerCase()) || a.type?.toLowerCase().includes(searchQuery.toLowerCase())); }
        setFilteredAchievements(filtered);
    }, [achievements, searchQuery, activeTypeFilter]);

    const lastAchievementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => { if (entries[0].isIntersecting && hasMore) { loadMore(); } });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMore]);

    const handleRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };
    
    const handleDeleteAchievement = async (achievement) => {
        const performDelete = async () => {
            try {
                await deleteAchievement(achievement.id);
                refresh(); // Re-fetch the list after deletion
            } catch (err) {
                console.error("Failed to delete", err);
            }
        };
        setConfirmModalContent({ title: 'Confirm Deletion', message: `Are you sure you want to delete "${achievement.title}"?`, onConfirm: () => { performDelete(); setConfirmModalOpen(false); } });
        setConfirmModalOpen(true);
    };

    const stats = useMemo(() => {
        const total = filteredAchievements.length;
        return { total };
    }, [filteredAchievements]);

    const achievementTypes = [{ type: 'project', icon: '🚀' }, { type: 'job', icon: '💼' }, { type: 'certification', icon: '🎓' }, { type: 'award', icon: '🏆' }];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
                <Modal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} title={confirmModalContent.title}>
                    <p>{confirmModalContent.message}</p>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button onClick={() => setConfirmModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button onClick={confirmModalContent.onConfirm} className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700">Confirm</button>
                    </div>
                </Modal>
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
                
                <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center pt-24 pb-28 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Achievements</span></h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Manage and showcase your personal accomplishments.</p>
                </motion.section>

                <motion.main initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-6xl mx-auto px-4 pb-16 mt-[-80px] relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Search your achievements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-3 pl-12 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent bg-white/50" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleRefresh} disabled={refreshing} className="p-2.5 rounded-lg hover:bg-gray-200/70 text-gray-500 hover:text-gray-700 disabled:opacity-50"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/achievements/create')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"><Plus size={18} /><span>Add New</span></motion.button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-4 mb-6">
                             <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                <button onClick={() => setActiveTypeFilter(null)} className={`p-2 rounded-md transition-colors ${!activeTypeFilter ? 'bg-white shadow-sm text-[#901b20]' : 'text-gray-500 hover:bg-white/60'}`}><Layers size={16} /></button>
                                {achievementTypes.map(({type, icon}) => (
                                   <button key={type} onClick={() => setActiveTypeFilter(activeTypeFilter === type ? null : type)} className={`p-2 rounded-md transition-colors ${activeTypeFilter === type ? 'bg-white shadow-sm text-[#901b20]' : 'text-gray-500 hover:bg-white/60'}`}>{icon}</button>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-gray-500">Total: <span className="font-bold text-gray-700">{stats?.total ?? 0}</span></div>
                        </div>

                        <AnimatePresence>
                            {/* FIX: Removed `items-start` from the grid class */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading && !achievements.length ? ([...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200/50 rounded-xl animate-pulse"></div>))
                                : filteredAchievements.length > 0 ? (
                                    filteredAchievements.map((achievement, index) => (
                                        <motion.div key={achievement.id} ref={index === filteredAchievements.length - 1 ? lastAchievementRef : null} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                                            <AchievementCard achievement={achievement} showUser={false} showActions={false} onEdit={() => navigate(`/achievements/edit/${achievement.id}`)} onDelete={handleDeleteAchievement} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 text-gray-500">
                                        <Star className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700">No Achievements Found</h3>
                                        <p className="text-sm">Try adjusting your filters or add your first achievement!</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        
                        {loadingMore && <div className="text-center py-8"><span className="material-icons text-2xl text-[#901b20] animate-spin">sync</span></div>}
                    </div>
                </motion.main>
            </div>
        </>
    );
};

export default MyAchievements;