import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../utils/helpers';
import ProductCard from '../components/ui/ProductCard';
import CheckoutForm from '../components/ui/CheckoutForm';
import PointsDisplay from '../components/ui/PointsDisplay';
import { useUser } from '@clerk/clerk-react';

// Define product interface
interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

// Define products directly in the component
const products: Product[] = [
  // Individual Workflows - $20-$40
  {
    priceId: 'price_1RYX9PQqrelvc6fFzP2IQv9x',
    name: 'RAG Pipeline & Chatbot',
    description: 'Build a document-based Q&A system that can understand and answer questions from your uploaded documents. Perfect for creating knowledge bases, FAQ bots, and intelligent document search systems.',
    mode: 'payment',
    price: 20
  },
  {
    priceId: 'price_1RYX9nQqrelvc6fFxrL4SRcY',
    name: 'Customer Support Workflow',
    description: 'Automate your email support with intelligent classification and auto-response capabilities. Routes emails to the right department and drafts contextual responses using AI.',
    mode: 'payment',
    price: 20
  },
  {
    priceId: 'price_1RYXAAQqrelvc6fFdHwBC023',
    name: 'LinkedIn Content Creator',
    description: 'Generate engaging LinkedIn posts automatically by researching topics and creating professional content. Includes hashtag optimization and content scheduling capabilities.',
    mode: 'payment',
    price: 20
  },
  {
    priceId: 'price_1RYXAWQqrelvc6fFyXz0UYBN',
    name: 'Invoice Workflow',
    description: 'Extract data from PDF invoices and automatically populate Google Sheets. Includes email notifications and database updates for seamless invoice processing.',
    mode: 'payment',
    price: 20
  },
  {
    priceId: 'price_1RYXAxQqrelvc6fFaK6vr5xH',
    name: 'First AI Agent',
    description: 'Your introduction to AI agents with basic email, calendar, and contact management tools. Perfect for beginners looking to build their first autonomous assistant.',
    mode: 'payment',
    price: 20
  },
  // Subscription Products
  {
    priceId: 'price_1RYXIaQqrelvc6fFsWaE3YTV',
    name: 'Workflow Club Membership',
    description: 'Access all current workflows with new templates added monthly. Includes priority support, community access, and instant notifications when new workflows are released.',
    mode: 'subscription',
    price: 20
  },
  {
    priceId: 'price_1RYXJ9Qqrelvc6fF5KWqwhKj',
    name: 'Workflow Club Membership (Yearly)',
    description: 'Access all current workflows with new templates added monthly. Includes priority support, community access, and instant notifications when new workflows are released. Annual members save over 12% compared to monthly billing.',
    mode: 'subscription',
    price: 200
  },
  // Service Products
  {
    priceId: 'price_1RYXKZQqrelvc6fFdhcLmm3M',
    name: 'Workflow Installation',
    description: 'Complete hands-on setup of any workflow in your n8n instance. Includes API credential configuration, thorough testing and troubleshooting, and a 30-minute training call to ensure you understand how to use and modify the workflow.',
    mode: 'payment',
    price: 50
  },
  {
    priceId: 'price_1RYXLEQqrelvc6fFzVCHcPgt',
    name: 'Custom Workflow Development',
    description: 'Get a workflow built specifically for your unique requirements. Includes requirements gathering session, custom workflow design and architecture, full implementation and testing, comprehensive documentation, and 30 days of post-delivery support.',
    mode: 'payment',
    price: 500
  }
];

