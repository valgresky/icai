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
- `inner-circle-ai.com`
- `https://inner-circle-ai.com`

**Production:**
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

**Development (LOCAL DEV SERVER):**
- `http://localhost:3000` ⚠️ **REQUIRED FOR LOCAL DEVELOPMENT**
- `https://localhost:3000` ⚠️ **REQUIRED FOR LOCAL DEVELOPMENT**
- `http://inner-circle-ai.com:3000` ⚠️ **REQUIRED FOR CUSTOM HOST**
- `https://inner-circle-ai.com:3000` ⚠️ **REQUIRED FOR CUSTOM HOST**
- `https://inner-circle-ai.com`
- `http://inner-circle-ai.com`

**Production:**
- `https://your-app-name.netlify.app`
- Your custom domain with HTTPS

⚠️ **IMPORTANT**: Make sure to include the protocol (`http://` or `https://`) and port number (`:3000`) when adding development origins. Missing protocols or ports are a common cause of CORS errors.

### 4. CORS Settings
Ensure these are enabled in **Configure > CORS**:
- Allow credentials: ✅ Enabled
- Allowed origins: Add your domain URLs (including localhost:3000)
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

### 1. Development Testing
Access your app at:
- `http://localhost:3000` (standard localhost access)
- `http://inner-circle-ai.com:3000` (custom host access)
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

### Issue: CORS errors in development (Clerk.js fetch errors)
**Solution:** 
1. Add your exact development URLs to Clerk's allowed origins in **Configure > Restrictions**
2. Include the protocol (`http://` or `https://`) and port (`:3000`)
3. For localhost development, add both `http://localhost:3000` and `https://localhost:3000`
4. For custom host development, add both `http://inner-circle-ai.com:3000` and `https://inner-circle-ai.com:3000`
5. Wait 2-3 minutes after making changes for them to propagate

### Issue: CORS errors in production (Clerk.js fetch errors)
**Solution:** 
1. Add your exact URL to Clerk's allowed origins in **Configure > Restrictions**
2. Include the protocol (`http://` or `https://`)
3. For inner-circle-ai.com, add both `https://inner-circle-ai.com` and `http://inner-circle-ai.com`
4. Wait 2-3 minutes after making changes for them to propagate

### Issue: Redirect loops
**Solution:** Check that your redirect URLs in Clerk match your actual routes

### Issue: Authentication not working in production
**Solution:** Verify all environment variables are set in Netlify dashboard

## 📋 Deployment Checklist

Before going live:
- [ ] All environment variables set in Netlify
- [ ] Netlify URL added to Clerk domains
- [ ] **Development URLs (`localhost:3000`, `inner-circle-ai.com:3000`) added to Clerk allowed origins**
- [ ] **Production URL (`https://inner-circle-ai.com`) added to Clerk allowed origins**
- [ ] Redirect URLs configured in Clerk
- [ ] CORS origins set in Clerk (with proper protocols and ports)
- [ ] Test authentication flows work in development
- [ ] Test authentication flows work in production
- [ ] Check browser console for errors
- [ ] Verify Supabase connection works
- [ ] Test Stripe payments (if applicable)

## 🛠️ Immediate Fix for Current Error

To fix the current Clerk.js fetch error:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Configure > Restrictions** (or **Configure > Domains** in some versions)
3. In the "Allowed Origins" section, add:
   - `http://localhost:3000` ⚠️ **THIS FIXES THE CURRENT ERROR**
   - `https://localhost:3000`
   - `http://inner-circle-ai.com:3000`
   - `https://inner-circle-ai.com:3000`
   - `https://inner-circle-ai.com`
   - `http://inner-circle-ai.com`
4. Save the changes
5. Wait 2-3 minutes for the changes to propagate
6. Refresh your browser page

**Root Cause**: The error occurs because your local development server (`localhost:3000`) is not in Clerk's allowed origins list, causing browsers to block API requests due to CORS policy.

## 🔗 Quick Links

- [Netlify Dashboard](https://app.netlify.com/)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Your Clerk Instance](https://clerk.inner-circle-ai.com)