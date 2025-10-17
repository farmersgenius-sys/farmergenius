# Vercel Deployment Guide - Farmer Genius

## ✅ Your Project is NOW Vercel-Ready!

I've created Vercel-specific serverless functions for your AI chat. Follow these steps to deploy:

---

## 🚀 Quick Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel serverless functions"
git push
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click **"Deploy"**

### Step 3: Add Environment Variable (For AI Features)
1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your API key from https://openrouter.ai/
4. Click **"Save"**
5. **Redeploy** your project (Deployments → ⋯ → Redeploy)

---

## 🔧 What I Changed for Vercel

### Files Created:
1. **`api/chat.js`** - Vercel serverless function for AI chat
2. **`vercel.json`** - Vercel configuration file

### How It Works:
- **Static Files**: HTML, CSS, JS, images served directly
- **API Route**: `/api/chat` handled by serverless function
- **CORS**: Enabled for cross-origin requests
- **Rate Limiting**: Built-in (10 req/min per IP)

---

## 🧪 Testing Your Deployment

After deploying:

1. **Open your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Website should load** ✅
3. **Click "Ask AI Assistant"**
4. **Send a test message**

### Expected Results:

#### Without API Key:
- Message: "AI Assistant is currently unavailable. Please add the OPENAI_API_KEY..."
- This is CORRECT! ✅

#### With API Key:
- AI responds with farming advice! 🎉

---

## 🐛 Troubleshooting

### Issue: "Unable to connect" Error

**Open Browser Console** (F12 → Console tab) and look for:

#### 1. CORS Error
**Symptoms**: `CORS policy` error in console

**Solution**: Already fixed! The `api/chat.js` has CORS enabled.

#### 2. 404 Error on /api/chat
**Symptoms**: Console shows 404

**Solution**: 
- Make sure `vercel.json` is in your root directory
- Redeploy your project
- Clear browser cache

#### 3. API Key Not Working
**Symptoms**: Still shows "unavailable" message

**Solution**:
- Double-check the environment variable name: `OPENAI_API_KEY`
- Make sure you **redeployed** after adding the variable
- Check Vercel logs for errors

#### 4. Rate Limit Errors
**Symptoms**: "Too many requests" message

**Solution**: 
- Wait 1 minute and try again
- Rate limit resets every 60 seconds

---

## 📊 Check Vercel Logs

If something's not working:

1. Go to Vercel dashboard
2. Click on your project
3. Go to **"Deployments"** → Click latest deployment
4. Click **"Functions"** tab
5. Click on **`/api/chat`**
6. View logs to see errors

---

## 🔑 Getting OpenRouter API Key (Free!)

1. Go to https://openrouter.ai/
2. Sign up with GitHub or Email
3. Go to **Keys** tab
4. Click **"Create Key"**
5. Copy the key
6. Add to Vercel environment variables

**Free tier includes:**
- Mistral 7B model (free)
- Perfect for farming advice
- No credit card needed

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub with `vercel.json` and `api/chat.js`
- [ ] Import project on Vercel
- [ ] Deploy successfully
- [ ] Test website loads
- [ ] (Optional) Add `OPENAI_API_KEY` in Vercel settings
- [ ] (Optional) Redeploy after adding API key
- [ ] Test AI chat works

---

## 🎉 Success!

Once deployed, your Farmer Genius app will:
- ✅ Load blazingly fast on Vercel
- ✅ Have all tools and calculators working
- ✅ AI chat working (with API key)
- ✅ Scale automatically
- ✅ Work on mobile and desktop

---

## 🆘 Still Having Issues?

1. Check browser console for detailed error logs
2. Check Vercel function logs
3. Verify `vercel.json` is in root directory
4. Make sure you redeployed after adding API key
5. Try clearing browser cache

**Common Fix**: Delete the deployment and redeploy fresh!

---

## 📝 Files Structure for Vercel

```
farmer-genius/
├── api/
│   └── chat.js          # Serverless function
├── index.html           # Main page
├── tools.html
├── styles.css
├── script.js
├── server.js            # (Not used on Vercel, for local dev only)
├── vercel.json          # Vercel config
└── package.json
```

The `server.js` is for local development and other platforms (Railway, Render). Vercel uses the serverless function in `api/chat.js` instead.
