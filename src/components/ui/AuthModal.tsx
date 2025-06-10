import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithMagicLink(email);
      setSuccess(true);
      // Auto close after success
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show authenticated state
      }, 2000);
    } finally {
      setLoading(false);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold text-center">Welcome</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {success ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-success-DEFAULT mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Successfully signed in!</h3>
                  <p className="text-neutral-400 mb-4">
                    Welcome back, {email}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-neutral-400 mb-6 text-center">
                    Enter your email to sign in instantly with our demo account.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="glass-card w-full pl-10 pr-4 py-2"
                          placeholder="name@example.com"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-2 relative"
                    >
                      {loading ? (
                        <Loader className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;