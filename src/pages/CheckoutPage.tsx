import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CreditCard, Loader, AlertCircle, Check, Shield, Coins } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { formatCurrency } from '../utils/helpers';
import PointsRedemption from '../components/ui/PointsRedemption';
import PointsDisplay from '../components/ui/PointsDisplay';

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  
  // Calculate discount amount (100 points = $1)
  const discountAmount = Math.floor(pointsToRedeem / 100);
  const finalTotal = Math.max(0, state.total - discountAmount);

  useEffect(() => {
    // Redirect to marketplace if cart is empty
    if (state.items.length === 0) {
      navigate('/marketplace');
    }
  }, [state.items.length, navigate]);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    
    if (!user) {
      // Redirect to sign in if not authenticated
      navigate('/sign-in');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Get auth token
      const token = await getToken();
      
      if (!token) {
        throw new Error('Unable to authenticate. Please try signing in again.');
      }
      
      // Create line items from cart
      const lineItems = state.items.map(item => ({
        price_id: item.priceId,
        quantity: item.quantity
      }));
      
      // Call Stripe checkout
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: lineItems,
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

  const handlePointsChange = (points: number) => {
    setPointsToRedeem(points);
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id, quantity } 
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to shopping
            </button>
            <h1 className="text-3xl font-bold mt-2">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary-500" />
                  Your Cart ({state.items.length} {state.items.length === 1 ? 'item' : 'items'})
                </h2>

                {state.items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                    <p className="text-neutral-400">Your cart is empty</p>
                    <button 
                      onClick={() => navigate('/marketplace')}
                      className="btn-primary mt-4"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-neutral-800/30 rounded-lg"
                      >
                        {item.image && (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-neutral-400 hover:text-error-DEFAULT transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Points Redemption */}
              {state.items.length > 0 && (
                <PointsRedemption onPointsChange={handlePointsChange} />
              )}
            </div>

            {/* Order Summary - Right Column */}
            <div>
              <div className="glass-panel p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal</span>
                    <span>{formatCurrency(state.total)}</span>
                  </div>
                  
                  {pointsToRedeem > 0 && (
                    <div className="flex justify-between text-primary-400">
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Points Discount ({pointsToRedeem} pts)
                      </span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-neutral-800 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
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
                      Complete Purchase
                    </>
                  )}
                </button>

                <div className="mt-4 text-xs text-neutral-500 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>

              {/* Points Display */}
              <PointsDisplay />
              
              {/* Accepted Payment Methods */}
              <div className="glass-panel p-4 mt-6">
                <h3 className="text-sm font-medium mb-3 text-neutral-400">We Accept</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-xs font-medium">Visa</div>
                  <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-xs font-medium">MC</div>
                  <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-xs font-medium">Amex</div>
                  <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-xs font-medium">Disc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;