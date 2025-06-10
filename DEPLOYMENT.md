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
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### For Production Clerk Keys:
- Use `pk_live_` keys instead of `pk_test_`
- Update your Clerk dashboard with your Vercel domain

## 🔐 Clerk Configuration for Production

### 1. Update Clerk Settings
In your Clerk Dashboard:

1. **Go to Configure > Paths**:
   - Sign-in URL: `https://yourdomain.vercel.app`
   - Sign-up URL: `https://yourdomain.vercel.app`
   - After sign-in URL: `https://yourdomain.vercel.app`
   - After sign-up URL: `https://yourdomain.vercel.app`

2. **Go to Configure > Domains**:
   - Add your Vercel domain: `yourdomain.vercel.app`
   - Add your custom domain if you have one

3. **Update Environment Variables**:
   - Use your **production** Clerk keys (pk_live_... and sk_live_...)

## 🗄️ Supabase Configuration

### 1. Update Supabase Settings
1. **Go to Settings > API**:
   - Add your Vercel domain to **Site URL**
   - Add your domain to **Redirect URLs**

2. **Edge Functions**:
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
- [ ] Sign up/Sign in flows work
- [ ] Purchase flows complete successfully
- [ ] Webhooks receive and process events
- [ ] User dashboard shows correct data
- [ ] Email notifications work
- [ ] Custom domain redirects properly
- [ ] HTTPS is working

## 🚨 Important Notes

1. **Environment Variables**: Never commit real API keys to your repository
2. **Clerk Keys**: Use `pk_live_` and `sk_live_` keys for production
3. **Stripe Keys**: Use live Stripe keys for production payments
4. **Testing**: Always test the complete purchase flow before launch
5. **Monitoring**: Set up error monitoring (Sentry, LogRocket, etc.)

## 🆘 Troubleshooting

### Sign-in Issues:
- Check Clerk domain configuration
- Verify environment variables are set correctly
- Ensure fallback URLs match your domain

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