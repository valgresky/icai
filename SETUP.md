# Quick Setup Guide

## 🚨 URGENT: Replace Environment Variables

Your app is currently using placeholder values. You need to replace them with real keys:

### 1. Clerk Setup (Primary Authentication) ✅ DONE
From your Clerk dashboard, I can see you have:
- **Publishable Key**: `pk_live_Y2xlcmsuaW5uZXItY2lyY2xlLWFpLmNvbSQ` ✅
- **Frontend API URL**: `https://clerk.inner-circle-ai.com` ✅
- **Backend API URL**: `https://api.clerk.com` ✅

You still need to add your **Secret Key** to the `.env` file:
```
CLERK_SECRET_KEY=sk_live_your_secret_key_here
```

### 2. Configure Clerk Domain Settings
In your Clerk dashboard:
1. Go to **Configure > Domains**
2. Add your domains:
   - `localhost:3000` (for development)
   - Your production domain (e.g., `your-app.netlify.app`)
3. Go to **Configure > Paths**
4. Set up redirect URLs:
   - Sign-in URL: `/`
   - Sign-up URL: `/`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

### 3. Supabase Setup (Database & Edge Functions)
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

### 4. Stripe Setup (for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Secret Key** from API keys section
3. Set up webhooks and get **Webhook Secret**
4. Replace the values in `.env` file

### 5. Update Supabase Edge Functions for Clerk
The Stripe checkout edge function needs to be updated to work with Clerk tokens instead of Supabase auth. This is already configured in the codebase.

## 🔧 Development
```bash
npm install
npm run dev
```

## 🚀 Deployment
See `DEPLOYMENT.md` for production deployment instructions.

## ⚠️ Important Notes
- Your Clerk publishable key is already configured ✅
- You need to add your Clerk secret key to complete the setup
- Configure your domains in Clerk dashboard
- The app uses Clerk for authentication and Supabase for database/edge functions
- Stripe checkout is handled via Supabase edge functions with Clerk token verification
- Never commit real API keys to GitHub
- Use test keys for development, live keys for production