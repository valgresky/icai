# Netlify & Clerk Configuration Guide

## 🌐 Netlify Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuaW5uZXItY2lyY2xlLWFpLmNvbSQ
CLERK_SECRET_KEY=sk_live_your_secret_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔧 Clerk Dashboard Configuration

### 1. Domain Configuration
In your Clerk dashboard, go to **Configure > Domains** and add:

**Development:**
- `localhost:3000`
- `127.0.0.1:3000`

**Production (replace with your actual Netlify URL):**
- `your-app-name.netlify.app`
- Your custom domain if you have one

### 2. Redirect URLs Configuration
Go to **Configure > Paths** and set:

```
Sign-in URL: /
Sign-up URL: /
After sign-in URL: /
After sign-up URL: /
Home URL: /
```

### 3. Allowed Origins
Go to **Configure > Restrictions** and add these origins:

**Development:**
- `http://localhost:3000`
- `http://127.0.0.1:3000`

**Production:**
- `https://your-app-name.netlify.app`
- Your custom domain with HTTPS

### 4. CORS Settings
Ensure these are enabled in **Configure > CORS**:
- Allow credentials: ✅ Enabled
- Allowed origins: Add your Netlify URLs
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Authorization, Content-Type

## 🚀 Netlify Build Configuration

Your `netlify.toml` is already configured, but make sure these settings are correct:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔍 Testing Steps

### 1. Local Testing
```bash
npm run dev
```
- Test sign-in/sign-up flows
- Verify authentication works

### 2. Production Testing
After deploying to Netlify:
- Test authentication on your live URL
- Check browser console for any CORS errors
- Verify all environment variables are loaded

## 🚨 Common Issues & Solutions

### Issue: "Invalid publishable key" error
**Solution:** Make sure the environment variable is set correctly in Netlify

### Issue: CORS errors in production
**Solution:** Add your Netlify URL to Clerk's allowed origins

### Issue: Redirect loops
**Solution:** Check that your redirect URLs in Clerk match your actual routes

### Issue: Authentication not working in production
**Solution:** Verify all environment variables are set in Netlify dashboard

## 📋 Deployment Checklist

Before going live:
- [ ] All environment variables set in Netlify
- [ ] Netlify URL added to Clerk domains
- [ ] Redirect URLs configured in Clerk
- [ ] CORS origins set in Clerk
- [ ] Test authentication flows work
- [ ] Check browser console for errors
- [ ] Verify Supabase connection works
- [ ] Test Stripe payments (if applicable)

## 🔗 Quick Links

- [Netlify Dashboard](https://app.netlify.com/)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Your Clerk Instance](https://clerk.inner-circle-ai.com)