import React, { useState } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, CheckCircle, FileText, Archive, BarChart3, List, Send, ArchiveX } from 'lucide-react';

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const articles = [
    {
      id: 1,
      title: "The Future of AI in Content Creation",
      author: "Alice Johnson",
      status: "Published",
      publishedDate: "2023-10-26",
      likes: 1245
    },
    {
      id: 2,
      title: "10 Essential Tips for Remote Work Productivity",
      author: "Bob Williams",
      status: "Published",
      publishedDate: "2023-09-15",
      likes: 987
    },
    {
      id: 3,
      title: "Understanding Blockchain Technology",
      author: "Charlie Brown",
      status: "Draft",
      publishedDate: "2023-11-01",
      likes: 0
    },
    {
      id: 4,
      title: "A Comprehensive Guide to Modern Web Development",
      author: "Diana Prince",
      status: "Published",
      publishedDate: "2023-08-20",
      likes: 2311
    },
    {
      id: 5,
      title: "The Psychology of User Experience Design",
      author: "Eve Adams",
      status: "Archived",
      publishedDate: "2022-12-01",
      likes: 1567
    },
    {
      id: 6,
      title: "Mastering Data Analytics with Python",
      author: "Frank Miller",
      status: "Published",
      publishedDate: "2023-07-05",
      likes: 1890
    },
    {
      id: 7,
      title: "Cybersecurity Best Practices for Small Businesses",
      author: "Grace Lee",
      status: "Draft",
      publishedDate: "2023-11-10",
      likes: 0
    },
    {
      id: 8,
      title: "The Impact of AI on the Job Market",
      author: "Harry Potter",
      status: "Published",
      publishedDate: "2023-06-01",
      likes: 1122
    },
    {
      id: 9,
      title: "Sustainable Living: A Guide to Eco-Friendly Habits",
      author: "Ivy Green",
      status: "Archived",
      publishedDate: "2022-11-20",
      likes: 789
    },
    {
      id: 10,
      title: "Machine Learning Fundamentals for Beginners",
      author: "John Smith",
      status: "Published",
      publishedDate: "2023-12-15",
      likes: 2156
    },
    {
      id: 11,
      title: "Cloud Computing: AWS vs Azure vs Google Cloud",
      author: "Sarah Connor",
      status: "Published",
      publishedDate: "2023-11-28",
      likes: 1893
    },
    {
      id: 12,
      title: "Mobile App Development Trends in 2024",
      author: "Mike Johnson",
      status: "Draft",
      publishedDate: "2023-12-01",
      likes: 0
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case 'Published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleEdit = (article) => {
    console.log('Edit article:', article);
  };

  const handleDelete = (article) => {
    console.log('Delete article:', article);
  };

  const handlePublish = (article) => {
    console.log('Publish article:', article);
  };

  const handleArchive = (article) => {
    console.log('Archive article:', article);
  };

  const handleUnarchive = (article) => {
    console.log('Unarchive article:', article);
  };

  const publishedCount = articles.filter(a => a.status === 'Published').length;
  const draftCount = articles.filter(a => a.status === 'Draft').length;
  const archivedCount = articles.filter(a => a.status === 'Archived').length;

  const filteredArticles = filterStatus === 'all' 
    ? articles 
    : articles.filter(article => article.status === filterStatus);

  // Pagination logic
  const articlesPerPage = 10;
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handleFilterChange = (status) => {
    setFilterStatus(filterStatus === status ? 'all' : status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderActionButtons = (article) => {
    const buttons = [];
    
    // Edit button
    buttons.push(
      <button
        key="edit"
        onClick={() => handleEdit(article)}
        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
      >
        <Edit size={12} />
        <span className="hidden sm:inline">Edit</span>
      </button>
    );

    // Delete button
    buttons.push(
      <button
        key="delete"
        onClick={() => handleDelete(article)}
        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 size={12} />
        <span className="hidden sm:inline">Delete</span>
      </button>
    );

    // Conditional buttons based on status
    if (article.status === 'Draft') {
      buttons.push(
        <button
          key="publish"
          onClick={() => handlePublish(article)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
        >
          <Send size={12} />
          <span className="hidden sm:inline">Publish</span>
        </button>
      );
    } else if (article.status === 'Published') {
      buttons.push(
        <button
          key="archive"
          onClick={() => handleArchive(article)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
        >
          <Archive size={12} />
          <span className="hidden sm:inline">Archive</span>
        </button>
      );
    } else if (article.status === 'Archived') {
      buttons.push(
        <button
          key="unarchive"
          onClick={() => handleUnarchive(article)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          <ArchiveX size={12} />
          <span className="hidden sm:inline">Unarchive</span>
        </button>
      );
    }

    return buttons;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === i
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={currentPage === i ? { backgroundColor: '#901b20' } : {}}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 text-sm rounded ${
            currentPage === 1
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={currentPage === 1 ? { backgroundColor: '#901b20' } : {}}
        >
          1
        </button>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        buttons.push(<span key="start-ellipsis" className="px-2 py-1 text-sm text-gray-500">...</span>);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === i
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={currentPage === i ? { backgroundColor: '#901b20' } : {}}
            >
              {i}
            </button>
          );
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        buttons.push(<span key="end-ellipsis" className="px-2 py-1 text-sm text-gray-500">...</span>);
      }

      // Show last page
      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === totalPages
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={currentPage === totalPages ? { backgroundColor: '#901b20' } : {}}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#901b20' }}
          >
            <span className="text-lg">+</span>
            New Article
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Article Insights</h2>
            </div>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer ${filterStatus === 'Published' ? 'bg-red-50' : ''}`}
                onClick={() => handleFilterChange('Published')}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: '#901b20' }} />
                  <span className="text-gray-700">Published</span>
                </div>
                <span className="font-semibold text-gray-900">{publishedCount}</span>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer ${filterStatus === 'Draft' ? 'bg-yellow-50' : ''}`}
                onClick={() => handleFilterChange('Draft')}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-yellow-600" />
                  <span className="text-gray-700">Drafts</span>
                </div>
                <span className="font-semibold text-gray-900">{draftCount}</span>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer ${filterStatus === 'Archived' ? 'bg-gray-50' : ''}`}
                onClick={() => handleFilterChange('Archived')}
              >
                <div className="flex items-center gap-3">
                  <Archive size={16} className="text-gray-500" />
                  <span className="text-gray-700">Archived</span>
                </div>
                <span className="font-semibold text-gray-900">{archivedCount}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div 
                className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer ${filterStatus === 'all' ? 'bg-blue-50' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                <div className="flex items-center gap-3">
                  <List size={16} className="text-blue-600" />
                  <span className="text-gray-700">Total Articles</span>
                </div>
                <span className="font-semibold text-gray-900">{articles.length}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {/* Table */}
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Likes
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        <div className="line-clamp-2">{article.title}</div>
                        <div className="text-xs text-gray-500 mt-1 md:hidden">
                          by {article.author}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 lg:hidden">
                          {article.publishedDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-600">{article.author}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={getStatusBadge(article.status)}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-600">{article.publishedDate}</div>
                    </td>
                    <td className="px-3 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{article.likes}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
                        {renderActionButtons(article)}
                      </div>
                      <div className="mt-1 sm:hidden text-xs text-gray-500">
                        {article.views} views • {article.comments} comments
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {renderPaginationButtons()}
                </div>
                
                <button 
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;