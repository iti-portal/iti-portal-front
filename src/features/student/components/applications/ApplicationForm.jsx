// src/features/student/components/applications/ApplicationForm.jsx

import { useState, useEffect } from 'react';
import Navbar from '../../../../components/Layout/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, XCircle, CheckCircle, UploadCloud, FileText, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ApplicationForm = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // For drag-and-drop UI

    // --- Core Logic (Unchanged) ---
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                navigate('/my-applications');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 6000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!jobId) {
            setError('Job ID is missing. Please return to the job listing and try again.');
            return;
        }
        if (!cvFile) {
            setError('A CV/Resume is required. Please upload your file.');
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        formData.append('job_id', jobId);
        formData.append('cover_letter', coverLetter);
        formData.append('cv', cvFile);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please log in and try again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/job-applications`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setSuccessMessage('Application submitted successfully! Redirecting...');
                setCoverLetter('');
                setCvFile(null);
            } else {
                setError(response.data.message || 'An unknown error occurred.');
            }
        } catch (err) {
            const defaultError = 'An unexpected error occurred. Please try again.';
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                } else if (err.response.data?.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                    setError(errorMessages);
                } else {
                    setError(err.response.data?.message || defaultError);
                }
            } else {
                setError('Could not connect to the server. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Drag and Drop Handlers ---
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setCvFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
            <Navbar />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

            <main className="pt-24 pb-10 px-4 sm:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#901b20]/10 to-[#203947]/10 rounded-full mb-4">
                            <Briefcase className="text-[#901b20] mr-2" size={18} />
                            <span className="text-[#901b20] font-semibold text-sm">JOB APPLICATION</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Apply for Position</h1>
                        <p className="text-gray-600 text-lg">Take the next step in your career. We're excited to hear from you.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 border border-white/30"
                    >
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-r-lg flex items-start">
                                <XCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div><strong className="font-semibold">Error:</strong> {error}</div>
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-r-lg flex items-start">
                                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div><strong className="font-semibold">Success!</strong> {successMessage}</div>
                            </motion.div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
                                <textarea
                                    id="coverLetter"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows="6"
                                    className="w-full p-3 border border-gray-200 bg-white/50 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent outline-none transition"
                                    placeholder="Briefly tell us why you're a great fit for this role..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV (Required)</label>
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className={`relative block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-[#901b20] bg-red-50/50' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <input type="file" id="cvFile" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold text-[#901b20]">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                                </div>
                                {cvFile && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center space-x-2 truncate">
                                            <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-800 font-medium truncate">{cvFile.name}</span>
                                        </div>
                                        <button type="button" onClick={() => setCvFile(null)} className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors">
                                            <XCircle size={18} />
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#203947] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default ApplicationForm;