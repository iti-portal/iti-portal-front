import React, { useState, useRef, useCallback, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AchievementCard from '../components/common/AchievementCard';
import AchievementDetailsModal from '../components/modals/AchievementDetailsModal';
import { useAchievementsAPI, ACHIEVEMENT_SOURCES } from '../hooks/useAchievementsAPI';
import { likeAchievement, unlikeAchievement } from '../../../services/achievementsService';
import { Plus, Search, Star, RefreshCw, Layers } from 'lucide-react';

const AchievementsFeed = () => {
    const navigate = useNavigate();
    const { achievements, loading, loadingMore, error, currentSource, hasMore, initialize, switchToAll, switchToConnections, switchToPopular, loadMore, refresh, updateAchievement } = useAchievementsAPI();
    const observer = useRef();
    const [refreshing, setRefreshing] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAchievements, setFilteredAchievements] = useState([]);
    const [activeTypeFilter, setActiveTypeFilter] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    useEffect(() => { if (!initialized) { setInitialized(true); initialize(); } }, [initialize, initialized]);
    useEffect(() => {
        let filtered = achievements;
        if (activeTypeFilter) { filtered = filtered.filter(a => a.type === activeTypeFilter); }
        if (searchQuery.trim()) { filtered = filtered.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.description?.toLowerCase().includes(searchQuery.toLowerCase()) || a.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.type?.toLowerCase().includes(searchQuery.toLowerCase())); }
        setFilteredAchievements(filtered);
    }, [achievements, searchQuery, activeTypeFilter]);

    const lastAchievementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => { if (entries[0].isIntersecting && hasMore) loadMore(); });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMore]);

    const handleRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };
    const handleLike = async (id, isLiked) => { try { if (isLiked) await likeAchievement(id); else await unlikeAchievement(id); } catch (e) { console.error('Feed like failed', e); } };
    const handleComment = (achievement) => { setSelectedAchievement(achievement); setModalOpen(true); };
    const handleAchievementUpdate = useCallback(updated => { updateAchievement(updated); setFilteredAchievements(p => p.map(a => a.id === updated.id ? updated : a)); }, [updateAchievement]);
    const handleTabSwitch = async (action) => { if (switching) return; setSwitching(true); await action(); setTimeout(() => setSwitching(false), 300); };
    const handleViewAchievement = (achievement) => { setSelectedAchievement(achievement); setModalOpen(true); };

    const tabs = [{ id: ACHIEVEMENT_SOURCES.ALL, label: 'For You', action: switchToAll }, { id: ACHIEVEMENT_SOURCES.CONNECTIONS, label: 'Following', action: switchToConnections }, { id: ACHIEVEMENT_SOURCES.POPULAR, label: 'Popular', action: switchToPopular }];
    const achievementTypes = [{ type: 'project', icon: '🚀' }, { type: 'job', icon: '💼' }, { type: 'certification', icon: '🎓' }, { type: 'award', icon: '🏆' }];

    return (
        <>
            <AchievementDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} achievement={selectedAchievement} onAchievementUpdate={handleAchievementUpdate} />
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search achievements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-3 pl-12 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#901b20]/50 focus:border-transparent bg-white/50" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/achievements/create')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"><Plus size={18} /><span>Add New</span></motion.button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 flex-wrap bg-gray-100 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => handleTabSwitch(tab.action)} disabled={switching} className={`flex-1 px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${currentSource === tab.id ? 'bg-white text-[#901b20] shadow-sm' : 'text-gray-500 hover:bg-white/60'}`}>{tab.label}</button>
                        ))}
                    </div>
                    <div className="flex items-center justify-end gap-1 bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTypeFilter(null)} className={`p-2 rounded-md transition-colors ${!activeTypeFilter ? 'bg-white shadow-sm text-[#901b20]' : 'text-gray-500 hover:bg-white/60'}`}><Layers size={16} /></button>
                        {achievementTypes.map(({type, icon}) => (
                           <button key={type} onClick={() => setActiveTypeFilter(activeTypeFilter === type ? null : type)} className={`p-2 rounded-md transition-colors ${activeTypeFilter === type ? 'bg-white shadow-sm text-[#901b20]' : 'text-gray-500 hover:bg-white/60'}`}>{icon}</button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={currentSource} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        {/* FIX: Removed `items-start` from the grid class */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading && !achievements.length ? ([...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200/50 rounded-xl animate-pulse"></div>))
                            : filteredAchievements.length > 0 ? (
                                filteredAchievements.map((achievement, index) => (
                                    <motion.div key={achievement.id} ref={index === filteredAchievements.length - 1 ? lastAchievementRef : null} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                                        <AchievementCard achievement={achievement} onView={handleViewAchievement} onLike={handleLike} onComment={handleComment} onAchievementUpdate={handleAchievementUpdate} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    <Star className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">No Achievements Found</h3>
                                    <p className="text-sm">Try adjusting your filters or check back later.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {loadingMore && <div className="text-center py-8"><span className="material-icons text-2xl text-[#901b20] animate-spin">sync</span></div>}
                {!hasMore && achievements.length > 0 && <div className="text-center pt-8 text-sm text-gray-400">You've reached the end.</div>}
            </div>
        </>
    );
};

export default AchievementsFeed;