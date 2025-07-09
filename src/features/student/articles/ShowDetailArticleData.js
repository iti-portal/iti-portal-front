import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ShowDetailArticleData() {
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
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            navigate('/not-found', { replace: true });
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch article details');
        }

        const data = await response.json();
        setArticle(data.data); 
      } catch (error) {
        console.error('Error fetching article:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, token, navigate]);

  const handleLike = async (articleId) => {
    if (!token) {
      setLikeError('Please login to like articles');
      setTimeout(() => setLikeError(null), 3000);
      return;
    }

    try {
      setLikingArticleId(articleId);
      const likeResponse = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!likeResponse.ok) {
        throw new Error('Failed to like article');
      }

      const likeData = await likeResponse.json();

      setArticle(prev => ({
        ...prev,
        like_count: likeData.data.like_count,
        is_liked_by_user: true
      }));
    } catch (error) {
      setLikeError(error.message);
      setTimeout(() => setLikeError(null), 3000);
    } finally {
      setLikingArticleId(null);
    }
  };

  const handleUnlike = async (articleId) => {
    try {
      setLikingArticleId(articleId);
      const unlikeResponse = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!unlikeResponse.ok) {
        throw new Error('Failed to unlike article');
      }

      const unlikeData = await unlikeResponse.json();

      setArticle(prev => ({
        ...prev,
        like_count: unlikeData.data.like_count,
        is_liked_by_user: false
      }));
    } catch (error) {
      setLikeError(error.message);
      setTimeout(() => setLikeError(null), 3000);
    } finally {
      setLikingArticleId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-red-500 mb-4" />
        </motion.div>
        <p className="text-gray-600 text-lg">Loading article details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 my-6">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
          </motion.div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading article</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="p-4">Article not found</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
   

      {likeError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
        >
          {likeError}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col border border-gray-200 rounded-lg shadow-md overflow-hidden mb-12"
      >
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-64"
        >
          <img
            src={article.featured_image || 'https://st4.depositphotos.com/1185628/24546/v/450/depositphotos_245467064-stock-illustration-newspaper-icon-vector-template.jpg'}
            alt={article.title}
            className="w-full h-full object-cotain"
            onError={(e) => {
              e.target.src = 'https://st4.depositphotos.com/1185628/24546/v/450/depositphotos_245467064-stock-illustration-newspaper-icon-vector-template.jpg';
            }}
          />
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Article Details
            </span>
            <span className="text-gray-500 text-sm">
              {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }) : 'No date available'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {article.title}
          </h2>

     
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-8">
            {article.content
              .split('\n')
              .filter(paragraph => paragraph.trim() !== '')
              .map((paragraph, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                
                >
                  {paragraph}
                </motion.li>
            ))}
          </ul>

          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`https://www.bing.com/search?pglt=171&q=wikipedia&cvid=f5a1efdab6b74f98a66f974a4348d177&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIGCAEQABhAMgYIAhAuGEAyBggDEAAYQDIGCAQQLhhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQgyODA0ajBqMagCALACAA&FORM=ANNTA1&PC=U531`)}
              className="w-1/3 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              More info
            </motion.button>

            <motion.button
              onClick={() =>
                article.is_liked_by_user
                  ? handleUnlike(article.id)
                  : handleLike(article.id)
              }
              disabled={likingArticleId === article.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1 p-2 rounded hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              aria-label={article.is_liked_by_user ? "Unlike article" : "Like article"}
            >
              <span>{article.like_count}</span>
              {likingArticleId === article.id ? (
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-1"
                >
                  ...
                </motion.span>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <ThumbsUp
                    className={`w-6 h-6 ${article.is_liked_by_user ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors duration-200 ease-in-out`}
                  />
                </motion.div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ShowDetailArticleData;
