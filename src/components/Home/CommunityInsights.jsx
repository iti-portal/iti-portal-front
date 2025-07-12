// src/components/Home/CommunityInsights.jsx

import React from 'react';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaBriefcase, 
  FaArrowUp
} from 'react-icons/fa';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const StatCard = ({ icon: Icon, value, label, trend, color, size = "normal", index }) => {
  const { ref, animationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: index * 100
  });

  return (
    <div ref={ref} className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 ${size === "large" ? "md:col-span-2" : ""} ${animationClasses}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`${color.text} text-xl`} />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm">
            <FaArrowUp className="mr-1" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
      
      <div className={`${size === "large" ? "text-4xl" : "text-3xl"} font-bold text-gray-800 mb-2`}>{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

const CommunityInsights = () => {
  const { ref: sectionRef, animationClasses: sectionAnimationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 0
  });

  const stats = [
    {
      icon: FaUsers,
      value: "25K+",
      label: "Active Members",
      trend: 12,
      color: { bg: 'bg-blue-100', text: 'text-blue-600' },
      size: "large"
    },
    {
      icon: FaGraduationCap,
      value: "2.3K+",
      label: "ITI Graduates",
      trend: 8,
      color: { bg: 'bg-green-100', text: 'text-green-600' }
    },
    {
      icon: FaBriefcase,
      value: "9K+",
      label: "Job Placements",
      trend: 20,
      color: { bg: 'bg-orange-100', text: 'text-orange-600' }
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={sectionRef} className={`text-center mb-12 ${sectionAnimationClasses}`}>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Community Insights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time metrics showcasing the growth and success of our vibrant ITI community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityInsights;
