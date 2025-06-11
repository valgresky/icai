import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, Loader, Coins, ArrowDown, ArrowUp } from 'lucide-react';
import { useUser, useAuth, SignInButton } from '@clerk/clerk-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/helpers';
import { workflows } from '../data/mockData';
import { usePoints } from '../hooks/usePoints';
import PointsRedemption from '../components/ui/PointsRedemption';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { state, dispatch } = useCart();
  const { points } = usePoints();
  const navigate = useNavigate();

  // Calculate discount amount from points (100 points = $1)
  const discountAmount = Math.floor(pointsToRedeem / 100);
  const finalTotal = Math.max(0, state.total - discountAmount);

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

  const handlePointsChange = (points: number) => {
    setPointsToRedeem(points);
  };

  const handleCheckout = async () => {
    if (!user) {
      return; // The sign-in button will be shown instead
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate. Please sign in again.');
      }

      // Prepare checkout items
      const checkoutItems = state.items.map(item => ({
        price_id: item.priceId || '',
        quantity: item.quantity
      })).filter(item => item.price_id); // Remove items without price IDs

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
          points_to_redeem: pointsToRedeem,
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
              onClick={() => navigate(-1)}
              className="btn-ghost mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
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
                    // Find workflow details if it's a workflow
                    const workflow = item.type === 'workflow' ? 
                      workflows.find(w => w.id === item.id) : null;
                    
                    return (
                      <div key={item.id} className="glass-card p-4 flex flex-col sm:flex-row items-start gap-4">
                        {/* Image - Only show if available */}
                        {(item.image || (workflow && workflow.image)) && (
                          <div className="w-full sm:w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.image || (workflow ? workflow.image : '')}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Item details */}
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="font-medium text-lg line-clamp-1">{item.title}</h3>
                          {workflow && (
                            <p className="text-sm text-neutral-400 line-clamp-2">{workflow.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {workflow && (
                              <>
                                <span className="text-primary-400 text-sm">{workflow.category}</span>
                                <span className="text-neutral-600">•</span>
                              </>
                            )}
                            <span className="text-neutral-400 text-sm">
                              {item.type === 'workflow' ? `${workflow?.downloads || 0} downloads` : ''}
                            </span>
                          </div>
                        </div>
                        
                        {/* Price and quantity controls */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
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
                  
                  {pointsToRedeem > 0 && (
                    <div className="flex justify-between text-primary-400">
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Points Discount
                      </span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-neutral-400">
                    <span>Processing Fee</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="border-t border-neutral-800 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Points Redemption */}
                {user && points && points.available_points >= 100 && (
                  <div className="glass-panel p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary-500" />
                        Use Your Points
                      </h3>
                      <span className="text-sm text-neutral-400">
                        {points.available_points} available
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm text-neutral-400 mb-2">
                        Points to redeem (in increments of 100)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={points.available_points}
                        step="100"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-neutral-500 mt-1">
                        <span>0</span>
                        <span>{points.available_points}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-neutral-400">Points selected:</div>
                      <div className="font-medium">{pointsToRedeem}</div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-neutral-400">Discount value:</div>
                      <div className="font-bold text-primary-500">${(pointsToRedeem / 100).toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-error-DEFAULT/10 border border-error-DEFAULT/20 rounded-lg">
                    <p className="text-error-DEFAULT text-sm">{error}</p>
                  </div>
                )}

                {user ? (
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
                ) : (
                  <SignInButton mode="modal">
                    <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Sign In to Checkout
                    </button>
                  </SignInButton>
                )}

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