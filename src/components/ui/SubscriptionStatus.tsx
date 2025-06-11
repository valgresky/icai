import { useEffect, useState } from 'react';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

// Map price IDs to plan names
const planNames: Record<string, string> = {
  'price_1RYXIaQqrelvc6fFsWaE3YTV': 'Workflow Club Monthly',
  'price_1RYXJ9Qqrelvc6fF5KWqwhKj': 'Workflow Club Yearly',
  'price_1RYXLEQqrelvc6fFzVCHcPgt': 'Custom Development',
};

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      const token = await user.getToken();
      
      if (!token) {
        setError('Unable to authenticate');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/stripe_user_subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data[0] || null);
      } else {
        console.error('Failed to fetch subscription:', response.status);
        setError('Failed to load subscription data');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Error loading subscription');
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

  if (error) {
    return (
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 text-error-DEFAULT">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Unable to load subscription</span>
        </div>
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
  const planName = subscription.price_id ? planNames[subscription.price_id] || 'Premium Plan' : 'Unknown Plan';
  
  return (
    <div className="glass-panel p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Crown className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-neutral-400'}`} />
          <div>
            <div className="font-medium text-sm">
              {planName}
            </div>
            <div className={`text-xs capitalize ${
              isActive ? 'text-success-DEFAULT' : 
              subscription.subscription_status === 'canceled' ? 'text-error-DEFAULT' :
              'text-warning-DEFAULT'
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