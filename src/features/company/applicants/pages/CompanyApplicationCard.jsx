// src/features/company/applicants/components/CompanyApplicationCard.jsx
import React from 'react';
import { 
    Download, Mail, Phone, Clock, Calendar as CalendarIcon, 
    Bookmark, CheckCircle, XCircle, Clock as PendingIcon,
    Eye, ChevronDown, ChevronUp, User
} from 'lucide-react';

const statusIcons = {
    applied: <PendingIcon className="h-4 w-4 text-yellow-500" />,
    reviewed: <Eye className="h-4 w-4 text-blue-500" />,
    interviewed: <CalendarIcon className="h-4 w-4 text-indigo-500" />,
    hired: <CheckCircle className="h-4 w-4 text-green-500" />,
    rejected: <XCircle className="h-4 w-4 text-red-500" />
};

const statusColors = {
    applied: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    interviewed: 'bg-indigo-100 text-indigo-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
};

const statusOptions = [
    { value: 'reviewed', label: 'Mark as Reviewed' },
    { value: 'interviewed', label: 'Schedule Interview' },
    { value: 'hired', label: 'Hire Candidate' },
    { value: 'rejected', label: 'Reject Application' }
];

const CompanyApplicationCard = ({ application, handleDownloadCV, handleUpdateApplicationStatus }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const user = application.user || {};
    const profile = user.profile || {};
    const matchScore = application.match_data?.score || 0;

    const formattedDate = new Date(application.applied_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const hasCoverLetter = application.cover_letter?.trim().length > 0;
    const hasCV = application.cv_url || application.cv_path;

    const initials = profile.first_name || profile.last_name 
        ? `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`
        : <User className="h-6 w-6" />;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-iti-primary to-blue-600 flex items-center justify-center text-white font-bold">
                                {initials}
                            </div>
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {profile.first_name || 'Unknown'} {profile.last_name || ''}
                            </h3>
                            <p className="text-sm text-gray-600 truncate flex items-center">
                                <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                                {user.email || 'No email provided'}
                            </p>
                            {profile.phone && (
                                <p className="text-sm text-gray-600 truncate flex items-center">
                                    <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                                    {profile.phone}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[application.status]} flex items-center`}>
                            {statusIcons[application.status]}
                            <span className="ml-1.5 capitalize">{application.status.replace(/_/g, ' ')}</span>
                        </span>
                        
                        {matchScore > 0 && (
                            <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            matchScore > 75 ? 'bg-green-500' :
                                            matchScore > 50 ? 'bg-blue-500' :
                                            matchScore > 25 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        style={{ width: `${matchScore}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-700 whitespace-nowrap">
                                    {matchScore}% match
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Applied:</span>
                        <span className="ml-1">{formattedDate}</span>
                    </div>

                    {hasCoverLetter && (
                        <div className="mt-3">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center text-sm font-medium text-iti-primary hover:text-blue-700 transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 mr-1.5" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 mr-1.5" />
                                )}
                                {isExpanded ? 'Hide Cover Letter' : 'View Cover Letter'}
                            </button>
                            {isExpanded && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
                                    {application.cover_letter}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleDownloadCV(application.id)}
                        disabled={!hasCV}
                        className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                            hasCV 
                                ? 'text-gray-700 bg-white hover:bg-gray-50'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary`}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {hasCV ? 'Download CV' : 'No CV Available'}
                    </button>
                </div>

                <div className="relative">
                    <select
                        value=""
                        onChange={(e) => {
                            if (e.target.value) {
                                handleUpdateApplicationStatus(application.id, e.target.value);
                                e.target.value = ""; // Reset select after change
                            }
                        }}
                        className="appearance-none inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iti-primary transition-colors"
                    >
                        <option value="">Change Status</option>
                        {statusOptions.map(option => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                disabled={application.status === option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CompanyApplicationCard;