import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, Loader } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/helpers';
import { workflows } from '../data/mockData';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();
  const { getToken } = useAuth();
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/marketplace');
    }
  }, [state.items.length, navigate]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id, quantity: newQuantity } 
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate. Please sign in again.');
      }

      // Prepare checkout items with Stripe price IDs
      const checkoutItems = state.items.map(item => {
        const workflow = workflows.find(w => w.id === item.id);
        return {
          price_id: workflow?.stripeProductId || '',
          quantity: item.quantity
        };
      }).filter(item => item.price_id); // Remove items without price IDs

      if (checkoutItems.length === 0) {
        throw new Error('No valid items for checkout');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: checkoutItems,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout`,
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
        // Clear cart before redirecting
        dispatch({ type: 'CLEAR_CART' });
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/marketplace')}
              className="btn-ghost mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </button>
            <h1 className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary-500" />
              Checkout
            </h1>
            <p className="text-neutral-400 mt-2">
              Review your items and complete your purchase
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-panel p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Your Items</h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => {
                    const workflow = workflows.find(w => w.id === item.id);
                    if (!workflow) return null;

                    return (
                      <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={workflow.image}
                            alt={workflow.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg line-clamp-1">{workflow.title}</h3>
                          <p className="text-sm text-neutral-400 line-clamp-2">{workflow.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-primary-400 text-sm">{workflow.category}</span>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400 text-sm">{workflow.downloads} downloads</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-neutral-800 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-neutral-800 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.price)}</div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-neutral-400">
                                {formatCurrency(item.price * item.quantity)} total
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 hover:bg-neutral-800 rounded text-error-DEFAULT"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-panel p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>{formatCurrency(state.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-400">
                    <span>Processing Fee</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-neutral-800 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(state.total)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error-DEFAULT/10 border border-error-DEFAULT/20 rounded-lg">
                    <p className="text-error-DEFAULT text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || state.items.length === 0}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-neutral-500">
                    Secure payment powered by Stripe
                  </p>
                </div>

                {/* What's Included */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h3 className="font-medium mb-3">What's Included</h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li>• Complete n8n workflow files</li>
                    <li>• Detailed setup instructions</li>
                    <li>• API configuration guides</li>
                    <li>• 30 days of email support</li>
                    <li>• Lifetime updates</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;