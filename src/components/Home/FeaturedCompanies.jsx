// src/components/Home/FeaturedCompanies.jsx

import React from 'react';
import { FaBuilding, FaUsers, FaBriefcase, FaArrowRight, FaStar } from 'react-icons/fa';

const CompanyCard = ({ name, logo, rating, employees, openJobs, industry, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        {logo ? (
          <img src={logo} alt={name} className="w-12 h-12 object-cover rounded" />
        ) : (
          <FaBuilding className="text-gray-500 text-2xl" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
        <p className="text-gray-600 text-sm">{industry}</p>
        <div className="flex items-center mt-1">
          <FaStar className="text-yellow-400 text-sm mr-1" />
          <span className="text-sm text-gray-600">{rating}</span>
        </div>
      </div>
    </div>
    
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center mb-1">
          <FaUsers className="text-blue-600 mr-1" />
        </div>
        <div className="text-lg font-semibold text-blue-600">{employees}</div>
        <div className="text-xs text-gray-600">Employees</div>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="flex items-center justify-center mb-1">
          <FaBriefcase className="text-green-600 mr-1" />
        </div>
        <div className="text-lg font-semibold text-green-600">{openJobs}</div>
        <div className="text-xs text-gray-600">Open Jobs</div>
      </div>
    </div>
    
    <button className="w-full bg-iti-primary text-white py-2 px-4 rounded-lg hover:bg-iti-primary-dark transition-colors font-medium">
      View Company
    </button>
  </div>
);

const FeaturedCompanies = () => {
  const companies = [
    {
      name: "Google",
      industry: "Technology",
      rating: "4.8",
      employees: "5K+",
      openJobs: "12",
      description: "Leading technology company focused on organizing the world's information and making it universally accessible.",
    },
    {
      name: "Microsoft",
      industry: "Software",
      rating: "4.7",
      employees: "3K+", 
      openJobs: "8",
      description: "Global technology company developing productivity software, cloud services, and innovative hardware solutions.",
    },
    {
      name: "Amazon",
      industry: "E-commerce & Cloud",
      rating: "4.6",
      employees: "2K+",
      openJobs: "15",
      description: "World's largest online marketplace and leading cloud computing platform serving millions of customers.",
    },
    {
      name: "Facebook",
      industry: "Social Media",
      rating: "4.5",
      employees: "1.5K+",
      openJobs: "6",
      description: "Connecting people worldwide through innovative social networking platforms and virtual reality experiences.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Companies</h2>
            <p className="text-gray-600">Discover top companies actively hiring ITI talent</p>
          </div>
          <button className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium">
            View All Companies
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <CompanyCard key={index} {...company} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
