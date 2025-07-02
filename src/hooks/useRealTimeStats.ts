import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from '../services/dashboardService';

export const useRealTimeStats = (intervalMs: number = 30000) => {
  const [stats, setStats] = useState<DashboardStats>({
    passwords: 0,
    cards: 0,
    documents: 0,
    banks: 0,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const newStats = await dashboardService.getAllStats();
      setStats(newStats);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch statistics');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(fetchStats, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { stats, isLoading, error, refetch: fetchStats };
};
