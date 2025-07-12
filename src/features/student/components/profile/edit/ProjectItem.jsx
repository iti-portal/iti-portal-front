import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, ExternalLink, Lightbulb, Camera, Plus, X as XIcon, AlertTriangle } from 'lucide-react';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}/storage/${imagePath}`;
};

function ProjectItem({ project, onEdit, onDelete, onImageAdd, onImageDelete }) {
  // --- All Logic Remains Unchanged ---
  const fileInputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ title: '', message: '', onConfirm: null, type: 'danger' });
  const showConfirmationModal = (title, message, onConfirm, type = 'danger') => { setConfirmationData({ title, message, onConfirm, type }); setShowConfirmation(true); };
  const hideConfirmationModal = () => { setShowConfirmation(false); };
  const handleConfirmAction = () => { if (confirmationData.onConfirm) { confirmationData.onConfirm(); } hideConfirmationModal(); };
  const formatDate = (dateString) => { if (!dateString) return 'N/A'; try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }); } catch { return 'Invalid date'; } };
  const handleImageClick = () => { fileInputRef.current?.click(); };
  const handleImageChange = (e) => { const files = Array.from(e.target.files); if (files.length > 0 && onImageAdd) { files.forEach(file => onImageAdd(project.id, file)); } e.target.value = ''; };
  const handleImageDelete = (e, imageId) => { e.preventDefault(); e.stopPropagation(); showConfirmationModal('Delete Image', 'Are you sure you want to delete this image?', () => { if (onImageDelete) { onImageDelete(imageId); } }, 'danger'); };
  
  // --- JSX with New Design & Animation ---
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 flex flex-col md:flex-row gap-6"
      >
        {/* Left Column: Images */}
        <div className="md:w-1/3 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Camera size={16}/> Screenshots</h4>
            <div className="grid grid-cols-3 gap-2">
                {project.project_images?.map((img) => (
                    <motion.div key={img.id} className="relative group aspect-square" whileHover={{ scale: 1.05 }}>
                        <img
                            src={getImageUrl(img.image_path)}
                            alt={img.alt_text || `Project image`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            onClick={(e) => handleImageDelete(e, img.id)}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                        >
                            <XIcon size={12} />
                        </button>
                    </motion.div>
                ))}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={handleImageClick}
                    className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-colors"
                    title="Add more images"
                >
                    <Plus className="text-gray-400" />
                </motion.div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-2/3 flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-100/50 rounded-lg text-[#901b20]"><Lightbulb size={18}/></div>
                        <h3 className="text-lg font-bold text-gray-800">{project.title || 'Untitled Project'}</h3>
                    </div>
                    <p className="text-xs text-gray-500 ml-11">Created on {formatDate(project.createdAt || project.created_at)}</p>
                </div>
                <div className="flex items-center gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(project)} className="p-2 rounded-full hover:bg-gray-200/70 text-gray-500 hover:text-gray-800"><Edit size={16} /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(project.id)} className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"><Trash2 size={16} /></motion.button>
                </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">{project.description || 'No description available.'}</p>

            {(project.technologiesUsed || project.technologies_used) && (
                <div className="mb-4">
                    <h5 className="text-xs font-semibold text-gray-500 mb-1.5">Technologies Used</h5>
                    <div className="flex flex-wrap gap-1.5">
                        {(project.technologiesUsed || project.technologies_used).split(',').map((tech, i) => (
                           <span key={i} className="bg-[#901b20]/10 text-[#901b20] text-xs font-medium px-2.5 py-1 rounded-full">{tech.trim()}</span>
                        ))}
                    </div>
                </div>
            )}
            
            {(project.projectUrl || project.project_url) && (
                 <a href={project.projectUrl || project.project_url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors self-start">
                    View Project <ExternalLink size={14} />
                 </a>
            )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{confirmationData.title}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">{confirmationData.message}</p>
                <div className="flex justify-center gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={hideConfirmationModal} className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleConfirmAction} className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${confirmationData.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Confirm</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectItem;