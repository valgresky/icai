import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader, Check, AlertCircle, Plus } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';

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
  const { dispatch, state } = useCart();
  
  // Check if product is already in cart
  const isInCart = state.items.some(item => item.priceId === priceId);

  const handleAddToCart = () => {
    try {
      setLoading(true);
      
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: priceId, // Use priceId as the unique identifier
          title: name,
          price: price,
          quantity: 1,
          priceId: priceId,
          type: 'product'
        }
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
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
            <div className="text-2xl font-bold">{formatCurrency(price)}</div>
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
        onClick={handleAddToCart}
        disabled={loading || success || isInCart}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : success || isInCart ? (
          <>
            <Check className="w-5 h-5" />
            {success ? "Added to Cart" : "In Cart"}
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </motion.div>
  );
};

export default ProductCard;