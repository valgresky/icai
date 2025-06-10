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

### 3. Allowed Origins (CRITICAL FOR FIXING CORS ERRORS)
Go to **Configure > Restrictions** and add these origins:

**Development:**
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://localhost:3000` (if using HTTPS locally)

**Production:**
- `https://your-app-name.netlify.app`
- Your custom domain with HTTPS

⚠️ **IMPORTANT**: Make sure to include the protocol (`http://` or `https://`) when adding origins. Missing protocols are a common cause of CORS errors.

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

### Issue: CORS errors in production (Clerk.js fetch errors)
**Solution:** 
1. Add your exact URL to Clerk's allowed origins in **Configure > Restrictions**
2. Include the protocol (`http://` or `https://`)
3. For localhost, add both `http://localhost:3000` and `http://127.0.0.1:3000`
4. Wait 2-3 minutes after making changes for them to propagate

### Issue: Redirect loops
**Solution:** Check that your redirect URLs in Clerk match your actual routes

### Issue: Authentication not working in production
**Solution:** Verify all environment variables are set in Netlify dashboard

## 📋 Deployment Checklist

Before going live:
- [ ] All environment variables set in Netlify
- [ ] Netlify URL added to Clerk domains
- [ ] **`http://localhost:3000` added to Clerk allowed origins for development**
- [ ] Redirect URLs configured in Clerk
- [ ] CORS origins set in Clerk (with proper protocols)
- [ ] Test authentication flows work
- [ ] Check browser console for errors
- [ ] Verify Supabase connection works
- [ ] Test Stripe payments (if applicable)

## 🛠️ Immediate Fix for Current Error

To fix the current Clerk.js fetch error:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Configure > Restrictions** (or **Configure > Domains** in some versions)
3. In the "Allowed Origins" section, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
4. Save the changes
5. Wait 2-3 minutes for the changes to propagate
6. Refresh your localhost:3000 page

## 🔗 Quick Links

- [Netlify Dashboard](https://app.netlify.com/)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Your Clerk Instance](https://clerk.inner-circle-ai.com)