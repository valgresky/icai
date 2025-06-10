# Deployment Guide for Inner Circle AI

## 🚀 Vercel Deployment

### Option 1: Deploy via Vercel CLI (Recommended)
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub Integration
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

## 🔧 Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🗄️ Supabase Configuration

### 1. Update Supabase Settings
1. **Go to Settings > API**:
   - Add your Vercel domain to **Site URL**
   - Add your domain to **Redirect URLs**

2. **Authentication Settings**:
   - Go to Authentication > Settings
   - Add your production domain to allowed origins
   - Configure email templates for production

3. **Edge Functions**:
   - Your Stripe webhook and checkout functions are already deployed
   - Update any hardcoded URLs to use your production domain

## 💳 Stripe Configuration

### 1. Webhook Endpoints
Add your production webhook endpoint in Stripe Dashboard:
- URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`

### 2. Update Environment Variables
- Use your **live** Stripe keys for production
- Update `STRIPE_WEBHOOK_SECRET` with the live webhook secret

## 🌐 Custom Domain Setup

### For Vercel:
1. Go to **Project Settings > Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. HTTPS is automatic

## 🔍 Testing Checklist

Before going live, test:
- [ ] Sign up/Sign in flows work with Supabase Auth
- [ ] Purchase flows complete successfully
- [ ] Webhooks receive and process events
- [ ] User dashboard shows correct data
- [ ] Email notifications work
- [ ] Custom domain redirects properly
- [ ] HTTPS is working

## 🚨 Important Notes

1. **Environment Variables**: Never commit real API keys to your repository
2. **Supabase Auth**: The app now uses Supabase authentication instead of Clerk
3. **Stripe Keys**: Use live Stripe keys for production payments
4. **Testing**: Always test the complete purchase flow before launch
5. **Monitoring**: Set up error monitoring (Sentry, LogRocket, etc.)

## 🆘 Troubleshooting

### Sign-in Issues:
- Check Supabase authentication configuration
- Verify environment variables are set correctly
- Ensure redirect URLs match your domain

### Payment Issues:
- Verify Stripe webhook is receiving events
- Check Supabase edge function logs
- Confirm environment variables are correct

### Domain Issues:
- DNS propagation can take up to 48 hours
- Check SSL certificate status
- Verify redirect rules are working

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase edge function logs
3. Verify all environment variables are set
4. Test with Stripe's test mode first