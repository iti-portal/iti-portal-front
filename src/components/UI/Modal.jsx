// src/components/UI/Modal.jsx

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { X } from 'lucide-react'; // Use a consistent icon library

function Modal({ isOpen, onClose, title, children, className = '' }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose} // Click on overlay closes modal
        >
          {/* FIX: Removed `max-w-sm` to allow size to be set by parent component via `className` prop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`bg-white rounded-xl shadow-2xl mx-auto overflow-hidden ${className}`} // The hardcoded size is gone
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <button
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default Modal;