import { Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import DashboardPage from './pages/DashboardPage';
import CreatorPage from './pages/CreatorPage';
import PricingPage from './pages/PricingPage';
import SuccessPage from './pages/SuccessPage';
import NotFoundPage from './pages/NotFoundPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// If Clerk is not configured, show a setup message
if (!clerkPubKey || clerkPubKey === 'pk_test_your_key_here' || clerkPubKey === 'pk_live_your_key_here') {
  console.warn('Clerk not configured. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.');
}

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

// Fallback component when Clerk is not configured
const SetupRequired = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Setup Required</h1>
      <p className="text-neutral-300 mb-6">
        Please configure your Clerk authentication keys to continue.
      </p>
      <div className="bg-neutral-800 p-4 rounded-lg text-left text-sm">
        <p className="text-neutral-400 mb-2">Add to your .env file:</p>
        <code className="text-green-400">
          VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
        </code>
      </div>
    </div>
  </div>
);

function App() {
  // If Clerk is not properly configured, show setup screen
  if (!clerkPubKey || clerkPubKey === 'pk_test_your_key_here' || clerkPubKey === 'pk_live_your_key_here') {
    return <SetupRequired />;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/workflow/:id" element={<WorkflowDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/success" element={<SuccessPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator" 
                element={
                  <ProtectedRoute>
                    <CreatorPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;