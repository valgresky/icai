import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [productName, setProductName] = useState('');
  
  useEffect(() => {
    // You could fetch the product details based on session_id if needed
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // For now, we'll just show a generic success message
      setProductName('Your Purchase');
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
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary-400" />
                    Access your workflow in the dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-DEFAULT" />
                    Follow the setup instructions
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-accent-500" />
                    Start automating your processes
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary px-8 py-3">
                Go to Dashboard
              </Link>
              <Link to="/" className="btn-ghost px-8 py-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;