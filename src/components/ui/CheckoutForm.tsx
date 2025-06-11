import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader, Check, AlertCircle, Coins } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { usePoints } from '../../hooks/usePoints';
import PointsRedemption from './PointsRedemption';
import { formatCurrency } from '../../utils/helpers';

interface CheckoutFormProps {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CheckoutForm = ({ 
  priceId, 
  name, 
  description, 
  mode, 
  price, 
  onSuccess, 
  onError 
}: CheckoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { points } = usePoints();

  // Calculate discount amount
  const discountAmount = Math.floor(pointsToRedeem / 100);
  const finalPrice = Math.max(0, price - discountAmount);

  const handlePurchase = async () => {
    console.log('=== CHECKOUT ATTEMPT ===');
    console.log('Price ID:', priceId);
    console.log('User:', user);
    console.log('Points to redeem:', pointsToRedeem);
    
    if (!user) {
      const errorMsg = 'You must be signed in to make a purchase';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Getting Clerk session token...');
      
      // Use the getToken from useAuth hook
      const token = await getToken();
      
      console.log('Token obtained:', token ? 'Yes' : 'No');
      
      if (!token) {
        throw new Error('Unable to authenticate. Please try signing in again.');
      }

      console.log('Creating checkout session...');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          points_to_redeem: pointsToRedeem,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout response data:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        setSuccess(true);
        onSuccess?.();
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received:', data);
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Full checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePointsChange = (points: number) => {
    setPointsToRedeem(points);
  };

  return (
    <div className="space-y-6">
      {/* Product Details */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-neutral-400 mb-4">{description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-300">Original Price:</span>
          <span className="font-medium">{formatCurrency(price)}</span>
        </div>
        
        {pointsToRedeem > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-300 flex items-center gap-1">
              <Coins className="w-4 h-4 text-primary-400" />
              Points Discount:
            </span>
            <span className="font-medium text-primary-400">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 mt-2">
          <span className="text-lg">Total:</span>
          <span className="text-xl font-bold">{formatCurrency(finalPrice)}</span>
        </div>
        
        {mode === 'subscription' && (
          <p className="text-sm text-neutral-500 mt-2">
            Billed {mode === 'subscription' ? 'monthly' : 'once'}
          </p>
        )}
      </div>
      
      {/* Points Redemption */}
      {points && points.available_points >= 100 && mode === 'payment' && (
        <PointsRedemption onPointsChange={handlePointsChange} />
      )}
      
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-error-DEFAULT/10 border border-error-DEFAULT/20 rounded-lg">
          <div className="flex items-center gap-2 text-error-DEFAULT text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Checkout Button */}
      <motion.button
        onClick={handlePurchase}
        disabled={loading || success}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : success ? (
          <>
            <Check className="w-5 h-5" />
            Redirecting to Checkout...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            {mode === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
          </>
        )}
      </motion.button>
      
      {/* Terms & Conditions */}
      <p className="text-xs text-neutral-500 text-center">
        By proceeding with this purchase, you agree to our 
        <a href="/terms" className="text-primary-400 hover:text-primary-300 mx-1">Terms of Service</a>
        and
        <a href="/privacy" className="text-primary-400 hover:text-primary-300 ml-1">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default CheckoutForm;