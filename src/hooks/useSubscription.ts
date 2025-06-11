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
        
        // Fetch active subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
        
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('subscription_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${user.id}`
      }, fetchSubscription)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, getToken]);

  // Function to cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !subscription) return false;
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate');
      }
      
      // Call Supabase Edge Function to cancel subscription
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.stripe_subscription_id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }
      
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