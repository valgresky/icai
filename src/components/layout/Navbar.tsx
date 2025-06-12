import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Workflow, Search, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignUpButton, UserButton, useUser, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { cn } from '../../utils/helpers';
import { useTheme } from '../../providers/ThemeProvider';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../ui/CartDrawer';
import SubscriptionStatus from '../ui/SubscriptionStatus';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const { state } = useCart();
  const clerk = useClerk();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/browser-agent', label: 'Browser Agent' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/creator', label: 'Creator Portal' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Debug logging for Clerk state
  useEffect(() => {
    console.log('Clerk Debug Info:', {
      isLoaded,
      user: user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress } : null,
      clerkLoaded: !!clerk,
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing'
    });
  }, [isLoaded, user, clerk]);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-neutral-800 py-2' : 'py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Workflow className="h-8 w-8 text-primary-500" />
          <span className="font-display font-bold text-xl">Inner Circle AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-400',
                location.pathname === link.href ? 'text-primary-500' : 'text-neutral-300'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          <button className="btn-ghost rounded-full p-2">
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="btn-ghost rounded-full p-2 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {state.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </button>
          
          {/* Clerk Authentication */}
          {!isLoaded ? (
            <div className="w-8 h-8 bg-neutral-800 rounded-full animate-pulse" />
          ) : (
            <>
              <SignedIn>
                <SubscriptionStatus />
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-background-secondary border border-neutral-700",
                      userButtonPopoverActionButton: "text-neutral-300 hover:bg-neutral-800",
                      userButtonPopoverActionButtonText: "text-neutral-300",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </SignedIn>
              
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton 
                    mode="modal" 
                    fallbackRedirectUrl="/" 
                    signUpFallbackRedirectUrl="/"
                  >
                    <button className="btn-ghost flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton 
                    mode="modal" 
                    fallbackRedirectUrl="/" 
                    signInFallbackRedirectUrl="/"
                  >
                    <button className="btn-primary flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-300 hover:bg-neutral-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-neutral-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <span className="text-sm text-neutral-500">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'py-2 px-4 rounded-lg transition-colors',
                    location.pathname === link.href 
                      ? 'bg-primary-500/10 text-primary-500' 
                      : 'text-neutral-300 hover:bg-neutral-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-800"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({state.items.length})</span>
              </button>
              
              {!isLoaded ? (
                <div className="px-4 py-2">Loading...</div>
              ) : (
                <>
                  <SignedIn>
                    <div className="space-y-2">
                      <SubscriptionStatus />
                      <div className="flex justify-center">
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "w-10 h-10"
                            }
                          }}
                          afterSignOutUrl="/"
                        />
                      </div>
                    </div>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="space-y-2">
                      <SignInButton mode="modal" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/">
                        <button className="btn-ghost w-full justify-center">
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal" fallbackRedirectUrl="/" signInFallbackRedirectUrl="/">
                        <button className="btn-primary w-full justify-center">
                          <User className="w-4 h-4 mr-2" />
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;