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

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
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

function App() {
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