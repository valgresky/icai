import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Copy, Check, Wrench, ShoppingCart, Loader } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { formatCurrency } from '../../utils/helpers';
import WorkflowModal from './WorkflowModal';
import { useCart } from '../../contexts/CartContext';

interface WorkflowCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
  rating: number;
  downloads: number;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  tags: string[];
  code?: string;
  stripeProductId?: string;
}

const WorkflowCard = ({
  id,
  title,
  description,
  image,
  price,
  rating,
  downloads,
  category,
  author,
  createdAt,
  tags,
  code,
  stripeProductId,
}: WorkflowCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { dispatch } = useCart();
  const isFree = price === 0 || price === null;

  const handleCopy = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy workflow:', err);
      }
    }
  };

  const handleAddToCart = () => {
    if (!stripeProductId || isFree) return;
    
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id,
          title,
          price: price!,
          quantity: 1,
          priceId: stripeProductId,
          type: 'workflow',
          image
        }
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <>
      <motion.div
        className="glass-card overflow-hidden group"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="relative overflow-hidden aspect-[1.6/1]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            {category}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary w-full"
            >
              View Details
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start gap-2 mb-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-left hover:text-primary-400 transition-colors"
            >
              <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            </button>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <div>
              {isFree ? (
                <span className="text-accent-500 font-semibold">Free</span>
              ) : (
                <span className="text-white font-semibold">{formatCurrency(price!)}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-neutral-400">
                {downloads} copies
              </div>
              
              <div className="flex items-center gap-2">
                {!isFree && stripeProductId && (
                  <motion.button
                    className="btn p-2 rounded-full btn-primary group/purchase relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    title="Add to Cart"
                  >
                    {addedToCart ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                  </motion.button>
                )}

                <motion.button
                  className="btn p-2 rounded-full btn-primary group/install relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  title="Installation Service"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-secondary px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover/install:opacity-100 transition-opacity">
                    $50 USD Installation
                  </span>
                </motion.button>

                {code && (
                  <motion.button
                    className="btn p-2 rounded-full btn-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    title="Copy workflow JSON"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <WorkflowModal
        workflow={{
          id,
          title,
          description,
          image,
          price,
          rating,
          downloads,
          category,
          author,
          createdAt,
          tags,
          stripeProductId
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default WorkflowCard;