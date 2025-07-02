import { useState, useEffect } from 'react';
import { subscribeToItemCounts } from '../services/database';

export function useRealTimeItemCounts(userId) {
  const [counts, setCounts] = useState({
    passwords: 0,
    bankCards: 0,
    bankDetails: 0,
    documents: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Initial state setup with zeros
    setCounts({
      passwords: 0,
      bankCards: 0,
      bankDetails: 0,
      documents: 0,
    });

    if (!userId) {
      setLoading(false);
      return;
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToItemCounts(userId, (type, count) => {
      setCounts(prevCounts => ({
        ...prevCounts,
        [type]: count
      }));
      setLoading(false);
    });
    
    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [userId]);
  
  return { counts, loading };
}
