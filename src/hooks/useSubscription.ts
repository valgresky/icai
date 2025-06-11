import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = await getToken();
        
        if (!token) {
          throw new Error('Unable to authenticate');
        }
        
        // For demo purposes, create a mock subscription
        // In a real app, this would fetch from the database
        const mockSubscription = {
          id: 'mock-sub-id',
          user_id: user.id,
          stripe_subscription_id: 'sub_mock123',
          stripe_customer_id: 'cus_mock123',
          stripe_price_id: 'price_1RYXIaQqrelvc6fFsWaE3YTV',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          cancel_at: null,
          canceled_at: null,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          updated_at: new Date().toISOString()
        };
        
        setSubscription(mockSubscription);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, getToken]);

  // Function to cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !subscription) return false;
    
    try {
      // In a real app, this would call an API to cancel the subscription
      // For demo, we'll just update the local state
      setSubscription({
        ...subscription,
        status: 'canceled',
        canceled_at: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    subscription,
    loading,
    error,
    hasActiveSubscription: !!subscription,
    cancelSubscription
  };
};