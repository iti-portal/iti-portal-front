// src/components/Home/ArticlesInsights.jsx

import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUser, FaArrowRight, FaEye, FaHeart, FaNewspaper } from 'react-icons/fa';
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
    <div className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-[#901b20]/30 transform hover:-translate-y-2">
      {/* Gradient header */}
      <div className="h-2 bg-gradient-to-r from-[#203947] via-[#901b20] to-[#203947]"></div>
      
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {article.featured_image ? (
          <img 
            src={article.featured_image} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#203947]/20 via-[#901b20]/20 to-[#203947]/20 flex items-center justify-center">
            <FaNewspaper className="text-5xl text-[#901b20]" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-[#901b20] to-[#203947] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
            {article.status}
          </span>
        </div>
        
        {/* Like count overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <FaHeart className="text-red-500 mr-1 text-sm" />
            <span className="text-sm font-semibold text-gray-800">{article.like_count || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncateContent(article.content)}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center hover:text-[#901b20] transition-colors">
              <FaUser className="mr-1 text-[#901b20]" />
              <span className="font-medium">{article.author?.email?.split('@')[0] || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="mr-1 text-[#203947]" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <button className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-lg hover:from-[#203947] hover:to-[#901b20] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Read More
            <FaArrowRight className="ml-2 text-sm group-hover/btn:translate-x-1 transition-transform duration-300" />
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
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#203947]/5 via-transparent to-[#901b20]/5"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#203947]/10 to-[#901b20]/10 rounded-full mb-6 animate-pulse">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
              <div className="w-28 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-96 h-12 bg-gray-300 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="w-2/3 h-6 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
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
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#203947]/5 via-transparent to-[#901b20]/5"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#203947]/10 to-[#901b20]/10 rounded-full mb-6">
              <FaNewspaper className="text-[#901b20] mr-2" />
              <span className="text-[#901b20] font-semibold text-sm">Popular Articles</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#203947] to-[#901b20]">Articles</span>
            </h2>
          </div>
          
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaNewspaper className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#203947] to-[#901b20] text-white font-semibold rounded-full hover:from-[#901b20] hover:to-[#203947] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#203947]/5 via-transparent to-[#901b20]/5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#203947]/10 to-[#901b20]/10 rounded-full mb-6">
            <FaNewspaper className="text-[#901b20] mr-2" />
            <span className="text-[#901b20] font-semibold text-sm">LATEST INSIGHTS</span>
          </div>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#203947] to-[#901b20] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaNewspaper className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Articles Available Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Be the first to share your insights and knowledge with the community!</p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#203947] to-[#901b20] text-white font-semibold rounded-full hover:from-[#901b20] hover:to-[#203947] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Explore All Articles
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-16">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#203947] to-[#901b20] text-white font-semibold rounded-full hover:from-[#901b20] hover:to-[#203947] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                View All Articles
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ArticlesInsights;