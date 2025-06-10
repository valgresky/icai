import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Download, Tag, User, Calendar, ShoppingCart, Loader } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

interface WorkflowModalProps {
  workflow: {
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
    stripeProductId?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const WorkflowModal = ({ workflow, isOpen, onClose }: WorkflowModalProps) => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { user } = useUser();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePurchase = async () => {
    if (!workflow.stripeProductId) {
      alert('This workflow is not available for purchase yet.');
      return;
    }

    if (!user) {
      // Trigger Clerk sign-in modal
      const signInButton = document.querySelector('[data-clerk-sign-in]') as HTMLButtonElement;
      signInButton?.click();
      return;
    }

    setPurchaseLoading(true);
    
    try {
      // Get Clerk session token
      const token = await user.getToken();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          price_id: workflow.stripeProductId,
          mode: 'payment',
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/workflow/${workflow.id}`,
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
      setPurchaseLoading(false);
    }
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-8"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90vw] max-w-4xl bg-background rounded-xl shadow-2xl z-50 relative mx-auto"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-800 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header section */}
              <div className="relative h-64 bg-neutral-900">
                <img
                  src={workflow.image}
                  alt={workflow.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{workflow.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-neutral-300">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{workflow.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{workflow.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {workflow.price === null ? (
                        <span className="text-accent-500 font-semibold text-xl">Free</span>
                      ) : (
                        <span className="text-white font-semibold text-xl">{formatCurrency(workflow.price)}</span>
                      )}
                      {workflow.stripeProductId && workflow.price !== null && (
                        <button
                          onClick={handlePurchase}
                          disabled={purchaseLoading}
                          className="btn-primary mt-2 flex items-center gap-2"
                        >
                          {purchaseLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Purchase Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)]">
                <div className="p-6">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={workflow.author.avatar}
                      alt={workflow.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-400" />
                        <span>{workflow.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(workflow.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-300 mb-6">{workflow.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {workflow.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-neutral-800 px-3 py-1 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* Installation Service */}
                  <div className="glass-panel p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Professional Installation Service</h3>
                    <p className="text-neutral-300 mb-4">
                      Let our experts handle the installation and configuration of this workflow for you. Our service includes:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-300">
                      <li>Complete workflow setup in your n8n instance</li>
                      <li>Configuration of all required credentials</li>
                      <li>Testing and validation of all workflow components</li>
                      <li>30-minute consultation for customization needs</li>
                      <li>2 weeks of post-installation support</li>
                    </ul>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">$50 USD</div>
                      <button className="btn-primary">Book Installation</button>
                    </div>
                  </div>

                  {/* Documentation */}
                  <div className="prose text-neutral-300 max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Self-Installation Guide</h3>
                    <div className="glass-card p-4 mb-6">
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Download or copy the workflow JSON</li>
                        <li>Open your n8n instance</li>
                        <li>Go to Workflows → Import from file/clipboard</li>
                        <li>Paste or select the workflow JSON</li>
                        <li>Configure any required credentials</li>
                        <li>Activate the workflow</li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      <li>Seamless integration with popular services</li>
                      <li>Custom triggers for real-time automation</li>
                      <li>Advanced data transformation capabilities</li>
                      <li>Error handling and notification system</li>
                      <li>Detailed logging and monitoring</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      <li>n8n version 0.214.0 or higher</li>
                      <li>API credentials for connected services</li>
                      <li>Basic understanding of workflow automation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WorkflowModal;