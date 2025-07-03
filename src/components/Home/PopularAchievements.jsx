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
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-iti-primary/20"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-iti-primary to-iti-primary-dark rounded-full flex items-center justify-center">
            <FaTrophy className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{achievement.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FaUser className="mr-1" />
              <span>{achievement.user_profile?.first_name} {achievement.user_profile?.last_name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm text-gray-500">
            <FaCalendar className="mr-1" />
            <span>{formatDate(achievement.created_at)}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{achievement.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaHeart className="mr-1 text-red-500" />
            <span>{achievement.like_count || 0}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaComments className="mr-1 text-blue-500" />
            <span>{achievement.comment_count || 0}</span>
          </div>
        </div>
        
        {achievement.category && (
          <span className="px-2 py-1 bg-iti-primary/10 text-iti-primary text-xs rounded-full">
            {achievement.category}
          </span>
        )}
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
        console.log('Popular achievements API response:', response);
        
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Achievements</h2>
              <p className="text-gray-600">Celebrate outstanding accomplishments from our community</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Achievements</h2>
              <p className="text-gray-600">Celebrate outstanding accomplishments from our community</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-gray-500 text-xl" />
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
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Achievements</h2>
            <p className="text-gray-600">Celebrate outstanding accomplishments from our community</p>
          </div>
          <Link 
            to="/achievements" 
            className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium transition-colors"
          >
            View All
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-gray-500 text-xl" />
            </div>
            <p className="text-gray-600 mb-4">No popular achievements available at the moment.</p>
            <Link 
              to="/achievements" 
              className="text-iti-primary hover:text-iti-primary-dark font-medium"
            >
              Explore All Achievements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <PopularAchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                onClick={() => handleAchievementClick(achievement)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularAchievements;