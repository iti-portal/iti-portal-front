// src/features/admin/components/AdminApplicationCard.jsx
// This component displays a single job application card for the Admin Dashboard,
// showing applicant, job, and company details, along with administrative actions.
// Download CV and View Profile buttons have been removed as per user request.

import React from 'react';
import { 
    User, Mail, Phone, Linkedin, Github, Link as LinkIcon, FileText, 
    Briefcase, Clock, CalendarCheck, CheckCircle, XCircle, Info, Trash2,
    UserCheck, UserX, CalendarPlus, Building2, TrendingUp 
} from 'lucide-react';
// import { Link } from 'react-router-dom'; // No longer needed if View Profile is removed

const AdminApplicationCard = ({ 
    application, 
    handleUpdateApplicationStatus, 
    handleDeleteApplication,
    // handleDownloadCV // No longer passed as prop if button is removed
}) => {
    // Destructure application data based on the JSON response structure
    const { 
        id, created_at, status, cover_letter, cv_path, 
        user, job 
    } = application;

    // Destructure user and profile data with optional chaining
    const { 
        id: userId, 
        email, 
        profile 
    } = user || {};
    const { 
        first_name, last_name, phone, whatsapp, linkedin, github, portfolio_url, 
        profile_picture, branch, program, track, intake, student_status 
    } = profile || {};

    // Destructure job and company data with optional chaining
    const { 
        title: jobTitle, 
        job_type, 
        experience_level, 
        company 
    } = job || {};
    const { 
        company_profile 
    } = company || {};
    const { 
        company_name, 
        location: companyLocation, 
        logo: companyLogo 
    } = company_profile || {};

    // Helper function to determine the styling and icon for the application status badge.
    const getStatusBadge = (currentStatus) => {
        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-800';
        let icon = null;
        let displayText = currentStatus ? currentStatus.replace(/_/g, ' ').toUpperCase() : 'N/A';

        switch (currentStatus) {
            case 'applied':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                icon = <Info size={16} className="inline-block mr-1" />;
                break;
            case 'reviewed': 
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                icon = <Clock size={16} className="inline-block mr-1" />; 
                displayText = 'UNDER REVIEW'; 
                break;
            case 'interviewed': 
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                icon = <CalendarCheck size={16} className="inline-block mr-1" />; 
                displayText = 'INTERVIEW SCHEDULED'; 
                break;
            case 'hired': 
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                icon = <CheckCircle size={16} className="inline-block mr-1" />;
                displayText = 'ACCEPTED'; 
                break;
            case 'rejected':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                icon = <XCircle size={16} className="inline-block mr-1" />;
                break;
            default:
                break;
        }
        return (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center ${bgColor} ${textColor}`}>
                {icon} {displayText}
            </span>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            {/* Applicant & Job Header */}
            <div className="flex items-center mb-4">
                {profile_picture ? (
                    <img 
                        src={`${process.env.REACT_APP_API_ASSET_URL}/${profile_picture}`} 
                        alt={`${first_name} ${last_name}`} 
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-iti-primary" 
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/e0e0e0/000000?text=User"; }}
                    />
                ) : (
                    <User size={48} className="text-gray-500 mr-4" />
                )}
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{first_name} {last_name}</h3>
                    <p className="text-iti-primary font-semibold">{jobTitle || 'N/A'}</p>
                </div>
            </div>

            {/* Application Details */}
            <div className="space-y-2 text-gray-700 text-sm mb-4">
                <p className="flex items-center"><Mail size={16} className="mr-2 text-gray-500" /> {email || 'N/A'}</p>
                {phone && <p className="flex items-center"><Phone size={16} className="mr-2 text-gray-500" /> {phone}</p>}
                {whatsapp && <p className="flex items-center"><Phone size={16} className="mr-2 text-gray-500" /> (WhatsApp) {whatsapp}</p>}
                {linkedin && (
                    <p className="flex items-center text-blue-600 hover:underline">
                        <Linkedin size={16} className="mr-2" /> 
                        <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </p>
                )}
                {github && (
                    <p className="flex items-center text-gray-800 hover:underline">
                        <Github size={16} className="mr-2" /> 
                        <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </p>
                )}
                {portfolio_url && (
                    <p className="flex items-center text-purple-600 hover:underline">
                        <LinkIcon size={16} className="mr-2" /> 
                        <a href={portfolio_url} target="_blank" rel="noopener noreferrer">Portfolio</a>
                    </p>
                )}
                <p className="flex items-center"><Building2 size={16} className="mr-2 text-gray-500" /> Company: {company_name || 'N/A'}</p>
                <p className="flex items-center"><Briefcase size={16} className="mr-2 text-gray-500" /> Job Type: {job_type?.replace(/_/g, ' ') || 'N/A'}</p>
                <p className="flex items-center"><TrendingUp size={16} className="mr-2 text-gray-500" /> Experience: {experience_level?.replace(/_/g, ' ') || 'N/A'}</p>
                <p className="flex items-center"><CalendarCheck size={16} className="mr-2 text-gray-500" /> Applied On: {new Date(created_at).toLocaleDateString()}</p>
                <p className="text-gray-800 text-base flex items-center">
                    <span className="font-semibold">Status:</span> 
                    {getStatusBadge(status)}
                </p>
            </div>

            {/* Cover Letter */}
            {cover_letter && (
                <details className="text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <summary className="cursor-pointer text-iti-primary hover:underline font-semibold flex items-center">
                        <FileText size={18} className="mr-2" /> View Cover Letter
                    </summary>
                    <p className="mt-3 p-2 bg-white rounded-md border border-gray-100 shadow-inner whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                        {cover_letter}
                    </p>
                </details>
            )}

            {/* Admin Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
                {/* Removed View Profile button */}
                {/* Removed Download CV button */}

                {/* Status Update Buttons (Conditional) */}
                {status !== 'hired' && status !== 'rejected' && (
                    <>
                        {status !== 'reviewed' && ( // Only show Review if not already reviewed
                            <button
                                onClick={() => handleUpdateApplicationStatus(id, 'reviewed')}
                                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
                            >
                                <Clock size={16} className="mr-2" /> Review
                            </button>
                        )}
                        {status !== 'interviewed' && ( // Only show Interview if not already interviewed
                            <button
                                onClick={() => handleUpdateApplicationStatus(id, 'interviewed')}
                                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-75"
                            >
                                <CalendarPlus size={16} className="mr-2" /> Interview
                            </button>
                        )}
                        <button
                            onClick={() => handleUpdateApplicationStatus(id, 'hired')}
                            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75"
                        >
                            <UserCheck size={16} className="mr-2" /> Hire
                        </button>
                        <button
                            onClick={() => handleUpdateApplicationStatus(id, 'rejected')}
                            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75"
                        >
                            <UserX size={16} className="mr-2" /> Reject
                        </button>
                    </>
                )}

                {/* Delete Application */}
                <button
                    onClick={() => handleDeleteApplication(id)}
                    className="inline-flex items-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75"
                >
                    <Trash2 size={16} className="mr-2" /> Delete
                </button>
            </div>
        </div>
    );
};

export default AdminApplicationCard;