const PricingPage = () => {
  const [filter, setFilter] = useState<'all' | 'payment' | 'subscription'>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useUser();

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.mode === filter;
  });

  // Validation function
  const validateStripeConfig = () => {
    const issues = [];
    
    // Check if Clerk key exists (since we're using Clerk for auth)
    if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
      issues.push('Missing VITE_CLERK_PUBLISHABLE_KEY');
    }
    
    // Check if Supabase keys exist
    if (!import.meta.env.VITE_SUPABASE_URL) {
      issues.push('Missing VITE_SUPABASE_URL');
    }
    
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      issues.push('Missing VITE_SUPABASE_ANON_KEY');
    }
    
    return issues;
  };

  // Debug logging and data exposure
  useEffect(() => {
    console.log('=== PRICING PAGE DEBUG ===');
    console.log('Filtered products:', filteredProducts);
    console.log('Number of products to display:', filteredProducts.length);

    // Environment check
    console.log('Environment check:', {
      NODE_ENV: import.meta.env.MODE,
      hasClerkKey: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      clerkKeyPreview: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 7) + '...',
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });

    // Validation
    const validationIssues = validateStripeConfig();
    if (validationIssues.length > 0) {
      console.error('❌ Stripe Configuration Issues:', validationIssues);
    } else {
      console.log('✅ Stripe configuration looks good');
    }

    // Make data available in console for debugging
    const debugData = {
      products,
      filteredProducts,
      validationIssues,
      environment: {
        mode: import.meta.env.MODE,
        hasClerkKey: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    };

    setDebugInfo(debugData);
    (window as any).debugPricing = debugData;
    console.log('Debug data available at window.debugPricing');
  }, [filteredProducts]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Debug Toggle Button (only in development) */}
        {import.meta.env.DEV && (
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-50 flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            {showDebug ? 'Hide' : 'Show'} Debug
          </button>
        )}

        {/* Debug Panel */}
        {showDebug && (
          <div className="fixed bottom-20 right-4 bg-black text-white p-4 rounded max-w-md max-h-96 overflow-auto z-50 border border-gray-600">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Stripe Debug Info
            </h3>
            
            {/* Environment Status */}
            <div className="mb-4">
              <h4 className="font-semibold text-green-400 mb-1">Environment:</h4>
              <div className="text-xs space-y-1">
                <div className={debugInfo.environment?.hasClerkKey ? 'text-green-400' : 'text-red-400'}>
                  Clerk Key: {debugInfo.environment?.hasClerkKey ? '✓' : '✗'}
                </div>
                <div className={debugInfo.environment?.hasSupabaseUrl ? 'text-green-400' : 'text-red-400'}>
                  Supabase URL: {debugInfo.environment?.hasSupabaseUrl ? '✓' : '✗'}
                </div>
                <div className={debugInfo.environment?.hasSupabaseKey ? 'text-green-400' : 'text-red-400'}>
                  Supabase Key: {debugInfo.environment?.hasSupabaseKey ? '✓' : '✗'}
                </div>
              </div>
            </div>

            {/* Data Counts */}
            <div className="mb-4">
              <h4 className="font-semibold text-blue-400 mb-1">Data Counts:</h4>
              <div className="text-xs space-y-1">
                <div>Products: {debugInfo.products?.length || 0}</div>
                <div>Filtered Products: {debugInfo.filteredProducts?.length || 0}</div>
              </div>
            </div>

            {/* Validation Issues */}
            {debugInfo.validationIssues?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-400 mb-1">Issues Found:</h4>
                <div className="text-xs space-y-1">
                  {debugInfo.validationIssues.map((issue: string, index: number) => (
                    <div key={index} className="text-red-300">• {issue}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Product Data */}
            <div>
              <h4 className="font-semibold text-purple-400 mb-1">Sample Product:</h4>
              {debugInfo.filteredProducts?.[0] && (
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({
                    name: debugInfo.filteredProducts[0].name,
                    priceId: debugInfo.filteredProducts[0].priceId,
                    mode: debugInfo.filteredProducts[0].mode,
                    price: debugInfo.filteredProducts[0].price
                  }, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Complete Purchase</h2>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-neutral-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {user ? (
                  <CheckoutForm 
                    priceId={selectedProduct.priceId}
                    name={selectedProduct.name}
                    description={selectedProduct.description}
                    mode={selectedProduct.mode}
                    price={selectedProduct.price}
                    onSuccess={() => {
                      // Handle success (redirect happens in the component)
                    }}
                    onError={(error) => {
                      console.error('Checkout error:', error);
                    }}
                  />
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="w-16 h-16 text-warning-DEFAULT mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                    <p className="text-neutral-400 mb-6">
                      Please sign in to complete your purchase
                    </p>
                    <button className="btn-primary">
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4">Workflow Marketplace</h1>
            <p className="text-xl text-neutral-400 mb-8">
              Choose from our collection of premium n8n workflows and services. All purchases include comprehensive documentation and support.
            </p>

            {/* Points Display for Logged In Users */}
            {user && (
              <div className="mb-8">
                <PointsDisplay showDetails={true} className="max-w-md mx-auto" />
              </div>
            )}

            {/* Filter Buttons */}
            <div className="inline-flex items-center gap-2 bg-background-secondary p-1 rounded-lg">
              <button
                id="filter-all"
                name="filter-all"
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'all' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                All Products ({products.length})
              </button>
              <button
                id="filter-payment"
                name="filter-payment"
                onClick={() => setFilter('payment')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'payment' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                One-time Purchase ({products.filter(p => p.mode === 'payment').length})
              </button>
              <button
                id="filter-subscription"
                name="filter-subscription"
                onClick={() => setFilter('subscription')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'subscription' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                Subscriptions ({products.filter(p => p.mode === 'subscription').length})
              </button>
            </div>
          </motion.div>
        </div>

        {/* Debug Alert for Missing Products */}
        {import.meta.env.DEV && filteredProducts.length === 0 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">No Products Found</h3>
              </div>
              <p className="text-red-300 text-sm mb-3">
                No products are being displayed. This could be due to:
              </p>
              <ul className="text-red-300 text-sm space-y-1 ml-4">
                <li>• Empty products array in stripe-config.ts</li>
                <li>• Filter removing all products</li>
                <li>• Missing price mappings</li>
              </ul>
              <button
                onClick={() => setShowDebug(true)}
                className="mt-3 text-red-400 underline text-sm"
              >
                Show Debug Panel
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.priceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer"
            >
              <ProductCard
                {...product}
              />
            </motion.div>
          ))}
        </div>

        {/* Points Explainer Section */}
        <div className="max-w-3xl mx-auto mt-16 mb-8">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-500" />
              Earn and Redeem Points
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Earn 100 Points for Every $1 Spent</h3>
                  <p className="text-neutral-400 text-sm">
                    Every purchase automatically earns you points that you can use for future discounts.
                    Points are awarded immediately after your purchase is completed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-success-DEFAULT/20 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-success-DEFAULT" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Redeem Points for Discounts</h3>
                  <p className="text-neutral-400 text-sm">
                    Use your points during checkout to get discounts on your purchases.
                    Every 100 points equals $1 off your order.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Points Never Expire</h3>
                  <p className="text-neutral-400 text-sm">
                    Your points will never expire, so you can save them up for bigger discounts on future purchases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "What's included with each workflow?",
                a: "Each workflow includes the complete n8n JSON file, detailed setup instructions, API configuration guides, and email support for 30 days."
              },
              {
                q: "Do I need any specific n8n version?",
                a: "Most workflows are compatible with n8n version 0.214.0 and higher. Specific requirements are listed in each workflow's documentation."
              },
              {
                q: "Can I modify the workflows?",
                a: "Yes! All workflows are fully customizable. We provide the source code and documentation to help you adapt them to your specific needs."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. All payments are secure and encrypted."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact our support team for a full refund."
              },
              {
                q: "How do I earn and redeem points?",
                a: "You automatically earn 100 points for every $1 spent on our platform. Points can be redeemed during checkout for discounts on future purchases, with 100 points equal to $1 off."
              }
            ].map(({ q, a }) => (
              <div key={q} className="glass-panel p-6">
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-neutral-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;