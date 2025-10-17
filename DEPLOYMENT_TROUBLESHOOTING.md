# Deployment Troubleshooting Guide

## AI Chat "No Connection" Error

If you see "no connection" or "unable to connect" errors when using the AI chat in your deployed app, follow these troubleshooting steps:

### Step 1: Check Browser Console
1. Open your deployed website
2. Open browser DevTools (F12 or right-click → Inspect)
3. Go to the Console tab
4. Try sending a message in the AI chat
5. Look for error messages in the console

The logs will show:
- "Sending message to AI API..." - Chat is trying to connect
- "API Response status: XXX" - Shows HTTP status code
- "API Response data: {...}" - Shows the API response
- Red error messages - Shows what went wrong

### Step 2: Common Issues & Solutions

#### Issue 1: CORS Error
**Symptoms**: Console shows `CORS` or `Access-Control-Allow-Origin` error

**Solution**: 
- If deploying to a separate frontend URL, set `ALLOWED_ORIGINS` environment variable:
  ```bash
  ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
  ```

#### Issue 2: 404 Not Found
**Symptoms**: Console shows "404" status or "API endpoint not found"

**Solution**:
- Ensure your server is running and accessible
- Check that `/api/chat` endpoint exists in your deployment
- Some platforms (Vercel) may need special configuration for API routes

#### Issue 3: API Key Missing (Expected Behavior)
**Symptoms**: Chat works but says "AI Assistant is currently unavailable"

**This is CORRECT!** The AI needs an API key to work:
1. Get a free API key from https://openrouter.ai/
2. Add environment variable: `OPENAI_API_KEY=your_key_here`
3. Restart your server
4. AI chat will now work perfectly!

#### Issue 4: Server Not Running
**Symptoms**: Console shows "Failed to fetch" or "Network error"

**Solution**:
- Ensure your server is deployed and running
- Check server logs for errors
- Verify the deployment was successful

### Step 3: Platform-Specific Notes

#### Replit
- ✅ Everything works out of the box
- Just click "Deploy" and it works
- Add `OPENAI_API_KEY` in Secrets tab (optional)

#### Vercel
- ⚠️ Vercel is primarily for static/serverless sites
- For this Node.js server, consider using:
  - Railway (recommended)
  - Render
  - Heroku
  - Or configure Vercel for Node.js runtime

#### Railway / Render / Heroku
- ✅ Works perfectly
- Add `OPENAI_API_KEY` in environment variables
- Server starts automatically

### Step 4: Test Locally First
Before deploying, test locally:
```bash
npm install
npm start
# Visit http://localhost:5000
# Try the AI chat
```

If it works locally but not in deployment, the issue is deployment-specific.

### Step 5: Enable Trust Proxy (If Behind Load Balancer)
Some platforms (Heroku, Railway, Render) use load balancers.

Add environment variable:
```bash
TRUST_PROXY=true
```

This helps the server correctly detect client IPs for rate limiting.

### Still Having Issues?

1. **Check server logs** - Look for errors when requests come in
2. **Test API directly** - Use curl or Postman to test `/api/chat`:
   ```bash
   curl -X POST https://yourapp.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```
3. **Verify all environment variables** - Especially `PORT`, `HOST`, `TRUST_PROXY`

### Expected Behavior (Without API Key)
✅ Website loads perfectly
✅ All tools and calculators work
✅ AI chat shows: "AI Assistant is currently unavailable. Please add the OPENAI_API_KEY..."

### Expected Behavior (With API Key)
✅ Everything above PLUS
✅ AI chat works and provides farming advice

---

## Quick Deployment Checklist

- [ ] Server deployed and running
- [ ] Website loads in browser
- [ ] Check browser console for errors
- [ ] All tools and calculators work
- [ ] (Optional) Add `OPENAI_API_KEY` for AI features
- [ ] (If needed) Set `TRUST_PROXY=true`
- [ ] (If needed) Set `ALLOWED_ORIGINS` for CORS

## Contact Support
If you've tried everything above and still have issues, please provide:
1. Platform you're deploying to (Vercel, Railway, etc.)
2. Browser console error messages
3. Server logs (if available)
4. Screenshot of the error
