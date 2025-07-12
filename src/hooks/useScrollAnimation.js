/**
 * useScrollAnimation Hook
 * Provides scroll-based animations for components
 */

import { useState, useEffect, useRef } from 'react';

const useScrollAnimation = ({ 
  animationType = 'fadeInUp', 
  delay = 0, 
  threshold = 0.1 
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (!isVisible) {
      switch (animationType) {
        case 'fadeInUp':
          return `${baseClasses} opacity-0 transform translate-y-8`;
        case 'fadeInDown':
          return `${baseClasses} opacity-0 transform -translate-y-8`;
        case 'fadeInLeft':
          return `${baseClasses} opacity-0 transform -translate-x-8`;
        case 'fadeInRight':
          return `${baseClasses} opacity-0 transform translate-x-8`;
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'scaleIn':
          return `${baseClasses} opacity-0 transform scale-95`;
        case 'slideInUp':
          return `${baseClasses} opacity-0 transform translate-y-full`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
  };

  return {
    ref,
    animationClasses: getAnimationClasses(),
    isVisible
  };
};

export default useScrollAnimation;
