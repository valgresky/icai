import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { workflows } from '../../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { state, dispatch } = useCart();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  {state.items.length > 0 && (
                    <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                  <p className="text-neutral-400 mb-4">Your cart is empty</p>
                  <Link
                    to="/marketplace"
                    onClick={onClose}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Browse Workflows
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => {
                    // Find workflow details if it's a workflow
                    const workflow = item.type === 'workflow' ? 
                      workflows.find(w => w.id === item.id) : null;
                    
                    return (
                      <div
                        key={item.id}
                        className="glass-card p-4"
                      >
                        <div className="flex items-start gap-3">
                          {item.image && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={item.image || (workflow ? workflow.image : '')}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                            {workflow && (
                              <p className="text-xs text-neutral-400 mt-1">{workflow.category}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-semibold text-sm">{formatCurrency(item.price)}</span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 hover:bg-neutral-800 rounded text-error-DEFAULT"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-neutral-800 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-neutral-800 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {item.quantity > 1 && (
                            <span className="text-xs text-neutral-400">
                              {formatCurrency(item.price * item.quantity)} total
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="p-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">{formatCurrency(state.total)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Checkout
                </Link>
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Secure payment with Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;