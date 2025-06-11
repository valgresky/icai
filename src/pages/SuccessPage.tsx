import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, ArrowRight, Crown, Package } from 'lucide-react';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [purchaseInfo, setPurchaseInfo] = useState<{
    type: 'subscription' | 'payment';
    productName: string;
  } | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // In a real implementation, you might fetch the session details from Stripe
      // For now, we'll show a generic success message
      setPurchaseInfo({
        type: 'payment', // This would be determined from the actual session
        productName: 'Your Purchase'
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glass-panel p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-success-DEFAULT/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-success-DEFAULT" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            
            <p className="text-xl text-neutral-300 mb-8">
              Thank you for your purchase. Your workflow is now available in your dashboard.
            </p>

            <div className="space-y-4 mb-8">
              <div className="glass-card p-6 text-left">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-400" />
                  What's Next?
                </h3>
                <ul className="space-y-3 text-neutral-300">
                  <li className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Access Your Purchase</div>
                      <div className="text-sm text-neutral-400">
                        Find your workflows and downloads in your dashboard
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-DEFAULT mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Setup Instructions</div>
                      <div className="text-sm text-neutral-400">
                        Follow the detailed setup guide included with your purchase
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Start Automating</div>
                      <div className="text-sm text-neutral-400">
                        Import the workflow into your n8n instance and begin automating
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-secondary-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Get Support</div>
                      <div className="text-sm text-neutral-400">
                        Access our support team for 30 days with any questions
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Email Confirmation Notice */}
              <div className="glass-card p-4 bg-primary-500/10 border border-primary-500/20">
                <p className="text-sm text-primary-300">
                  📧 A confirmation email with download links and setup instructions has been sent to your email address.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary px-8 py-3 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Go to Dashboard
              </Link>
              <Link to="/marketplace" className="btn-ghost px-8 py-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Browse More Workflows
              </Link>
              <Link to="/" className="btn-ghost px-8 py-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-neutral-800">
              <p className="text-sm text-neutral-400 mb-3">
                Need help getting started?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <a href="mailto:support@inner-circle-ai.com" className="text-primary-400 hover:text-primary-300">
                  Contact Support
                </a>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <a href="/docs" className="text-primary-400 hover:text-primary-300">
                  View Documentation
                </a>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <a href="/community" className="text-primary-400 hover:text-primary-300">
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;