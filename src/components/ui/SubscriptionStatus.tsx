import { useEffect, useState } from 'react';
import { Crown, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data || null);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-4 animate-pulse">
        <div className="h-4 bg-neutral-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-neutral-700 rounded w-1/3"></div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 text-neutral-400">
          <Crown className="w-4 h-4" />
          <span className="text-sm">No active subscription</span>
        </div>
      </div>
    );
  }

  const isActive = ['active', 'trialing'].includes(subscription.subscription_status);
  
  return (
    <div className="glass-panel p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Crown className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-neutral-400'}`} />
          <div>
            <div className="font-medium text-sm">
              Subscription
            </div>
            <div className={`text-xs capitalize ${
              isActive ? 'text-success-DEFAULT' : 'text-warning-DEFAULT'
            }`}>
              {subscription.subscription_status.replace('_', ' ')}
            </div>
          </div>
        </div>
        
        {subscription.current_period_end && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Calendar className="w-3 h-3" />
              <span>
                {subscription.cancel_at_period_end ? 'Ends' : 'Renews'} {' '}
                {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </span>
            </div>
            {subscription.payment_method_brand && subscription.payment_method_last4 && (
              <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                <CreditCard className="w-3 h-3" />
                <span>
                  {subscription.payment_method_brand} ****{subscription.payment_method_last4}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;