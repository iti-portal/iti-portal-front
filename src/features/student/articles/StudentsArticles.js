import { useEffect, useState } from 'react';
import { GetAllArticles } from './GetAllArticles';
import { GetTrendingArticles } from './GetPopularArticles';
import { ThumbsUp, Newspaper, Flame, ChevronsRight, ChevronsLeft, Loader2 } from 'lucide-react';
import {REACT_APP_API_ASSET_URL} from '../../../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';

// --- Reusable Article Card Component with the new design ---
const ArticleCard = ({ article, onLike, onUnlike, likingArticleId }) => {
    const navigate = useNavigate();
    const author = article.author?.email || 'Unknown Author';
    const date = article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'No Date';
    
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden group transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl flex flex-col h-full">
            <div className="h-48 overflow-hidden">
                <img
                    src={`${REACT_APP_API_ASSET_URL}/` + article.featured_image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                    <span>{author}</span>
                    <span>{date}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-[#901b20] transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {article.content.substring(0, 120)}...
                </p>
                <div className="flex justify-between items-center mt-auto">
                    <button
                        onClick={() => navigate(`/student/articles/${article.id}`)}
                        className="text-sm font-semibold text-[#901b20] hover:underline"
                    >
                        Read More
                    </button>
                    <button
                        onClick={() => article.is_liked_by_user ? onUnlike(article.id) : onLike(article.id)}
                        disabled={likingArticleId === article.id}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                        {likingArticleId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp size={16} className={`${article.is_liked_by_user ? 'text-red-500 fill-current' : ''}`} />}
                        <span className="text-sm font-medium">{article.like_count || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


function StudentArticles() {
    // --- ALL LOGIC REMAINS UNCHANGED ---
    const navigate = useNavigate();
    const [latest, setLatest] = useState(null);
    const [allArticles, setAllArticles] = useState([]);
    const [trend, setTrend] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeError, setLikeError] = useState(null);
    const [likingArticleId, setLikingArticleId] = useState(null);
    const articlesPerPage = 6; // Adjusted for better grid layout

    const handleLike = async (articleId) => {
        setLikingArticleId(articleId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}/like`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
            if (!res.ok) throw new Error('Failed to like');
            const update = a => a.id === articleId ? { ...a, like_count: a.like_count + 1, is_liked_by_user: true } : a;
            setAllArticles(p => p.map(update));
            if (latest?.id === articleId) setLatest(update);
            setTrend(p => p.map(update));
        } catch (e) { setLikeError(e.message); setTimeout(() => setLikeError(null), 3000); } 
        finally { setLikingArticleId(null); }
    };
    const handleUnlike = async (articleId) => {
        setLikingArticleId(articleId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}/unlike`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
            if (!res.ok) throw new Error('Failed to unlike');
            const update = a => a.id === articleId ? { ...a, like_count: Math.max(0, a.like_count - 1), is_liked_by_user: false } : a;
            setAllArticles(p => p.map(update));
            if (latest?.id === articleId) setLatest(update);
            setTrend(p => p.map(update));
        } catch (e) { setLikeError(e.message); setTimeout(() => setLikeError(null), 3000); }
        finally { setLikingArticleId(null); }
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try { setLoading(true); const r = await GetAllArticles();
                if (r?.success) { const a = r.data.map(art => ({ ...art, like_count: art.like_count || 0, is_liked_by_user: art.is_liked_by_user || false }));
                    setAllArticles(a);
                    if (a.length) setLatest(a.reduce((l, c) => new Date(c.published_at) > new Date(l?.published_at) ? c : l));
                } else setError(r?.message || 'No data');
            } catch (err) { setError(err.message); } finally { setLoading(false); }
        }; fetchArticles();
    }, []);
    useEffect(() => {
        const fetchTrending = async () => {
            try { const r = await GetTrendingArticles();
                if (r?.success) setTrend((r.data || r).map(art => ({ ...art, like_count: art.like_count || 0, is_liked_by_user: art.is_liked_by_user || false })));
            } catch (err) { console.error('Error fetching trending:', err); }
        }; fetchTrending();
    }, []);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = allArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    // --- JSX WITH NEW DESIGN ---
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

                {likeError && <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">{likeError}</div>}
                
                {/* Redesigned Hero */}
                <section className="text-center pt-24 pb-16 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                        Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Innovations</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stay updated with the latest articles and stories from the ITI community.</p>
                </section>

                <main className="w-full max-w-7xl mx-auto px-4 pb-16 space-y-16">
                    {/* Redesigned Featured Article */}
                    {loading ? (
                        <div className="bg-white/50 rounded-xl p-6 animate-pulse flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2 h-80 bg-gray-200 rounded-lg"></div>
                            <div className="md:w-1/2 space-y-4 pt-4"><div className="h-4 bg-gray-200 w-24 rounded"></div><div className="h-8 bg-gray-200 w-full rounded"></div><div className="h-20 bg-gray-200 w-full rounded"></div><div className="h-10 bg-gray-200 w-32 rounded"></div></div>
                        </div>
                    ) : latest && (
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/2 h-64 md:h-auto"><img src={`${REACT_APP_API_ASSET_URL}/` + latest.featured_image|| 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1170&q=80'} alt={latest.title} className="w-full h-full object-cover" /></div>
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <span className="text-sm font-semibold text-[#901b20] mb-2">Featured Article</span>
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">{latest.title}</h2>
                                <p className="text-gray-600 mb-6 line-clamp-3">{latest.content.substring(0, 200)}...</p>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => navigate(`/student/articles/${latest.id}`)} className="px-6 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">Read More</button>
                                    <button onClick={() => latest.is_liked_by_user ? handleUnlike(latest.id) : handleLike(latest.id)} disabled={likingArticleId === latest.id} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                                        {likingArticleId === latest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp size={18} className={`${latest.is_liked_by_user ? 'text-red-500 fill-current' : ''}`} />}
                                        <span className="font-semibold">{latest.like_count}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* All Articles Grid */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Newspaper /> All Articles</h2>
                        {loading ? <div className="text-center py-10"><Loader2 className="w-8 h-8 mx-auto animate-spin text-[#901b20]" /></div>
                        : currentArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} onLike={handleLike} onUnlike={handleUnlike} likingArticleId={likingArticleId} />
                                ))}
                            </div>
                        ) : <p className="text-center py-10 text-gray-500">No articles found.</p>}
                        
                        {/* Redesigned Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-2">
                                <button onClick={prevPage} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-gray-200/50 disabled:opacity-50 transition"><ChevronsLeft /></button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button key={number} onClick={() => paginate(number)} className={`w-9 h-9 text-sm rounded-full transition-colors ${currentPage === number ? 'bg-[#901b20] text-white font-bold' : 'text-gray-600 hover:bg-gray-200/50'}`}>{number}</button>
                                ))}
                                <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 rounded-full hover:bg-gray-200/50 disabled:opacity-50 transition"><ChevronsRight /></button>
                            </div>
                        )}
                    </div>

                    {/* Trending Articles Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Flame className="text-orange-500" /> Trending Articles</h2>
                        {loading ? <div className="text-center py-10"><Loader2 className="w-8 h-8 mx-auto animate-spin text-[#901b20]" /></div>
                        : trend.length > 0 ? (
                            <div className="relative">
                                <div className="flex overflow-x-auto pb-4 gap-6 -mx-4 px-4 hide-scrollbar">
                                    {trend.map(article => (
                                        <div key={article.id} className="flex-shrink-0 w-80">
                                           <ArticleCard article={article} onLike={handleLike} onUnlike={handleUnlike} likingArticleId={likingArticleId} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : <p className="text-center py-10 text-gray-500">No trending articles right now.</p>}
                    </div>
                </main>
            </div>
        </>
    );
}

export default StudentArticles;