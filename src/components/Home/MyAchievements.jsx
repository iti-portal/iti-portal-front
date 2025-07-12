// src/components/Home/MyAchievements.jsx

import React from 'react';
import { FaTrophy, FaCertificate, FaCode, FaUsers, FaArrowRight } from 'react-icons/fa';

const AchievementCard = ({ icon: Icon, title, description, progress, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center`}>
        <Icon className={`${color.text} text-xl`} />
      </div>
      <span className="text-sm text-gray-500">{progress}%</span>
    </div>
    
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-iti-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const MyAchievements = () => {
  const achievements = [
    {
      icon: FaTrophy,
      title: "Portfolio Complete",
      description: "Complete your professional portfolio",
      progress: 85,
      color: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
    },
    {
      icon: FaCertificate,
      title: "Certifications",
      description: "Earn industry certifications",
      progress: 60,
      color: { bg: 'bg-blue-100', text: 'text-blue-600' }
    },
    {
      icon: FaCode,
      title: "Projects Showcase",
      description: "Showcase your coding projects",
      progress: 75,
      color: { bg: 'bg-green-100', text: 'text-green-600' }
    },
    {
      icon: FaUsers,
      title: "Network Building",
      description: "Connect with professionals",
      progress: 40,
      color: { bg: 'bg-purple-100', text: 'text-purple-600' }
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Progress</h2>
            <p className="text-gray-600">Track your progress and celebrate milestones</p>
          </div>
          <button className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium">
            View All
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyAchievements;
