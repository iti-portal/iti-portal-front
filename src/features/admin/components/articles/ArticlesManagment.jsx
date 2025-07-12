import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchAllArticles,
  deleteArticle,
  publishArticle,
  archiveArticle,
  unarchiveArticle,
} from '../../../../services/articlesApi';

import {
  Edit,
  Trash2,
  Send,
  Archive,
  ArchiveX,
  ThumbsUp,
} from 'lucide-react';

import ViewArticle from './ViewArticle';
import EditArticleForm from './EditArticleForm';
import NewArticleForm from './NewArticleForm';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetchAllArticles();
        setArticles(res.data.data);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleDelete = (article) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this article?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await deleteArticle(article.id);
                setArticles((prev) => prev.filter((a) => a.id !== article.id));
                toast.success('Article deleted successfully!');
              } catch {
                toast.error('Failed to delete article');
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  const handlePublish = async (article) => {
    try {
      const response = await publishArticle(article.id);
      const updated = response.data.data;
      updateArticleInList(updated);
      toast.success('Article published!');
    } catch {
      toast.error('Failed to publish article');
    }
  };

  const handleArchive = async (article) => {
    try {
      const response = await archiveArticle(article.id);
      const updated = response.data.data;
      updateArticleInList(updated);
      toast.success('Article archived!');
    } catch {
      toast.error('Failed to archive article');
    }
  };

  const handleUnarchive = async (article) => {
    try {
      const response = await unarchiveArticle(article.id);
      const updated = response.data.data;
      updateArticleInList(updated);
      toast.success('Article unarchived!');
    } catch {
      toast.error('Failed to unarchive article');
    }
  };

  const updateArticleInList = (updatedArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setViewMode('edit');
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setViewMode('view');
  };

  const handleSave = (updatedArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );
    setSelectedArticle(updatedArticle);
    setViewMode('view');
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setViewMode('list');
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'published':
        return `${base} bg-green-100 text-green-700`;
      case 'draft':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'archived':
        return `${base} bg-gray-100 text-gray-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const filtered = filterStatus === 'all'
    ? articles
    : articles.filter((a) => a.status.toLowerCase() === filterStatus.toLowerCase());

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPaginationButtons = () =>
    Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
      const start = Math.max(0, Math.min(currentPage - 3, totalPages - 5));
      const pageIndex = start + i;
      if (pageIndex >= 0 && pageIndex < totalPages) {
        return (
          <button
            key={pageIndex}
            className={`px-3 py-1 rounded ${
              currentPage === pageIndex + 1
                ? 'bg-[#901b20] text-white'
                : 'border border-gray-300 bg-white hover:bg-gray-100'
            }`}
            onClick={() => setCurrentPage(pageIndex + 1)}
          >
            {pageIndex + 1}
          </button>
        );
      }
      return null;
    }).filter(Boolean);

  const getInitials = (email, name) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const archivedCount = articles.filter((a) => a.status === 'archived').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  if (viewMode === 'view' && selectedArticle)
    return <ViewArticle article={selectedArticle} onBack={handleBack} onEdit={handleEdit} />;

  if (viewMode === 'edit' && selectedArticle)
    return <EditArticleForm article={selectedArticle} onBack={handleBack} onSave={handleSave} />;

  if (viewMode === 'new')
    return (
      <NewArticleForm
        onCancel={handleBack}
        onCreate={(newArticle) => {
          setArticles((prev) => [newArticle, ...prev]);
          setViewMode('list');
          setFilterStatus('all');
          toast.success('Article added!');
        }}
      />
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 overflow-auto">
        <div className="max-w-full mx-auto bg-white rounded-lg shadow border p-6">
          <div className="w-full space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Articles Management</h2>
              <button className="bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition w-full md:w-auto" onClick={() => setViewMode('new')}>
                + New Article
              </button>
            </div>

            {/* Article Insights Bar */}
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="flex-1 min-w-[150px] bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
                <span className="text-xs text-gray-500 font-medium mb-1">Published</span>
                <span className="text-lg font-bold text-green-700">{publishedCount}</span>
              </div>
              <div className="flex-1 min-w-[150px] bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
                <span className="text-xs text-gray-500 font-medium mb-1">Drafts</span>
                <span className="text-lg font-bold text-yellow-700">{draftCount}</span>
              </div>
              <div className="flex-1 min-w-[150px] bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
                <span className="text-xs text-gray-500 font-medium mb-1">Archived</span>
                <span className="text-lg font-bold text-gray-700">{archivedCount}</span>
              </div>
              <div className="flex-1 min-w-[150px] bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
                <span className="text-xs text-gray-500 font-medium mb-1">Total Articles</span>
                <span className="text-lg font-bold text-blue-700">{articles.length}</span>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <div className="min-w-[1000px] w-full">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="text-gray-700">
                      <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">#</th>
                      <th className="py-3 px-4 text-left text-sm font-medium border-b border-gray-200">Title</th>
                      <th className="py-3 px-4 text-left text-sm font-medium border-b border-gray-200">Author</th>
                      <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Status</th>
                      <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Date</th>
                      <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Likes</th>
                      <th className="py-3 px-4 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-400 text-sm">
                          No articles found.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((a, idx) => {
                        const authorName = a.author?.name || a.author?.email || 'Unknown';
                        const authorEmail = a.author?.email || '';
                        const initials = getInitials(authorEmail, a.author?.name);
                        return (
                          <tr
                            key={a.id}
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-center text-gray-600 font-medium">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </td>
                            <td className="py-3 px-4 text-left max-w-xs truncate" title={a.title}>
                              <button
                                onClick={() => handleView(a)}
                                className="text-blue-700 font-medium hover:underline hover:text-blue-900 transition-colors text-left truncate"
                              >
                                {a.title}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-left max-w-xs truncate">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#901b20] to-[#fbbf24] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                  {initials}
                                </div>
                                <span className="truncate" title={authorName}>{authorName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={getStatusBadge(a.status)}>{a.status}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {new Date(a.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-700">
                                <ThumbsUp size={16} className="text-[#901b20]" />
                                <span className="font-semibold">{a.like_count}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex gap-1 flex-nowrap overflow-x-auto whitespace-nowrap justify-center">
                                <button
                                  onClick={() => handleEdit(a)}
                                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <Edit size={12} />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(a)}
                                  className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 size={12} />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                                {a.status === 'draft' && (
                                  <button
                                    onClick={() => handlePublish(a)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                  >
                                    <Send size={12} />
                                    <span className="hidden sm:inline">Publish</span>
                                  </button>
                                )}
                                {a.status === 'published' && (
                                  <button
                                    onClick={() => handleArchive(a)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                                  >
                                    <Archive size={12} />
                                    <span className="hidden sm:inline">Archive</span>
                                  </button>
                                )}
                                {a.status === 'archived' && (
                                  <button
                                    onClick={() => handleUnarchive(a)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    <ArchiveX size={12} />
                                    <span className="hidden sm:inline">Unarchive</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
                  <div>
                    <span className="hidden sm:inline">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
                    </span>
                    <span className="sm:hidden">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {renderPaginationButtons()}
                    <button
                      className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default ArticlesManagement;
