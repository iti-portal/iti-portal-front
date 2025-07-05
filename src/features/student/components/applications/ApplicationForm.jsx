// src/features/student/ApplicationForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importing icons from lucide-react (ensure you have it installed: npm install lucide-react)
import { Loader2, XCircle, CheckCircle, Info, Upload } from 'lucide-react'; // Added Upload icon

const ApplicationForm = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Effect to clear success message after a few seconds and navigate
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                navigate('/my-applications'); // Navigate after success message is shown
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    // Effect to clear error message after a few seconds (optional, can keep for user to read)
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setSuccessMessage(null);

        if (!jobId) {
            setError('Job ID is missing. Please try again from the job details page.');
            return;
        }
        if (!cvFile) {
            setError('Please upload your CV.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('job_id', jobId);
        formData.append('cover_letter', coverLetter);
        formData.append('cv', cvFile);

        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setIsLoading(false);
            // Optionally, navigate to login page
            // navigate('/login'); 
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/job-applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, 
                },
            });

            if (response.data.success) {
                setSuccessMessage('Your application has been submitted successfully!');
                setCoverLetter('');
                setCvFile(null);
                // Navigation handled by useEffect for successMessage
            } else {
                setError(response.data.data?.message || response.data.message || 'An error occurred during submission.');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                    // navigate('/login');
                } else if (err.response.data && err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
                    setError(errorMessages);
                } else {
                    setError(err.response.data.message || 'Server error occurred. Please try again.');
                }
            } else if (err.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto p-8 bg-white rounded-xl shadow-lg max-w-3xl">
                <h2 className="text-4xl font-extrabold bg-iti-gradient-text text-center mb-6 pb-4 border-b-2 border-gray-200 tracking-tight">
                    Apply for Job ID: {jobId}
                </h2>
                <p className="text-center text-gray-600 mb-8 text-lg">
                    Complete the form below to submit your application for this position.
                </p>

                {/* Loading message */}
                {isLoading && (
                    <div className="text-center py-8">
                        <Loader2 className="animate-spin h-12 w-12 text-iti-primary mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Submitting your application...</p>
                    </div>
                )}
                
                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2"> {error}</span>
                        <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setError(null)}>
                            <XCircle className="h-6 w-6 text-red-500" />
                        </span>
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2"> {successMessage}</span>
                        <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setSuccessMessage(null)}>
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </span>
                    </div>
                )}

                {!isLoading && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="coverLetter" className="block text-gray-800 text-lg font-semibold mb-2">
                                Your Application Details
                            </label>
                            <textarea
                                id="coverLetter"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows="8"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-iti-primary focus:border-transparent transition duration-200"
                                placeholder="Write a brief cover letter highlighting your skills and experience relevant to this role."
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="cvFile" className="block text-gray-800 text-lg font-semibold mb-2">
                                Resume/CV
                            </label>
                            <div className="flex items-center space-x-4">
                                {/* Hidden native file input */}
                                <input
                                    type="file"
                                    id="cvFile"
                                    accept=".pdf,.doc,.docx" 
                                    onChange={handleFileChange}
                                    className="hidden" // Hide the default input
                                />
                                {/* Custom styled button (label linked to the hidden input) */}
                                <label 
                                    htmlFor="cvFile"
                                    className="inline-flex items-center bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-iti-primary focus:ring-opacity-75"
                                >
                                    <Upload size={18} className="mr-2" /> Upload File
                                </label>
                                {/* Display selected file name or "No file chosen" */}
                                <span className="text-gray-600 text-sm truncate max-w-[calc(100%-120px)]">
                                    {cvFile ? (
                                        <span className="font-medium text-gray-800">{cvFile.name}</span>
                                    ) : (
                                        'No file chosen'
                                    )}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Upload your resume (PDF, DOCX)</p>
                        </div>

                        <div className="flex items-center justify-end space-x-4 mt-8">
                            <button
                                type="submit"
                                className="bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-iti-primary focus:ring-opacity-75"
                                disabled={isLoading} 
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <Loader2 className="animate-spin h-5 w-5 mr-3" /> Submitting...
                                    </span>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
