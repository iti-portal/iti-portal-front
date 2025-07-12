import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, UserCheck, UserX, Star, Download } from 'lucide-react';

const ApplicantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedEmployment, setSelectedEmployment] = useState('All Employment Type');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allApplicants = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 4,
      stage: '1st Interview',
      applied: '2023-10-26',
      department: 'Engineering',
      employment: 'Full-time',
      jobTitle: 'Senior Frontend Developer'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      rating: 5,
      stage: 'Offer Extended',
      applied: '2023-10-25',
      department: 'Product',
      employment: 'Full-time',
      jobTitle: 'Product Manager'
    },
    {
      id: 3,
      name: 'Emily Davis',
      avatar: 'ED',
      rating: 3,
      stage: 'Screening',
      applied: '2023-10-24',
      department: 'Design',
      employment: 'Full-time',
      jobTitle: 'UX Designer'
    },
    {
      id: 4,
      name: 'David Lee',
      avatar: 'DL',
      rating: 4,
      stage: '2nd Interview',
      applied: '2023-10-23',
      department: 'Marketing',
      employment: 'Full-time',
      jobTitle: 'Marketing Specialist'
    },
    {
      id: 5,
      name: 'Jessica Kim',
      avatar: 'JK',
      rating: 4,
      stage: 'Hired',
      applied: '2023-10-22',
      department: 'Analytics',
      employment: 'Full-time',
      jobTitle: 'Data Analyst'
    },
    {
      id: 6,
      name: 'Daniel Garcia',
      avatar: 'DG',
      rating: 3,
      stage: 'Rejected',
      applied: '2023-10-21',
      department: 'Sales',
      employment: 'Contract',
      jobTitle: 'Sales Representative'
    },
    {
      id: 7,
      name: 'Sophia Miller',
      avatar: 'SM',
      rating: 4,
      stage: 'Screening',
      applied: '2023-10-20',
      department: 'Human Resources',
      employment: 'Part-time',
      jobTitle: 'HR Coordinator'
    },
    {
      id: 8,
      name: 'William Brown',
      avatar: 'WB',
      rating: 3,
      stage: 'Task Sent',
      applied: '2023-10-19',
      department: 'Customer Service',
      employment: 'Full-time',
      jobTitle: 'Customer Support Specialist'
    },
    {
      id: 9,
      name: 'Olivia Wilson',
      avatar: 'OW',
      rating: 4,
      stage: '1st Interview',
      applied: '2023-10-18',
      department: 'Marketing',
      employment: 'Contract',
      jobTitle: 'Content Marketing Manager'
    },
    {
      id: 10,
      name: 'James Moore',
      avatar: 'JM',
      rating: 4,
      stage: '2nd Interview',
      applied: '2023-10-17',
      department: 'Operations',
      employment: 'Full-time',
      jobTitle: 'Operations Manager'
    },
    {
      id: 11,
      name: 'Anna Rodriguez',
      avatar: 'AR',
      rating: 5,
      stage: 'Screening',
      applied: '2023-10-16',
      department: 'Engineering',
      employment: 'Full-time',
      jobTitle: 'Backend Developer'
    },
    {
      id: 12,
      name: 'Thomas Anderson',
      avatar: 'TA',
      rating: 3,
      stage: 'Task Sent',
      applied: '2023-10-15',
      department: 'Design',
      employment: 'Contract',
      jobTitle: 'Graphic Designer'
    },
    {
      id: 13,
      name: 'Lisa Thompson',
      avatar: 'LT',
      rating: 4,
      stage: '1st Interview',
      applied: '2023-10-14',
      department: 'Product',
      employment: 'Full-time',
      jobTitle: 'Product Owner'
    },
    {
      id: 14,
      name: 'Robert Martinez',
      avatar: 'RM',
      rating: 5,
      stage: 'Offer Extended',
      applied: '2023-10-13',
      department: 'Engineering',
      employment: 'Full-time',
      jobTitle: 'DevOps Engineer'
    },
    {
      id: 15,
      name: 'Jennifer White',
      avatar: 'JW',
      rating: 3,
      stage: 'Screening',
      applied: '2023-10-12',
      department: 'Sales',
      employment: 'Part-time',
      jobTitle: 'Sales Associate'
    }
  ];

  // Extract unique values for filters
  const jobTitles = [...new Set(allApplicants.map(a => a.jobTitle))];
  const departments = [...new Set(allApplicants.map(a => a.department))];
  const stages = [...new Set(allApplicants.map(a => a.stage))];
  const employmentTypes = [...new Set(allApplicants.map(a => a.employment))];

  // Filter applicants based on search and filters
  const filteredApplicants = allApplicants.filter(applicant => {
    const matchesSearch = searchTerm === '' || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJob = selectedJob === 'All Jobs' || applicant.jobTitle === selectedJob;
    
    const matchesDepartment = selectedDepartment === 'All Departments' || applicant.department === selectedDepartment;
    
    const matchesStage = selectedStage === 'All Stages' || applicant.stage === selectedStage;
    
    const matchesEmployment = selectedEmployment === 'All Employment Type' || applicant.employment === selectedEmployment;
    
    return matchesSearch && matchesJob && matchesDepartment && matchesStage && matchesEmployment;
  });

  // Paginate results
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedJob, selectedDepartment, selectedStage, selectedEmployment]);

  const getStageColor = (stage) => {
    const colors = {
      'Screening': 'bg-blue-100 text-blue-800',
      '1st Interview': 'bg-yellow-100 text-yellow-800',
      '2nd Interview': 'bg-orange-100 text-orange-800',
      'Task Sent': 'bg-purple-100 text-purple-800',
      'Offer Extended': 'bg-green-100 text-green-800',
      'Hired': 'bg-green-200 text-green-900',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleMoveToNextStage = (applicant) => {
    console.log(`Moving ${applicant.name} to next stage`);
    // Implementation for moving to next stage
  };

  const handleRejectApplicant = (applicant) => {
    console.log(`Rejecting ${applicant.name}`);
    // Implementation for rejecting applicant
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Applicants</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or job title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option>All Jobs</option>
                {jobTitles.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option>All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                <option>All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20]"
                value={selectedEmployment}
                onChange={(e) => setSelectedEmployment(e.target.value)}
              >
                <option>All Employment Type</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">NAME</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">RATINGS</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">STAGE</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">CV</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">APPLIED DATE</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">DEPARTMENT</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">EMPLOYMENT</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                        {applicant.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{applicant.name}</div>
                        <div className="text-sm text-gray-500">{applicant.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {renderStars(applicant.rating)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(applicant.stage)}`}>
                      {applicant.stage}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-[#901b20] hover:text-[#701418] font-medium text-sm flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      View CV
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{applicant.applied}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{applicant.department}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{applicant.employment}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {applicant.stage !== 'Hired' && applicant.stage !== 'Rejected' && (
                        <button 
                          className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 flex items-center gap-1"
                          onClick={() => handleMoveToNextStage(applicant)}
                        >
                          <UserCheck className="w-3 h-3" />
                          Next Stage
                        </button>
                      )}
                      {applicant.stage !== 'Rejected' && applicant.stage !== 'Hired' && (
                        <button 
                          className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full hover:bg-red-200 flex items-center gap-1"
                          onClick={() => handleRejectApplicant(applicant)}
                        >
                          <UserX className="w-3 h-3" />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApplicants.length)} of {filteredApplicants.length} results
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNum
                        ? 'bg-[#901b20] text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button 
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantManagement;