import { useState, useEffect } from 'react';

/**
 * Custom hook for admin dashboard data
 * @returns {Object} Dashboard data and loading state
 */
const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Commented out for now since the API might not be ready
        // const data = await getAdminStats();
        // setStats(data);
        
        // Mock data for development
        setStats({
          totalUsers: 350,
          newUsers: 15,
          activeUsers: 210,
          totalJobs: 125,
          pendingApprovals: 8,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useDashboard;
