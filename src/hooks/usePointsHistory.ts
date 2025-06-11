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
        
        // For demo purposes, create mock points history
        // In a real app, this would fetch from the database
        const mockPointsHistory = [
          {
            id: 'mock-points-1',
            user_id: user.id,
            points: 2000,
            type: 'earned' as const,
            description: 'Purchase: RAG Pipeline & Chatbot',
            transaction_id: 'mock-tx-1',
            created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: 'mock-points-2',
            user_id: user.id,
            points: 3000,
            type: 'earned' as const,
            description: 'Purchase: API Calls in n8n',
            transaction_id: 'mock-tx-2',
            created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          },
          {
            id: 'mock-points-3',
            user_id: user.id,
            points: -1000,
            type: 'redeemed' as const,
            description: 'Discount applied to purchase',
            transaction_id: null,
            created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
          },
          {
            id: 'mock-points-4',
            user_id: user.id,
            points: 2000,
            type: 'earned' as const,
            description: 'Purchase: Customer Support Workflow',
            transaction_id: 'mock-tx-3',
            created_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
          }
        ];
        
        setPointsHistory(mockPointsHistory);
      } catch (err) {
        console.error('Error fetching points history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsHistory();
  }, [user, getToken, limit]);

  return {
    pointsHistory,
    loading,
    error
  };
};