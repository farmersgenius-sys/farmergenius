# Deployment Guide - Farmer Genius

This application can be deployed to **any** hosting platform that supports Node.js. No platform-specific configuration required!

## 📋 Requirements
- Node.js 14 or higher
- npm or yarn package manager

## 🚀 Quick Deploy to Any Platform

### Option 1: Replit
1. Import this repository to Replit
2. Click "Run" - it will automatically install dependencies
3. Click "Publish" to deploy to production
4. (Optional) Add `OPENAI_API_KEY` in Secrets for AI features

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variable: `OPENAI_API_KEY` (optional)

### Option 3: Heroku
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Push code: `git push heroku main`
4. Set env var: `heroku config:set OPENAI_API_KEY=your_key` (optional)

### Option 4: Railway
1. Visit railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variable: `OPENAI_API_KEY` (optional)
5. Deploy!

### Option 5: Render
1. Visit render.com
2. Click "New +" → "Web Service"
3. Connect your repository
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable: `OPENAI_API_KEY` (optional)

### Option 6: DigitalOcean App Platform
1. Visit cloud.digitalocean.com
2. Create → Apps → GitHub
3. Select repository
4. It will auto-detect Node.js
5. Add environment variable: `OPENAI_API_KEY` (optional)

### Option 7: AWS, Google Cloud, Azure
1. Create a compute instance (EC2, Compute Engine, VM)
2. Clone repository: `git clone <your-repo-url>`
3. Install dependencies: `npm install`
4. Run: `npm start`
5. Set environment variable: `export OPENAI_API_KEY=your_key` (optional)

### Option 8: Self-Hosted / VPS
```bash
# Clone repository
git clone <your-repo-url>
cd farmer-genius

# Install dependencies
npm install

# (Optional) Set environment variables
export OPENAI_API_KEY=your_openai_key
export PORT=3000  # Optional, defaults to 5000
export HOST=0.0.0.0  # Optional, defaults to 0.0.0.0

# Start server
npm start

# Or with PM2 for production
npm install -g pm2
pm2 start server.js --name farmer-genius
pm2 save
pm2 startup
```

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port to run the server on |
| `HOST` | No | 0.0.0.0 | Host address to bind to |
| `OPENAI_API_KEY` | No | - | OpenRouter API key for AI assistant |
| `NODE_ENV` | No | development | Environment mode |
| `ALLOWED_ORIGINS` | No | - | Comma-separated list of allowed CORS origins (if needed) |
| `TRUST_PROXY` | No | false | Set to `true` if behind a trusted proxy (Heroku, Railway, etc.) |

### CORS Configuration

By default, the application serves files from the same origin (secure). If you need to access the API from a different domain (e.g., separate frontend), set `ALLOWED_ORIGINS`:

```bash
# Single domain
export ALLOWED_ORIGINS=https://yourdomain.com

# Multiple domains
export ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

**Security Note**: Only set this if you actually need cross-origin access. Same-origin is the most secure default.

### Proxy Configuration

If deploying behind a trusted proxy (Heroku, Railway, Render, etc.), enable proxy mode to correctly detect client IPs:

```bash
export TRUST_PROXY=true
```

**Important**: Only enable this on platforms that set `X-Forwarded-For` headers. Direct deployments (VPS, self-hosted) should keep this disabled for security.

## 🔒 Security Features

The application includes built-in security features that work automatically:

- ✅ **Simple rate limiting** (10 requests per IP per minute)
- ✅ **Request size limits** (10KB maximum)
- ✅ **Message length validation** (500 chars max)
- ✅ **CORS configured** for cross-origin requests
- ✅ **Input validation** and sanitization
- ✅ **No complex sessions** - works reliably across all platforms

## 🧪 Testing Locally

```bash
# Install dependencies
npm install

# Run server
npm start

# Visit http://localhost:5000
```

## 📱 Features

All features work out-of-the-box on any platform:
- ✅ Smart farming calculators
- ✅ Crop calendar and guides
- ✅ Government schemes information
- ✅ Weather widget (no API key needed!)
- ✅ AI Assistant (requires OPENAI_API_KEY)
- ✅ Multi-language support (English/Hindi)
- ✅ Mobile responsive design

## 🆘 Troubleshooting

### Application won't start
- Check Node.js version: `node --version` (should be 14+)
- Install dependencies: `npm install`
- Check port availability: `lsof -i :5000`

### AI Assistant not working
- Ensure `OPENAI_API_KEY` is set
- Get API key from: https://openrouter.ai/
- Check server logs for errors

### Port already in use
- Set different port: `PORT=3000 npm start`
- Or kill process: `kill -9 $(lsof -ti:5000)`

## 📞 Support

For issues or questions, check the console logs which show:
- Server URL and port
- Environment detection
- API key status
- Security features status

## 🎉 That's it!

Your Farmer Genius app is now deployment-ready for **any** platform. No platform-specific code needed!
