import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useSecureItemCounts(userId) {
  const [counts, setCounts] = useState({
    passwords: 0,
    bankCards: 0,
    bankDetails: 0,
    documents: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Set up real-time listeners for each collection
    const passwordsQuery = query(
      collection(db, 'passwords'),
      where('userId', '==', userId)
    );
    
    const bankCardsQuery = query(
      collection(db, 'cards'),
      where('userId', '==', userId)
    );
    
    const bankDetailsQuery = query(
      collection(db, 'bankDetails'),
      where('userId', '==', userId)
    );
    
    const documentsQuery = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );
    
    // Create listeners for each collection
    const unsubscribePasswords = onSnapshot(
      passwordsQuery,
      (snapshot) => {
        setCounts(prev => ({ ...prev, passwords: snapshot.size }));
      },
      (err) => setError(err)
    );
    
    const unsubscribeBankCards = onSnapshot(
      bankCardsQuery,
      (snapshot) => {
        setCounts(prev => ({ ...prev, bankCards: snapshot.size }));
      },
      (err) => setError(err)
    );
    
    const unsubscribeBankDetails = onSnapshot(
      bankDetailsQuery,
      (snapshot) => {
        setCounts(prev => ({ ...prev, bankDetails: snapshot.size }));
      },
      (err) => setError(err)
    );
    
    const unsubscribeDocuments = onSnapshot(
      documentsQuery,
      (snapshot) => {
        setCounts(prev => ({ ...prev, documents: snapshot.size }));
      },
      (err) => setError(err)
    );
    
    setLoading(false);
    
    // Cleanup function to unsubscribe from all listeners
    return () => {
      unsubscribePasswords();
      unsubscribeBankCards();
      unsubscribeBankDetails();
      unsubscribeDocuments();
    };
  }, [userId]);
  
  return { counts, loading, error };
}
