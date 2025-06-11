import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired';
  description: string | null;
  transaction_id: string | null;
  created_at: string;
}

export const usePointsHistory = (limit = 10) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPointsHistory = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = await getToken();
        
        if (!token) {
          throw new Error('Unable to authenticate');
        }
        
        // Fetch points transactions
        const { data, error } = await supabase
          .from('points_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        setPointsHistory(data || []);
      } catch (err) {
        console.error('Error fetching points history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsHistory();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('points_transaction_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'points_transactions',
        filter: `user_id=eq.${user.id}`
      }, fetchPointsHistory)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, getToken, limit]);

  return {
    pointsHistory,
    loading,
    error
  };
};