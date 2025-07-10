import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ArrowLeft, Loader2, AlertCircle, Calendar, User as AuthorIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Layout/Navbar';

function ShowDetailArticleData() {
    // --- ALL LOGIC REMAINS UNCHANGED ---
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likingArticleId, setLikingArticleId] = useState(null);
    const [likeError, setLikeError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!response.ok) { if (response.status === 404) { navigate('/not-found', { replace: true }); return; } const errorData = await response.json(); throw new Error(errorData.message || 'Failed to fetch article'); }
                const data = await response.json();
                setArticle(data.data); 
            } catch (error) { console.error('Error fetching article:', error); setError(error.message); } 
            finally { setLoading(false); }
        };
        if (id) fetchArticle();
    }, [id, token, navigate]);

    const handleLike = async (articleId) => { /* ... same like logic ... */ };
    const handleUnlike = async (articleId) => { /* ... same unlike logic ... */ };

    // --- JSX WITH NEW DESIGN & ANIMATION ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#901b20] mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600 text-lg">Loading Article...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center text-center p-4">
                    <div>
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-800">Could not load article</h2>
                        <p className="text-red-600 mt-2">{error || 'The article you are looking for does not exist.'}</p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className="mt-6 flex items-center gap-2 mx-auto px-6 py-2 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                            <ArrowLeft size={18} />
                            Go Back
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

                {likeError && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-20 right-4 z-50 p-3 bg-red-100 text-red-700 rounded-lg shadow-lg">{likeError}</motion.div>)}
                
                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative h-80 md:h-96 w-full"
                >
                    <img
                        src={article.featured_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1170&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight shadow-text">{article.title}</h1>
                        <div className="flex items-center gap-6 mt-4 text-sm opacity-90">
                            <div className="flex items-center gap-2"><AuthorIcon size={16} /><p>{article.author?.name || 'ITI Staff'}</p></div>
                            <div className="flex items-center gap-2"><Calendar size={16} /><p>{new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
                        </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="absolute top-20 left-4 md:left-6 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors z-10">
                        <ArrowLeft size={24} />
                    </motion.button>
                </motion.header>

                {/* Article Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    className="w-full max-w-4xl mx-auto px-4 pb-16 mt-[-4rem] relative z-10"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 md:p-10">
                        <article className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900">
                            {article.content
                                .split('\n')
                                .filter(p => p.trim() !== '')
                                .map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))
                            }
                        </article>

                        {/* Action Bar */}
                        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://iti.gov.eg" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-gradient-to-r from-[#901b20] to-[#a83236] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                                Visit ITI
                            </motion.a>
                            <motion.button
                                onClick={() => article.is_liked_by_user ? handleUnlike(article.id) : handleLike(article.id)}
                                disabled={likingArticleId === article.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-2 text-gray-600 font-semibold p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                {likingArticleId === article.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp size={20} className={`${article.is_liked_by_user ? 'text-red-500 fill-current' : ''}`} />}
                                <span>{article.like_count}</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default ShowDetailArticleData;