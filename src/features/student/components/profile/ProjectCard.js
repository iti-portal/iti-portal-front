// src/features/student/components/profile/ProjectCard.js
import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLink, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ProjectCard({ data }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = data.images || [];
  const hasMultipleImages = images.length > 1;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        nextImage(); // Swipe left -> next image
      } else {
        prevImage(); // Swipe right -> previous image
      }
    }
  };

  // Auto-play functionality (paused on hover)
  useEffect(() => {
    if (!hasMultipleImages || isHovered) return;

    const interval = setInterval(() => {
      nextImage();
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, currentImageIndex]);

  return (
    <div 
      className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.length > 0 && (
        <div 
          className="relative h-48 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <img
            src={images[currentImageIndex].imagePath}
            alt={images[currentImageIndex].altText || data.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Navigation Arrows - Only show on hover if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={nextImage}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Next image"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Image Counter - Show on hover if multiple images */}
          {hasMultipleImages && (
            <div className={`absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`}>
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Dots Indicator - Always visible if multiple images */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play indicator */}
          {hasMultipleImages && !isHovered && (
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Auto-play
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{data.title}</h3>
        <p className="text-gray-700 text-sm mb-3 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>{data.description}</p>
        
        {data.technologiesUsed && (
          <p className="text-xs text-gray-600 mb-3">
            <strong className="font-medium">Technologies:</strong> {data.technologiesUsed}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {data.projectUrl && (
            <a
              href={data.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
            >
              <FaLink className="mr-1" /> View Project
            </a>
          )}
          {data.githubUrl && (
            <a
              href={data.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
            >
              <FaGithub className="mr-1" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
