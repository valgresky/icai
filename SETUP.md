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
   - `inner-circle-ai.com` (for development/production)
   - Your Netlify domain (e.g., `your-app.netlify.app`)
3. Go to **Configure > Paths**
4. Set up redirect URLs:
   - Sign-in URL: `/`
   - Sign-up URL: `/`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

### 3. Configure Clerk CORS Settings (CRITICAL) - IMMEDIATE FIX NEEDED
In your Clerk dashboard:
1. Go to **Configure > Restrictions**
2. In the "Allowed Origins" section, add ALL of these URLs:
   - `http://localhost:3000` ⚠️ **ADD THIS NOW**
   - `https://localhost:3000` ⚠️ **ADD THIS NOW**
   - `http://inner-circle-ai.com:3000` ⚠️ **ADD THIS NOW**
   - `https://inner-circle-ai.com:3000` ⚠️ **ADD THIS NOW**
   - `https://inner-circle-ai.com`
   - `http://inner-circle-ai.com`
   - Your Netlify URL (e.g., `https://your-app.netlify.app`)
3. Save and wait 2-3 minutes for changes to propagate

**🚨 IMMEDIATE ACTION REQUIRED**: The current CORS error is because `localhost:3000` is not in your Clerk allowed origins. Add it now to fix the authentication issue.

### 4. Supabase Setup (Database & Edge Functions)
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

### 5. Stripe Setup (for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Secret Key** from API keys section
3. Set up webhooks and get **Webhook Secret**
4. Replace the values in `.env` file

### 6. Update Supabase Edge Functions for Clerk
The Stripe checkout edge function needs to be updated to work with Clerk tokens instead of Supabase auth. This is already configured in the codebase.

## 🔧 Development
```bash
npm install
npm run dev
```

Access your app at: 
- `http://localhost:3000` (if accessing via localhost)
- `http://inner-circle-ai.com:3000` (if accessing via custom host)

## 🚀 Deployment
See `DEPLOYMENT.md` for production deployment instructions.

## ⚠️ Important Notes
- Your Clerk publishable key is already configured ✅
- You need to add your Clerk secret key to complete the setup
- **CRITICAL**: Configure your domains and CORS origins in Clerk dashboard
- The app uses Clerk for authentication and Supabase for database/edge functions
- Stripe checkout is handled via Supabase edge functions with Clerk token verification
- Never commit real API keys to GitHub
- Use test keys for development, live keys for production

## 🛠️ Quick Fix for Current CORS Error
**IMMEDIATE STEPS TO FIX THE ERROR:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Configure > Restrictions**
3. Add these URLs to allowed origins:
   - `http://localhost:3000`
   - `https://localhost:3000`
   - `http://inner-circle-ai.com:3000`
   - `https://inner-circle-ai.com:3000`
4. Save and wait 2-3 minutes
5. Refresh your browser page

**Why this happens**: Your local development server needs to be explicitly allowed to make requests to Clerk's API. Without these origins in the allowlist, browsers block the requests due to CORS policy.