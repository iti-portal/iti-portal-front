// src/features/student/components/profile/edit/TestProjectForm.jsx
// Temporary test component to debug multi-image upload

import React, { useState } from 'react';

function TestProjectForm() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      preview: URL.createObjectURL(file),
      altText: `Image ${images.length + index + 1}`
    }));

    
    setImages(prev => {
      const updated = [...prev, ...newImages];
      return updated;
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-semibold mb-4">Test Multiple Image Upload</h3>
      
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-2"
        />
        <p className="text-sm text-gray-600">
          Selected images: {images.length}
        </p>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Preview:</h4>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview}
                  alt={image.altText}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestProjectForm;
