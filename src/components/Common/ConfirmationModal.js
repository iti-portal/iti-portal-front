import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * A modern, reusable confirmation modal.
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {function} onClose - Function to call when closing the modal (e.g., clicking cancel or background).
 * @param {function} onConfirm - Function to call when the confirmation button is clicked.
 * @param {string} title - The main title of the modal.
 * @param {string} message - The descriptive message inside the modal.
 * @param {string} [confirmText='Confirm'] - The text for the confirmation button.
 * @param {boolean} [isConfirming=false] - Flag to show a loading state on the confirm button.
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isConfirming = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-5">{title}</h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>

            <div className="flex gap-4 p-5 bg-gray-50/60">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                disabled={isConfirming}
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full shadow-sm disabled:opacity-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                disabled={isConfirming}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg disabled:opacity-50 disabled:bg-red-400 flex items-center justify-center gap-2 transition-all"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  confirmText
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;