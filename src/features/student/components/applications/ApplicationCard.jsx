// src/features/student/components/ApplicationCard.jsx
// This component displays a single job application card with its details and actions.

import React from 'react';
import { Link } from 'react-router-dom';

// Importing icons from lucide-react
import { 
    Info, Download, Trash2, ExternalLink, MapPin, BriefcaseBusiness, TrendingUp, Eye,
    Clock, CalendarCheck, CheckCircle, XCircle // Ensure all status icons are imported
} from 'lucide-react'; 

const ApplicationCard = ({ application, handleDownloadCV, handleWithdrawApplication }) => {
    // Destructure application and job data for easier access
    const { job, cover_letter, created_at, status } = application;
    const { company, title, job_type, experience_level } = job || {}; // Optional chaining for job and company
    const { company_name, location } = company?.company_profile || {}; // Optional chaining for company_profile

    // Helper function to get status badge styling (reused from MyApplicationsPage)
    // This function is defined here as it's tightly coupled with the card's display logic
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
            {/* Job Title */}
            <h3 className="text-2xl font-bold text-iti-primary mb-2">{title || 'N/A'}</h3>
            {/* Company Name */}
            <p className="text-gray-800 mb-3 text-lg font-semibold">
                {company_name || 'N/A'}
            </p>
            
            {/* Job Details: Location, Type, Experience Level */}
            <div className="space-y-1 text-gray-700 text-base mb-4">
                {location && (
                    <p className="flex items-center">
                        <MapPin size={18} className="text-gray-500 mr-2" />
                        {location}
                    </p>
                )}
                {job_type && (
                    <p className="flex items-center">
                        <BriefcaseBusiness size={18} className="text-gray-500 mr-2" />
                        {job_type.replace(/_/g, ' ').toUpperCase()}
                    </p>
                )}
                {experience_level && (
                    <p className="flex items-center">
                        <TrendingUp size={18} className="text-gray-500 mr-2" />
                        {experience_level.replace(/_/g, ' ').toUpperCase()}
                    </p>
                )}
            </div>

            {/* Application Status with dynamic styling */}
            <p className="text-gray-800 mb-2 text-lg flex items-center">
                <span className="font-semibold">Status:</span> 
                {getStatusBadge(status)}
            </p>
            {/* Applied Date */}
            <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">Applied On:</span> {new Date(created_at).toLocaleDateString()}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4"> 
                {application.cv_path && ( // Use application.cv_path directly
                    <button
                        onClick={() => handleDownloadCV(application.id)}
                        className="inline-flex items-center bg-iti-primary-light hover:bg-iti-primary-dark text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-iti-primary-light focus:ring-opacity-75"
                    >
                        <Download size={16} className="mr-2" /> Download CV
                    </button>
                )}
                {/* Only show Withdraw button if status is 'applied' */}
                {status === 'applied' && ( 
                    <button
                        onClick={() => handleWithdrawApplication(application.id)}
                        className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                    >
                        <Trash2 size={16} className="mr-2" /> Withdraw
                    </button>
                )}
                <Link 
                    to={`/my-applications/${application.id}`} 
                    className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
                >
                    <Eye size={16} className="mr-2" /> View Details
                </Link>
            </div>
        </div>
    );
};

export default ApplicationCard;
