import { useEffect, useState } from 'react';
import { GetAllArticles } from './GetAllArticles';
import { GetTrendingArticles } from './GetPopularArticles';
import { ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar';

function StudentArticles() {
    const navigate = useNavigate();
  const [latest, setLatest] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [trend, setTrend] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeError, setLikeError] = useState(null);
  const [likingArticleId, setLikingArticleId] = useState(null);

  const articlesPerPage = 9;

  const handleLike = async (articleId) => {
    try {
      setLikingArticleId(articleId);
      const token = localStorage.getItem("token");

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
      const updatedArticles = allArticles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            like_count: article.like_count + 1,
            is_liked_by_user: true
          };
        }
        return article;
      });

      setAllArticles(updatedArticles);


      if (latest && latest.id === articleId) {
        setLatest({
          ...latest,
          like_count: latest.like_count + 1,
          is_liked_by_user: true
        });
      }


      setTrend(prevTrend => 
        prevTrend.map(article => {
          if (article.id === articleId) {
            return {
              ...article,
              like_count: article.like_count + 1,
              is_liked_by_user: true
            };
          }
          return article;
        })
      );

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
      const token = localStorage.getItem("token");

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

      const updatedArticles = allArticles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            like_count: Math.max(0, article.like_count - 1),
            is_liked_by_user: false
          };
        }
        return article;
      });

      setAllArticles(updatedArticles);

      if (latest && latest.id === articleId) {
        setLatest({
          ...latest,
          like_count: Math.max(0, latest.like_count - 1),
          is_liked_by_user: false
        });
      }

      setTrend(prevTrend => 
        prevTrend.map(article => {
          if (article.id === articleId) {
            return {
              ...article,
              like_count: Math.max(0, article.like_count - 1),
              is_liked_by_user: false
            };
          }
          return article;
        })
      );

    } catch (error) {
      setLikeError(error.message);
      setTimeout(() => setLikeError(null), 3000);
    } finally {
      setLikingArticleId(null);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const result = await GetAllArticles();
        if (result && result.success) {
          const articles = result.data;
          const articlesWithLikes = articles.map(article => ({
            ...article,
            like_count: article.like_count || 0,
            is_liked_by_user: article.is_liked_by_user || false
          }));
          setAllArticles(articlesWithLikes);
          
          if (articlesWithLikes.length) {
            const latestArticle = articlesWithLikes.reduce((latest, current) => 
              new Date(current.published_at) > new Date(latest?.published_at) ? current : latest
            );
            setLatest(latestArticle);
          }
        } else {
          setError(result?.message || 'No data received');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const result = await GetTrendingArticles();
        if (result && result.success) {
          const trendingWithLikes = (result.data || result).map(article => ({
            ...article,
            like_count: article.like_count || 0,
            is_liked_by_user: article.is_liked_by_user || false
          }));
          setTrend(trendingWithLikes);
        }
      } catch (err) {
        console.error('Error fetching trending articles:', err);
      }
    };

    fetchTrending();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = allArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center py-20'>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center py-20'>
          <div className="text-red-600 mb-4">Error loading articles</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <><Navbar /><div className='container mx-auto px-4 sm:px-6 lg:px-8 py-20'>
      {likeError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {likeError}
        </div>
      )}

      <h2 className='text-2xl md:text-2xl font-bold text-center mb-8 text-gray-800'>
        Discover Our Latest Articles
      </h2>

      {latest ? (
        <div className='flex flex-col md:flex-row gap-6 border border-gray-200 rounded-lg shadow-md overflow-hidden mb-12'>
          <div className='md:w-1/2 h-64 md:h-auto'>
            <img
              src={latest.featured_image || 'https://st4.depositphotos.com/1185628/24546/v/450/depositphotos_245467064-stock-illustration-newspaper-icon-vector-template.jpg'}
              alt={latest.title}
              className='w-full h-64 object-cover' />
          </div>
          <div className='md:w-1/2 p-6 flex flex-col justify-between'>
            <div>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4'>
                <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium'>
                  Latest Article
                </span>
                <span className='text-gray-500 text-sm'>
                  {latest.published_at ? new Date(latest.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : 'No date available'}
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-3'>
                {latest.title}
              </h2>
              <p className='text-gray-600 mb-6'>
                {latest.content.substring(0, 200) + '...' || 'No content available for this article.'}
              </p>
            </div>
            <div className="flex justify-between items-center">
              
           

              <div className="flex justify-between items-center w-full">
                      <button
                key={`closed-details-button-${latest.id}`}
                onClick={() => navigate(`/student/articles/${latest.id}`)} 
                className='w-1/3 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center'
              >Read More</button>
                <button 
                  onClick={() => latest.is_liked_by_user ? handleUnlike(latest.id) : handleLike(latest.id)} 
                  disabled={likingArticleId === latest.id}
                  className="flex items-center space-x-1 p-2 rounded hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                >
                  
                  <span>{latest.like_count}</span>
                  {likingArticleId === latest.id ? (
                    <span className="ml-1">...</span>
                  ) : (
                    <ThumbsUp className={`w-6 h-6 ${latest.is_liked_by_user ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors duration-200 ease-in-out`} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center py-6 mb-12 animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/2 mx-auto'></div>
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='md:w-1/2 h-64 bg-gray-200 rounded'></div>
            <div className='md:w-1/2 space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-24'></div>
              <div className='h-6 bg-gray-200 rounded w-full'></div>
              <div className='h-4 bg-gray-200 rounded w-full'></div>
              <div className='h-4 bg-gray-200 rounded w-full'></div>
              <div className='h-10 bg-gray-200 rounded w-32 mt-6'></div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.length > 0 ? currentArticles.map((article) => (
          <div key={article.id} className="border rounded shadow hover:shadow-lg transition-shadow flex flex-col h-full">
            <img
              src={article.featured_image || "https://st4.depositphotos.com/1185628/24546/v/450/depositphotos_245467064-stock-illustration-newspaper-icon-vector-template.jpg"}
              alt={article.title || "Article image"}
              className="w-full h-40 object-cover rounded-t" />

            <div className="p-5 flex flex-col flex-grow">
              <div className='flex justify-between items-center mb-3'>
                <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'>
                  {article.author?.email || 'Unknown author'}
                </span>
                <span className='text-gray-500 text-xs'>
                  {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }) : 'No date'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {article.content.substring(0, 150) + '...' || 'No content available'}
              </p>
              <div className='flex justify-between items-center mt-auto space-x-2'>
                
                   <button
                key={`closed-details-button-${article.id}`}
                onClick={() => navigate(`/student/articles/${article.id}`)} 
                className='w-1/3 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center'
              >
                Read More
              </button>
                <div className="flex space-x-1">
                  <button
                    onClick={() => article.is_liked_by_user ? handleUnlike(article.id) : handleLike(article.id)}
                    disabled={likingArticleId === article.id}
                    className="flex items-center space-x-1 p-2 rounded hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  >
                    <span>{article.like_count || 0}</span>
                    {likingArticleId === article.id ? (
                      <span className="ml-1">...</span>
                    ) : (
                      <ThumbsUp className={`w-6 h-6 ${article.is_liked_by_user ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors duration-200 ease-in-out`} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center col-span-full py-8">
            <p className="text-gray-500 text-lg">No articles found.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new articles.</p>
          </div>
        )}
      </div>

      {allArticles.length > articlesPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button onClick={prevPage} disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'text-gray-500 font-medium cursor-not-allowed' : 'text-dark'}`}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-2 py-0 rounded-full ${currentPage === number ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              >
                {number}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages}
              className={`${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-black'}`}>
                
              &gt;
            </button>

          </nav>
        </div>
      )}

      <hr className='mt-10 w-full' />

      <div className='container px-4 sm:px-6 lg:px-5 py-5'>
        <h2 className='text-xl md:text-2xl font-bold mb-6 text-gray-800'>
          Trending Articles
        </h2>
        <div className="mt-6 relative">
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar">
            <div className="flex space-x-6">
              {trend.length > 0 ? trend.map((article) => (
                <div key={article.id} className="flex-shrink-0 w-96 border rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full">
                  <img
                    src={article.featured_image || "https://st4.depositphotos.com/1185628/24546/v/450/depositphotos_245467064-stock-illustration-newspaper-icon-vector-template.jpg"}
                    alt={article.title || "Article image"}
                    className="w-full h-40 object-cover rounded-t"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x500?text=Tech+News';
                    } } />
                  <div className="p-4 flex flex-col flex-grow">
                    <div className='flex justify-between items-center mb-3'>
                      <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'>
                        {article.author?.email || 'Unknown author'}
                      </span>
                      <span className='text-gray-500 text-xs'>
                        {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        }) : 'No date'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.content.substring(0, 150) + '...' || 'No content available'}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                            <button
                              key={`closed-details-button-${article.id}`}
                              onClick={() => navigate(`/student/articles/${article.id}`)} 
                              className='w-1/3 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center'
                            >Read More</button>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => article.is_liked_by_user ? handleUnlike(article.id) : handleLike(article.id)}
                          disabled={likingArticleId === article.id}
                          className="flex items-center space-x-1 p-2 rounded hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                        >
                          <span>{article.like_count || 0}</span>
                          {likingArticleId === article.id ? (
                            <span className="ml-1">...</span>
                          ) : (
                            <ThumbsUp className={`w-6 h-6 ${article.is_liked_by_user ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors duration-200 ease-in-out`} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex-shrink-0 w-full text-center py-8">
                  <p className="text-gray-500 text-lg">No trending articles found.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for trending tech news.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}

export default StudentArticles;