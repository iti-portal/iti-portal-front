/**
 * AchievementTypeSelector Component
 * Reusable component for selecting achievement types
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ACHIEVEMENT_CATEGORIES } from '../../types/achievementTypes';
import { getAchievementDisplayProps } from '../../utils/achievementHelpers';

const AchievementTypeSelector = ({ 
  selectedType, 
  onTypeChange, 
  disabled = false,
  className = '' 
}) => {
  const achievementTypes = Object.keys(ACHIEVEMENT_CATEGORIES);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {achievementTypes.map((type) => {
        const category = ACHIEVEMENT_CATEGORIES[type];
        const displayProps = getAchievementDisplayProps(type);
        const isSelected = selectedType === type;

        return (
          <motion.button
            key={type}
            type="button"
            onClick={() => !disabled && onTypeChange(type)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 
              ${isSelected 
                ? 'border-[#901b20] bg-[#901b20] text-white shadow-lg' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#901b20] hover:shadow-md'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">{displayProps.icon}</span>
            </div>
            
            {/* Label */}
            <div className="text-sm font-medium text-center">
              {category.label}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg 
                  className="w-4 h-4 text-[#901b20]" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default AchievementTypeSelector;
