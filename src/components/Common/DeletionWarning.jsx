import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function DeletionWarning() {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user?.marked_for_deletion_at) {
    return null;
  }

  const cancelDeletion = async () => {
    try {
      setLoading(true);
      await axios.post('/api/account/cancel-delete');
      await refreshUserProfile(); 
      alert('✅ Account deletion cancelled.');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to cancel deletion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 my-4 rounded shadow">
      <p className="mb-2">
        ⚠️ Your account is scheduled to be deleted on{' '}
        <strong>{new Date(user.marked_for_deletion_at).toLocaleDateString()}</strong>.
      </p>
      <button
        onClick={cancelDeletion}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        {loading ? 'Cancelling...' : 'Cancel Deletion'}
      </button>
    </div>
  );
}
