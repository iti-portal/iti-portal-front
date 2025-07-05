// src/components/Home/ArticlesInsights.jsx

import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUser, FaArrowRight, FaEye, FaHeart } from 'react-icons/fa';
import { getPopularArticles } from '../../services/articlesService';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ArticleCard = ({ article, index }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {article.featured_image ? (
          <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl text-gray-400">📰</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-iti-primary text-white px-3 py-1 rounded-full text-xs font-medium">
            {article.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{truncateContent(article.content)}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaUser className="mr-1" />
              <span>{article.author?.email || 'Unknown Author'}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="mr-1" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <FaHeart className="mr-1 text-red-500" />
              <span>{article.like_count || 0}</span>
            </div>
          </div>
          <button className="text-iti-primary hover:text-iti-primary-dark font-medium text-sm flex items-center">
            Read More
            <FaArrowRight className="ml-1 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ArticlesInsights = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPopularArticles(4);
        console.log('Popular articles API response:', response);
        
        if (response?.data) {
          setArticles(response.data.slice(0, 2)); // Show only 2 articles on home page
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Error fetching popular articles:', err);
        setError('Failed to load popular articles');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Articles & Insights</h2>
              <p className="text-gray-600">Stay updated with the latest in technology and career development</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Articles & Insights</h2>
              <p className="text-gray-600">Stay updated with the latest in technology and career development</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-xl">📰</span>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-iti-primary hover:text-iti-primary-dark font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Articles & Insights</h2>
            <p className="text-gray-600">Stay updated with the latest in technology and career development</p>
          </div>
          <button className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium transition-colors">
            View All Articles
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-xl">📰</span>
            </div>
            <p className="text-gray-600 mb-4">No popular articles available at the moment.</p>
            <button className="text-iti-primary hover:text-iti-primary-dark font-medium">
              Explore All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesInsights;
