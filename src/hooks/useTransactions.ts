import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  product_id: string | null;
  created_at: string;
}

export const useTransactions = (limit = 10) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = await getToken();
        
        if (!token) {
          throw new Error('Unable to authenticate');
        }
        
        // For demo purposes, create mock transactions
        // In a real app, this would fetch from the database
        const mockTransactions = [
          {
            id: 'mock-tx-1',
            user_id: user.id,
            stripe_payment_intent_id: 'pi_mock1',
            stripe_invoice_id: null,
            amount: 2000, // $20.00
            currency: 'usd',
            status: 'completed',
            description: 'RAG Pipeline & Chatbot',
            product_id: 'price_1RYX9PQqrelvc6fFzP2IQv9x',
            created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: 'mock-tx-2',
            user_id: user.id,
            stripe_payment_intent_id: 'pi_mock2',
            stripe_invoice_id: null,
            amount: 3000, // $30.00
            currency: 'usd',
            status: 'completed',
            description: 'API Calls in n8n',
            product_id: 'price_1RYXDSQqrelvc6fFdYjDno0Z',
            created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          },
          {
            id: 'mock-tx-3',
            user_id: user.id,
            stripe_payment_intent_id: 'pi_mock3',
            stripe_invoice_id: null,
            amount: 2000, // $20.00
            currency: 'usd',
            status: 'completed',
            description: 'Customer Support Workflow',
            product_id: 'price_1RYX9nQqrelvc6fFxrL4SRcY',
            created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, getToken, limit]);

  return {
    transactions,
    loading,
    error
  };
};