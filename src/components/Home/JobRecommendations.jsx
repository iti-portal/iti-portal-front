// src/components/Home/JobRecommendations.jsx

import React from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowRight } from 'react-icons/fa';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const JobCard = ({ title, company, location, type, salary, postedTime, logo, index }) => {
  const { ref, animationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: index * 100
  });

  return (
    <div ref={ref} className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 ${animationClasses}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={company} className="w-8 h-8 object-cover rounded" />
            ) : (
              <FaBuilding className="text-gray-500 text-xl" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
            <p className="text-gray-600">{company}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{postedTime}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaClock className="mr-2" />
          <span>{type}</span>
        </div>
        {salary && (
          <div className="text-sm font-medium text-iti-primary">
            {salary}
          </div>
        )}
      </div>
      
      <button className="w-full bg-iti-primary text-white py-2 px-4 rounded-lg hover:bg-iti-primary-dark transition-colors font-medium">
        Apply Now
      </button>
    </div>
  );
};

const JobRecommendations = () => {
  const { ref: sectionRef, animationClasses: sectionAnimationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 0
  });

  const jobRecommendations = [
    {
      title: "UI Designer",
      company: "Google",
      location: "Cairo, Egypt",
      type: "Full-time",
      salary: "25-35k EGP",
      postedTime: "2 days ago",
    },
    {
      title: "Full Stack Developer",
      company: "Microsoft",
      location: "Cairo, Egypt", 
      type: "Full-time",
      salary: "30-40k EGP",
      postedTime: "3 days ago",
    },
    {
      title: "Data Analyst",
      company: "Amazon",
      location: "Alexandria, Egypt",
      type: "Remote",
      salary: "20-30k EGP",
      postedTime: "1 week ago",
    },
    {
      title: "Frontend Developer",
      company: "Facebook",
      location: "Cairo, Egypt",
      type: "Part-time", 
      salary: "15-25k EGP",
      postedTime: "5 days ago",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={sectionRef} className={`flex items-center justify-between mb-8 ${sectionAnimationClasses}`}>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Job Recommendations</h2>
            <p className="text-gray-600">Personalized job opportunities based on your profile</p>
          </div>
          <button className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium transition-colors">
            View All
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobRecommendations.map((job, index) => (
            <JobCard key={index} {...job} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobRecommendations;
