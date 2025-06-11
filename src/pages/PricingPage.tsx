import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../utils/helpers';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../stripe-config';
import { workflows } from '../data/mockData';

const PricingPage = () => {
  const [filter, setFilter] = useState<'all' | 'payment' | 'subscription'>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Create a mapping of price IDs to actual prices from workflows
  const workflowPricing: Record<string, number> = {};
  workflows.forEach(workflow => {
    if (workflow.stripeProductId && workflow.price !== null) {
      workflowPricing[workflow.stripeProductId] = workflow.price;
    }
  });

  // Fallback pricing for products not in workflows
  const fallbackPricing: Record<string, number> = {
    'price_1RYXLZQqrelvc6fFfuApb26b': 50,
    'price_1RYXLEQqrelvc6fFzVCHcPgt': 500,
    'price_1RYXKZQqrelvc6fFdhcLmm3M': 50,
    'price_1RYXJtQqrelvc6fFVYVxxLqo': 500,
    'price_1RYXJ9Qqrelvc6fF5KWqwhKj': 200,
    'price_1RYXIaQqrelvc6fFsWaE3YTV': 20,
    'price_1RYXH3Qqrelvc6fFwyWtZ4Dz': 35,
    'price_1RYXGfQqrelvc6fFVAoaAYA5': 35,
    'price_1RYXGIQqrelvc6fF8i751vc3': 35,
    'price_1RYXFtQqrelvc6fFbLlBOTGH': 30,
    'price_1RYXFNQqrelvc6fFcnD5bpU0': 30,
    'price_1RYXEwQqrelvc6fFcBwCyEIf': 30,
    'price_1RYXEaQqrelvc6fFEhiFUBjb': 30,
    'price_1RYXEBQqrelvc6fFJV4Wqsjw': 30,
    'price_1RYXDqQqrelvc6fFXD5N73Jp': 30,
    'price_1RYXDSQqrelvc6fFdYjDno0Z': 30,
    'price_1RYXCtQqrelvc6fFwFop8COe': 40,
    'price_1RYXCUQqrelvc6fFR2RVSwDn': 40,
    'price_1RYXC9Qqrelvc6fFS7dBHjGT': 40,
    'price_1RYXBnQqrelvc6fFAyFqbDoZ': 40,
    'price_1RYXBQQqrelvc6fFYVsVS6CO': 40,
    'price_1RYXAxQqrelvc6fFaK6vr5xH': 20,
    'price_1RYXAWQqrelvc6fFyXz0UYBN': 20,
    'price_1RYXAAQqrelvc6fFdHwBC023': 20,
    'price_1RYX9nQqrelvc6fFxrL4SRcY': 20,
    'price_1RYX9PQqrelvc6fFzP2IQv9x': 20,
    'price_1RYX8tQqrelvc6fF10usHmt1': 350,
    'price_1RYX8BQqrelvc6fFpmfVFUF0': 1500,
    'price_1RYX7lQqrelvc6fFiwaGIrjP': 80,
    'price_1RYX7IQqrelvc6fFrmdbl55h': 30,
    'price_1RYX6oQqrelvc6fFoiPWHD6c': 100,
    'price_1RYWzgQqrelvc6fFVONGQjBy': 50,
  };

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
    
    // Check if products have valid price IDs
    products.forEach(product => {
      if (!product.priceId || product.priceId.includes('price_XXXXX')) {
        issues.push(`Invalid priceId for ${product.name}: ${product.priceId}`);
      }
    });
    
    // Check workflow mapping
    const workflowProductIds = workflows.map(w => w.stripeProductId).filter(Boolean);
    const unmappedProducts = products.filter(product => 
      !workflowProductIds.includes(product.priceId) && 
      !fallbackPricing[product.priceId]
    );
    
    unmappedProducts.forEach(product => {
      issues.push(`No price mapping for product: ${product.name} (${product.priceId})`);
    });
    
    return issues;
  };

  // Debug logging and data exposure
  useEffect(() => {
    console.log('=== PRICING PAGE DEBUG ===');
    console.log('Raw products from stripe-config:', products);
    console.log('Raw workflows from mockData:', workflows);
    console.log('Filtered products:', filteredProducts);
    console.log('Number of products to display:', filteredProducts.length);
    console.log('Workflow pricing mapping:', workflowPricing);
    console.log('Fallback pricing mapping:', fallbackPricing);

    // Log each product's details
    filteredProducts.forEach((product, index) => {
      const price = workflowPricing[product.priceId] || fallbackPricing[product.priceId] || 0;
      console.log(`Product ${index + 1}:`, {
        name: product.name,
        priceId: product.priceId,
        mode: product.mode,
        price: price,
        hasWorkflowMapping: !!workflowPricing[product.priceId],
        hasFallbackMapping: !!fallbackPricing[product.priceId]
      });
    });

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
      workflows,
      filteredProducts,
      workflowPricing,
      fallbackPricing,
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
                <div>Workflows: {debugInfo.workflows?.length || 0}</div>
                <div>Filtered Products: {debugInfo.filteredProducts?.length || 0}</div>
                <div>Workflow Mappings: {Object.keys(debugInfo.workflowPricing || {}).length}</div>
                <div>Fallback Mappings: {Object.keys(debugInfo.fallbackPricing || {}).length}</div>
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
                    price: debugInfo.workflowPricing?.[debugInfo.filteredProducts[0].priceId] || 
                           debugInfo.fallbackPricing?.[debugInfo.filteredProducts[0].priceId] || 0
                  }, null, 2)}
                </pre>
              )}
            </div>
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

            {/* Filter Buttons - Fixed with proper IDs */}
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
            >
              <ProductCard
                {...product}
                price={workflowPricing[product.priceId] || fallbackPricing[product.priceId] || 0}
              />
            </motion.div>
          ))}
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