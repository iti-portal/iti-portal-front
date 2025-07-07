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
  CheckCircle,
  FileText,
  BarChart3,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import ViewArticle from './ViewArticle';
import EditArticleForm from './EditArticleForm';
import NewArticleForm from './NewArticleForm';
import 'react-toastify/dist/ReactToastify.css';

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
    const base = 'px-2 py-1 rounded text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'published':
        return `${base} bg-green-100 text-green-800`;
      case 'draft':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'archived':
        return `${base} bg-gray-100 text-gray-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const archivedCount = articles.filter((a) => a.status === 'archived').length;

  const filtered = filterStatus === 'all'
    ? articles
    : articles.filter((a) => a.status.toLowerCase() === filterStatus.toLowerCase());

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  const renderPaginationButtons = () =>
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1 ? 'bg-[#901b20] text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ToastContainer />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading articles...</div>
          </div>
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
    <div className="p-6 bg-gray-50">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles Management</h1>
        <button
          className="px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: '#901b20' }}
          onClick={() => setViewMode('new')}
        >
          + New Article
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
            <InsightItem
              label="Published"
              icon={<CheckCircle size={16} style={{ color: '#901b20' }} />}
              count={publishedCount}
              active={filterStatus === 'Published'}
              onClick={() => handleFilterChange('Published')}
            />
            <InsightItem
              label="Drafts"
              icon={<FileText size={16} className="text-yellow-600" />}
              count={draftCount}
              active={filterStatus === 'Draft'}
              onClick={() => handleFilterChange('Draft')}
            />
            <InsightItem
              label="Archived"
              icon={<Archive size={16} className="text-gray-500" />}
              count={archivedCount}
              active={filterStatus === 'Archived'}
              onClick={() => handleFilterChange('Archived')}
            />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <InsightItem
                label="Total Articles"
                icon={<List size={16} className="text-blue-600" />}
                count={articles.length}
                active={filterStatus === 'all'}
                onClick={() => handleFilterChange('all')}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Author</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Likes</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <button
                      onClick={() => handleView(a)}
                      className="text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left"
                    >
                      {a.title}
                    </button>
                  </td>
                  <td className="p-2">{a.author?.email || 'Unknown'}</td>
                  <td className="p-2">
                    <span className={getStatusBadge(a.status)}>{a.status}</span>
                  </td>
                  <td className="p-2">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="p-2">{a.like_count}</td>
                  <td className="p-2 flex flex-wrap gap-1">
                    <button
                      onClick={() => handleEdit(a)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit size={12} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(a)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={12} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                    {a.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(a)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                      >
                        <Send size={12} />
                        <span className="hidden sm:inline">Publish</span>
                      </button>
                    )}
                    {a.status === 'published' && (
                      <button
                        onClick={() => handleArchive(a)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                      >
                        <Archive size={12} />
                        <span className="hidden sm:inline">Archive</span>
                      </button>
                    )}
                    {a.status === 'archived' && (
                      <button
                        onClick={() => handleUnarchive(a)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        <ArchiveX size={12} />
                        <span className="hidden sm:inline">Unarchive</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-3 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}–
              {Math.min(currentPage * 10, filtered.length)} of {filtered.length} articles
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="flex gap-1">{renderPaginationButtons()}</div>
              <button
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Insight Item Component
const InsightItem = ({ label, icon, count, active, onClick }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer ${
      active ? 'bg-gray-100' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-700">{label}</span>
    </div>
    <span className="font-semibold text-gray-900">{count}</span>
  </div>
);

export default ArticlesManagement;
