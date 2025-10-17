// Vercel Serverless Function for AI Chat
const OpenAI = require('openai');

// Rate limiting store (in-memory, resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_REQUEST_SIZE_BYTES = 10000;

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
           req.headers['x-real-ip'] || 
           'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    try {
        const clientIP = getClientIP(req);
        
        // Rate limiting
        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({ 
                error: 'Too many requests. Please try again in a minute.' 
            });
        }
        
        const { message } = req.body;
        
        // Validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Message is required and must be a string' 
            });
        }
        
        if (message.length > 500) {
            return res.status(400).json({ 
                error: 'Message too long. Maximum 500 characters.' 
            });
        }
        
        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return res.status(200).json({ 
                response: 'AI Assistant is currently unavailable. Please add the OPENAI_API_KEY to enable AI features. You can still use all the farming tools and resources on this website!' 
            });
        }
        
        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1'
        });
        
        // Create farming-focused system prompt
        const systemPrompt = `You are an expert agricultural AI assistant for Indian farmers. Your name is Farm AI Assistant. You help farmers with:
- Crop selection and planting advice
- Fertilizer and irrigation guidance  
- Pest and disease management
- Soil health and testing
- Weather planning
- Government schemes and subsidies
- Market prices and selling tips
- Organic farming practices
- Farm technology and apps

Provide practical, actionable advice in simple language. Use relevant emojis. Keep responses concise but informative (2-4 sentences). Focus on solutions that work for small to medium farms in India.`;
        
        const response = await openai.chat.completions.create({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 300
        });
        
        const aiResponse = response.choices[0].message.content;
        
        return res.status(200).json({ response: aiResponse });
        
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({ 
            error: 'Sorry, I\'m having trouble right now. Please try asking me about crops, fertilizers, irrigation, or other farming topics!' 
        });
    }
};
