// src/features/company/applicants/components/CompanyApplicationCard.jsx
// This component displays a single job application card for the company view,
// including applicant details, skill match, cover letter, and updated action buttons.

import React from 'react'; 
import { 
    User, Mail, Phone, Linkedin, Github, Link as LinkIcon, FileText, Download, 
    Percent, Info, CheckCircle, XCircle, Clock, CalendarCheck, Briefcase, TrendingUp,
    MessageSquare, UserCheck, UserX, CalendarPlus, Eye // New icon for View Profile
} from 'lucide-react';

const CompanyApplicationCard = ({ application, handleDownloadCV, handleUpdateApplicationStatus }) => {
    // Destructure application data for easier access
    const { 
        id, created_at, status, cover_letter, cv_path, match_data, user, job 
    } = application;

    // Destructure user and profile data with optional chaining to prevent errors if data is missing
    const { 
        id: userId, // Get userId from user object
        email, profile, skills 
    } = user || {};
    const { 
        first_name, last_name, phone, whatsapp, linkedin, github, portfolio_url, summary, track, intake 
    } = profile || {};

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

    // Helper function to render detailed skill match information.
    const renderSkillMatchDetails = (matchData) => {
        if (!matchData) return <p className="text-gray-600">No skill match data available.</p>;

        return (
            <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">Total Skills:</span> {matchData.total_skills || 0}</p>
                <p><span className="font-semibold">Matched Skills:</span> {matchData.matched_skills || 0}</p>
                <p><span className="font-semibold">Required Skills Matched:</span> {matchData.required_skills_matched || 0}</p>
                <p><span className="font-semibold">Total Required Skills:</span> {matchData.required_skills_total || 0}</p>
                
                {matchData.matched_skill_names && matchData.matched_skill_names.length > 0 && (
                    <p><span className="font-semibold">Matched Skill Names:</span> {matchData.matched_skill_names.join(', ')}</p>
                )}
                {matchData.missing_required_skills && matchData.missing_required_skills.length > 0 && (
                    <p className="text-red-600"><span className="font-semibold">Missing Required Skills:</span> {matchData.missing_required_skills.join(', ')}</p>
                )}
            </div>
        );
    };

    // Modified handleDownloadCV to also update status to 'reviewed' if currently 'applied'
    const handleDownloadCVAndReview = () => {
        // Only update status if current status is 'applied'
        if (status === 'applied') {
            handleUpdateApplicationStatus(id, 'reviewed');
        }
        // Always initiate CV download
        handleDownloadCV(id);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            {/* Applicant Name and Contact Info */}
            <h3 className="text-2xl font-bold text-iti-primary mb-2 flex items-center">
                <User size={24} className="mr-3 text-gray-700" /> 
                {first_name} {last_name}
            </h3>
            <p className="text-gray-800 mb-3 text-lg font-semibold">{email || 'N/A'}</p>

            {/* Contact and Social Links */}
            <div className="space-y-1 text-gray-700 text-base mb-4">
                {phone && (
                    <p className="flex items-center">
                        <Phone size={18} className="text-gray-500 mr-2" />
                        {phone}
                    </p>
                )}
                {whatsapp && (
                    <p className="flex items-center">
                        <Phone size={18} className="text-gray-500 mr-2" /> (WhatsApp) {whatsapp}
                    </p>
                )}
                {linkedin && (
                    <p className="flex items-center text-blue-600 hover:underline">
                        <Linkedin size={18} className="mr-2" /> 
                        <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                    </p>
                )}
                {github && (
                    <p className="flex items-center text-gray-800 hover:underline">
                        <Github size={18} className="mr-2" /> 
                        <a href={github} target="_blank" rel="noopener noreferrer">GitHub Profile</a>
                    </p>
                )}
                {portfolio_url && (
                    <p className="flex items-center text-purple-600 hover:underline">
                        <LinkIcon size={18} className="mr-2" /> 
                        <a href={portfolio_url} target="_blank" rel="noopener noreferrer">Portfolio</a>
                    </p>
                )}
            </div>

            {/* Application Status and Applied Date */}
            <p className="text-gray-800 mb-2 text-lg flex items-center">
                <span className="font-semibold">Status:</span> 
                {getStatusBadge(status)}
            </p>
            <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">Applied On:</span> {new Date(created_at).toLocaleDateString()}
            </p>

            {/* Skill Match Score Section */}
            {match_data && (
                <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-lg font-semibold text-blue-800 flex items-center">
                        <Percent size={20} className="mr-2" /> Skill Match: {match_data.match_score || 0}%
                    </p>
                    <details className="text-gray-700 text-base mt-2">
                        <summary className="cursor-pointer text-blue-700 hover:underline font-semibold flex items-center">
                            <Info size={16} className="mr-2" /> View Skill Details
                        </summary>
                        <div className="mt-3 p-2 bg-white rounded-md border border-gray-100 shadow-inner">
                            {renderSkillMatchDetails(match_data)}
                        </div>
                    </details>
                </div>
            )}

            {/* Cover Letter Section */}
            {cover_letter && (
                <details className="text-gray-700 text-base mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <summary className="cursor-pointer text-iti-primary hover:underline font-semibold flex items-center">
                        <FileText size={18} className="mr-2" /> View Cover Letter
                    </summary>
                    <p className="mt-3 p-2 bg-white rounded-md border border-gray-100 shadow-inner whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                        {cover_letter}
                    </p>
                </details>
            )}

            {/* Action Buttons: Download CV, View Profile, Interview, Hire, Reject */}
            <div className="flex flex-wrap gap-2 mt-4">
                {/* Download CV Button */}
                {cv_path && (
                    <button
                        onClick={handleDownloadCVAndReview} 
                        className="inline-flex items-center bg-iti-primary-light hover:bg-iti-primary-dark text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-iti-primary-light focus:ring-opacity-75"
                    >
                        <Download size={16} className="mr-2" /> Download CV
                    </button>
                )}

                {/* View Profile Button */}
                {userId && ( // Only show if userId exists
                    <a 
                        href={`/student-profile/${userId}`} // Assuming this is the path to student profile
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                    >
                        <Eye size={16} className="mr-2" /> View Profile
                    </a>
                )}

                {/* Conditional Action Buttons */}
                {/* Interview Button */}
                {(status === 'applied' || status === 'reviewed') && (
                    <button
                        onClick={() => handleUpdateApplicationStatus(id, 'interviewed')}
                        className="inline-flex items-center bg-blue-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-75"
                    >
                        <CalendarPlus size={16} className="mr-2" /> Interview
                    </button>
                )}

                {/* Hire Button */}
                {(status === 'interviewed') && (
                    <button
                        onClick={() => handleUpdateApplicationStatus(id, 'hired')}
                        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75"
                    >
                        <UserCheck size={16} className="mr-2" /> Hire
                    </button>
                )}

                {/* Reject Button (can appear at most stages before hired/rejected) */}
                {(status !== 'hired' && status !== 'rejected') && (
                    <button
                        onClick={() => handleUpdateApplicationStatus(id, 'rejected')}
                        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75"
                    >
                        <UserX size={16} className="mr-2" /> Reject
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompanyApplicationCard;
