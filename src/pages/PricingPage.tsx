import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import { cn } from '../utils/helpers';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../stripe-config';
import { workflows } from '../data/mockData';

const PricingPage = () => {
  const [filter, setFilter] = useState<'all' | 'payment' | 'subscription'>('all');

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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
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

            {/* Filter Buttons */}
            <div className="inline-flex items-center gap-2 bg-background-secondary p-1 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'all' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter('payment')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'payment' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                One-time Purchase
              </button>
              <button
                onClick={() => setFilter('subscription')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === 'subscription' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-800'
                )}
              >
                Subscriptions
              </button>
            </div>
          </motion.div>
        </div>

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