import React, { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission } from '../../../../services/contactUsService';
import Modal from '../../../../components/UI/Modal';
import Alert from '../../../../components/UI/Alert';

/**
 * ContactList component displays contact us submissions with filtering and pagination
 */
const ContactList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await getContactSubmissions();
        if (response.success) {
          setSubmissions(response.data.data);
        } else {
          setError(response.message || 'Failed to fetch submissions');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission => {
    return submission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const submissionsPerPage = 5;
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowMessage = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const handleDelete = async (id) => {
    const submissionToDelete = submissions.find(s => s.id === id);
    if (!submissionToDelete) return;

    const deleteHandler = async () => {
      try {
        const response = await deleteContactSubmission(id);
        if (response.success) {
          setSubmissions(submissions.filter(submission => submission.id !== id));
          setNotification({ show: true, type: 'success', message: 'Submission deleted successfully!' });
        } else {
          setNotification({ show: true, type: 'error', message: response.message || 'Failed to delete submission' });
        }
      } catch (err) {
        setNotification({ show: true, type: 'error', message: err.message || 'An error occurred while deleting the submission' });
      }
    };

    setConfirmModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this submission?',
      onConfirm: () => {
        deleteHandler();
        setConfirmModalOpen(false);
      }
    });
    setConfirmModalOpen(true);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <Alert
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmModalContent.title}
      >
        <p>{confirmModalContent.message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmModalContent.onConfirm}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </Modal>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search submissions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901b20]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSubmissions.map(submission => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {submission.full_name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{submission.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{submission.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{submission.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleShowMessage(submission)}
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      Show Message
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(submission.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * submissionsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * submissionsPerPage, filteredSubmissions.length)}
                </span>{' '}
                of <span className="font-medium">{filteredSubmissions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-[#901b20] text-white border-[#901b20]'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={handleCloseModal}
        title={`Message from ${selectedSubmission?.full_name}`}
      >
        <p>{selectedSubmission?.message}</p>
        <div className="flex justify-end mt-4">
            <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
                Close
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default ContactList;
