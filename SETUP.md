# Quick Setup Guide

## 🚨 URGENT: Replace Environment Variables

Your app is currently using placeholder values. You need to replace them with real keys:

### 1. Supabase Setup (Primary Authentication)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy your **Project URL** and **anon/public key**
5. Replace the values in `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 2. Stripe Setup (for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Secret Key** from API keys section
3. Set up webhooks and get **Webhook Secret**
4. Replace the values in `.env` file

### 3. Configure Supabase Authentication
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Add your domain (localhost:3000 for development)
3. Configure redirect URLs
4. Enable email authentication

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
- The app now uses Supabase Auth instead of Clerk for authentication