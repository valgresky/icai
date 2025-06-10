import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../stripe-config';

interface ProductCardProps extends Product {
  price: number;
}

const ProductCard = ({ priceId, name, description, mode, price }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if not authenticated
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
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
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold">${price}</div>
            <div className="text-sm text-neutral-400">
              {mode === 'subscription' ? '/month' : 'one-time'}
            </div>
          </div>
        </div>
        
        <p className="text-neutral-300 mb-6 leading-relaxed">{description}</p>
      </div>

      <button
        onClick={handlePurchase}
        disabled={loading || success}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
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