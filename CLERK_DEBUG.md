# 🔧 Clerk Authentication Debug Guide

## Current Issues & Solutions

### 1. Check Environment Variables
Make sure your `.env` file contains:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuaW5uZXItY2lyY2xlLWFpLmNvbSQ
```

**To verify**: Open browser console and check if you see "Clerk Debug Info" logs.

### 2. CORS Configuration (Most Common Issue)
Your Clerk dashboard must include these allowed origins:

**Required for localhost development:**
- `http://localhost:3000` ⚠️ **CRITICAL**
- `https://localhost:3000`

**Required for custom host:**
- `http://inner-circle-ai.com:3000`
- `https://inner-circle-ai.com:3000`

**Steps to fix:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Configure** → **Restrictions**
3. Add the URLs above to "Allowed Origins"
4. Save and wait 2-3 minutes

### 3. Check Clerk Instance Configuration
Verify in Clerk dashboard:
- **Application Name**: Should match your project
- **Instance Domain**: Should be `clerk.inner-circle-ai.com`
- **Environment**: Development vs Production

### 4. Browser Console Debugging
Open Developer Tools (F12) and look for:

**Good signs:**
- "Clerk Debug Info" logs showing user data
- No CORS errors
- Clerk.js loads successfully

**Bad signs:**
- CORS errors mentioning `clerk.inner-circle-ai.com`
- "Failed to fetch" errors
- Missing publishable key warnings

### 5. Test Authentication Flow
1. Click "Sign In" button
2. Modal should open without errors
3. Try signing in with test credentials
4. Check if user state updates in console logs

### 6. Common Error Messages & Fixes

**Error**: "Missing Clerk Publishable Key"
**Fix**: Check your `.env` file and restart dev server

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Fix**: Add your localhost URL to Clerk allowed origins

**Error**: "Clerk: Invalid publishable key"
**Fix**: Verify the key format starts with `pk_live_` or `pk_test_`

**Error**: "Network request failed"
**Fix**: Check internet connection and Clerk service status

### 7. Verification Steps
After making changes:
1. Restart your development server (`npm run dev`)
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors
4. Test sign-in flow
5. Verify user state in React DevTools

### 8. Emergency Fallback
If Clerk continues to fail, you can temporarily disable authentication:
1. Comment out the `<ClerkProvider>` wrapper in `App.tsx`
2. Replace protected routes with regular routes
3. This allows you to continue development while fixing auth issues

### 9. Contact Support
If issues persist:
- Check [Clerk Status Page](https://status.clerk.com/)
- Review [Clerk Documentation](https://clerk.com/docs)
- Contact Clerk support with your publishable key and error details