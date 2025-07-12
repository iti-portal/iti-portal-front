// src/components/Home/TestimonialCard.jsx

import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const TestimonialCard = ({ 
  quote, 
  name, 
  role,
  index = 0
}) => {
  const { ref, animationClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: index * 150
  });

  return (
    <div 
      ref={ref} 
      className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${animationClasses}`}
    >
      <div className="text-iti-primary mb-4">
        <FaQuoteLeft className="text-2xl" />
      </div>
      <p className="text-gray-700 italic mb-6">"{quote}"</p>
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
