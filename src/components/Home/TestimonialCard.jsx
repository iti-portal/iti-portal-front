// src/components/Home/TestimonialCard.jsx

import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ quote, name, role, avatar }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <FaQuoteLeft className="text-iti-primary text-2xl mb-4" />
    
    <p className="text-iti-primary mb-6 italic">"{quote}"</p>
    
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <span className="text-gray-500 font-medium">{name.charAt(0)}</span>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
