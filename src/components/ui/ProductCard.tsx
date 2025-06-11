import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader, Check, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface ProductCardProps {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

const ProductCard = ({ priceId, name, description, mode, price }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      window.location.href = '/sign-in';
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Get Clerk session token
      const token = await user.getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate. Please try signing in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-panel p-6 h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold line-clamp-2">{name}</h3>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold">${price}</div>
            <div className="text-sm text-neutral-400">
              {mode === 'subscription' ? '/month' : 'one-time'}
            </div>
          </div>
        </div>
        
        <p className="text-neutral-300 mb-6 leading-relaxed line-clamp-4">{description}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-DEFAULT/10 border border-error-DEFAULT/20 rounded-lg">
          <div className="flex items-center gap-2 text-error-DEFAULT text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading || success}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : success ? (
          <>
            <Check className="w-5 h-5" />
            Purchased
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            {mode === 'subscription' ? 'Subscribe' : 'Purchase'}
          </>
        )}
      </button>
    </motion.div>
  );
};

export default ProductCard;