# Quick Setup Guide

## 🚨 URGENT: Replace Environment Variables

Your app is currently using placeholder values. You need to replace them with real keys:

### 1. Clerk Authentication Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or use existing one
3. Copy your **Publishable Key** (starts with `pk_test_`)
4. Copy your **Secret Key** (starts with `sk_test_`)
5. Replace the values in `.env` file

### 2. Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy your **Project URL** and **anon/public key**
5. Replace the values in `.env` file

### 3. Stripe Setup (for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Secret Key** from API keys section
3. Set up webhooks and get **Webhook Secret**
4. Replace the values in `.env` file

### 4. Configure Clerk Domains
In your Clerk dashboard:
- Add your domain (localhost:3000 for development)
- Set redirect URLs to your domain
- Configure sign-in/sign-up paths

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