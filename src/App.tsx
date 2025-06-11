import { Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './providers/ThemeProvider';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import DashboardPage from './pages/DashboardPage';
import CreatorPage from './pages/CreatorPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import BrowserAgentPage from './pages/BrowserAgentPage';
import NotFoundPage from './pages/NotFoundPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key - Please check your .env file');
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
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#0A0A0F',
          colorInputBackground: '#121218',
          colorInputText: '#FFFFFF',
          colorText: '#FFFFFF',
        },
        elements: {
          formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
          card: 'bg-background-secondary border border-neutral-700',
          headerTitle: 'text-white',
          headerSubtitle: 'text-neutral-300',
          socialButtonsBlockButton: 'border border-neutral-700 text-white hover:bg-neutral-800',
          formFieldLabel: 'text-neutral-300',
          formFieldInput: 'bg-neutral-800 border-neutral-700 text-white',
          footerActionLink: 'text-primary-400 hover:text-primary-300',
        }
      }}
    >
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/workflow/:id" element={<WorkflowDetailPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/browser-agent" element={<BrowserAgentPage />} />
                
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
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;