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
        
        // Fetch transactions
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        setTransactions(data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('transaction_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${user.id}`
      }, fetchTransactions)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, getToken, limit]);

  return {
    transactions,
    loading,
    error
  };
};