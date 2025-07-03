// src/components/Home/FeatureCard.jsx

import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, iconColor, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className={`${iconColor} text-xl`} />
    </div>
    
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
