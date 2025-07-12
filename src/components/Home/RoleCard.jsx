// src/components/Home/RoleCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const RoleCard = ({ 
  icon: Icon, 
  title, 
  description, 
  borderColor, 
  iconColor, 
  bgColor, 
  textColor,
  index = 0
}) => {
  const { ref, animationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: index * 150
  });

  return (
    <div 
      ref={ref} 
      className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${borderColor} ${animationClasses}`}
    >
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`text-2xl ${iconColor}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default RoleCard;
