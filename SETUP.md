# Quick Setup Guide

## 🚨 URGENT: Replace Environment Variables

Your app is currently using placeholder values. You need to replace them with real keys:

### 1. Clerk Setup (Primary Authentication)
1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Create a new application or use existing one
3. Go to API Keys section
4. Copy your **Publishable Key** and **Secret Key**
5. Replace the values in `.env` file:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
   ```

### 2. Supabase Setup (Database & Edge Functions)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy your **Project URL** and **anon/public key**
5. Replace the values in `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 3. Stripe Setup (for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Secret Key** from API keys section
3. Set up webhooks and get **Webhook Secret**
4. Replace the values in `.env` file

### 4. Configure Clerk Authentication
In your Clerk dashboard:
1. Go to Configure > Paths
2. Set up your redirect URLs for development and production
3. Configure sign-in/sign-up settings
4. Enable email/password authentication

### 5. Configure Supabase for Clerk Integration
In your Supabase dashboard:
1. Go to Settings > API
2. Add your domain (localhost:3000 for development)
3. The Stripe checkout edge function is configured to work with Clerk tokens

## 🔧 Development
```bash
npm install
npm run dev
```

## 🚀 Deployment
See `DEPLOYMENT.md` for production deployment instructions.

## ⚠️ Important Notes
- Never commit real API keys to GitHub
- Use test keys for development
- Use live keys only for production
- Keep your `.env` file in `.gitignore`
- The app uses Clerk for authentication and Supabase for database/edge functions
- Stripe checkout is handled via Supabase edge functions with Clerk token verification