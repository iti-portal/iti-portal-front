// src/components/Home/RoleCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const RoleCard = ({ 
  icon: Icon, 
  title, 
  description, 
  linkTo, 
  linkText, 
  borderColor, 
  iconColor, 
  bgColor, 
  textColor 
}) => (
  <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 ${borderColor}`}>
    <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className={`${iconColor} text-2xl`} />
    </div>
    
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    
    <Link 
      to={linkTo}
      className={`inline-flex items-center px-6 py-3 ${textColor} border-2 ${borderColor} rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200`}
    >
      {linkText}
    </Link>
  </div>
);

export default RoleCard;
