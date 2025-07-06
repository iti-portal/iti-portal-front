// src/components/Home/PopularAchievements.jsx

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaArrowRight, FaHeart, FaComments, FaCalendar, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getPopularAchievements } from '../../services/achievements';

const PopularAchievementCard = ({ achievement, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/20 hover:border-[#901b20]/30 overflow-hidden transform hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Gradient header */}
      <div className="h-2 bg-gradient-to-r from-[#203947] via-[#901b20] to-[#203947]"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FaTrophy className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300">{achievement.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaUser className="mr-1 text-[#901b20]" />
                <span className="font-medium">{achievement.user_profile?.first_name} {achievement.user_profile?.last_name}</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{achievement.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors">
              <FaHeart className="mr-1 text-red-500" />
              <span className="font-medium">{achievement.like_count || 0}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors">
              <FaComments className="mr-1 text-blue-500" />
              <span className="font-medium">{achievement.comment_count || 0}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            {achievement.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 text-[#901b20] text-xs rounded-full font-medium border border-[#901b20]/20">
                {achievement.category}
              </span>
            )}
            <div className="flex items-center text-xs text-gray-400">
              <FaCalendar className="mr-1" />
              <span>{formatDate(achievement.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPopularAchievements();
        
        if (response?.data?.achievements) {
          // Take only the first 4 achievements for the home page
          setAchievements(response.data.achievements.slice(0, 4));
        } else {
          setAchievements([]);
        }
      } catch (err) {
        console.error('Error fetching popular achievements:', err);
        setError('Failed to load popular achievements');
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAchievements();
  }, []);

  const handleAchievementClick = (achievement) => {
    // Navigate to achievements page with the selected achievement
    // For now, we'll just log it. This could be enhanced to open a modal or navigate to a details page
    console.log('Achievement clicked:', achievement);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden rounded-lg">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#203947]/5 via-transparent to-[#901b20]/5 rounded-lg"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-6 animate-pulse">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-96 h-12 bg-gray-300 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="w-2/3 h-6 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
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
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden rounded-lg">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#203947]/5 via-transparent to-[#901b20]/5 rounded-lg"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-6">
              <FaTrophy className="text-[#901b20] mr-2" />
              <span className="text-[#901b20] font-semibold text-sm">ACHIEVEMENTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Achievements</span>
            </h2>
          </div>
          
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full hover:from-[#203947] hover:to-[#901b20] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden rounded-lg">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#203947]/5 via-transparent to-[#901b20]/5 rounded-lg"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-6">
            <FaTrophy className="text-[#901b20] mr-2" />
            <span className="text-[#901b20] font-semibold text-sm">ACHIEVEMENTS</span>
          </div>
        </div>
        
        {achievements.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Popular Achievements Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Be the first to share your amazing accomplishments with the community!</p>
            <Link 
              to="/achievements" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full hover:from-[#203947] hover:to-[#901b20] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore All Achievements
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement) => (
                <PopularAchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  onClick={() => handleAchievementClick(achievement)}
                />
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-16">
              <Link 
                to="/achievements" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-full hover:from-[#203947] hover:to-[#901b20] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View All Achievements
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularAchievements;