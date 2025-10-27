# Farmer Genius - Smart Solutions for Modern Farmers

## Overview

Farmer Genius is a comprehensive web-based platform designed to empower farmers with AI-powered tools, government scheme information, and agricultural knowledge. The application provides a multilingual interface supporting **16+ languages** (English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Russian, Italian, Turkish, Bengali, Tamil, Telugu, Marathi) to serve farmers worldwide with modern farming techniques, fertilizer quality checks, crop rotation guidance, and access to government agricultural schemes.

The platform features:
- **AI assistant** powered by OpenAI/OpenRouter APIs for personalized farming advice
- **Real-time translation** using LibreTranslate API for seamless multilingual support
- **Smart caching** to reduce translation API calls and improve performance
- **Automatic language detection** based on browser settings

The application is designed to increase farming productivity by up to 40% through comprehensive farming solutions and expert guidance.

## Recent Changes

**October 27, 2025** - Replit Environment Setup Completed
- Installed all Node.js dependencies (openai v5.23.0)
- Created .gitignore file for Node.js project structure
- Configured workflow to run server on port 5000 with 0.0.0.0 binding
- Set up deployment configuration for autoscale (serverless) deployment
- Verified application is running successfully with all features functional
- AI Assistant ready (requires OPENAI_API_KEY environment variable to be set)
- **Translation service upgraded to Google Translate** (via @vitalets/google-translate-api library)
  - No API key required, high-quality translations
  - Supports 100+ languages including all 16+ in the app
  - Tested and confirmed working: Hindi, Spanish, French, Chinese, German, Portuguese, Japanese, Arabic, Russian, Italian, Turkish, Bengali, Tamil, Telugu, Marathi
  - Significantly better translation quality than previous APIs

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Website Design**
- Pure HTML/CSS/JavaScript implementation without frontend frameworks
- Multi-page application with separate HTML files for each major section (tools, schemes, modern farming, knowledge hub, helpline, settings)
- Responsive design using CSS Grid and Flexbox for mobile-first approach
- Custom CSS variables for theming support (light/dark mode)
- FontAwesome icons and Google Fonts (Roboto, Montserrat) for typography

**Navigation System**
- Auto-hiding navigation with timeout-based visibility
- Mobile-responsive hamburger menu
- Active link highlighting based on current page
- Multi-language support through data attributes (data-en, data-hi)

**Knowledge Hub Structure**
- Dedicated pages for specific farming topics:
  - Organic farming (knowledge-organic.html)
  - Crop rotation (knowledge-rotation.html)
  - Soil and climate (knowledge-soil-climate.html)
  - Sustainable farming (knowledge-sustainable.html)
  - Fertilizer quality checks (knowledge-fertilizer.html)

**Helpline Directory**
- Comprehensive helpline numbers page (helpline.html) for farmer support
- Government helplines included:
  - Krishi Rakshak Portal: 14447 (crop loss reporting and grievances)
  - PM-KISAN Helpline: 155261 / 011-24300606 (scheme queries)
  - Ministry of Agriculture & Farmers Welfare: 011-23383370, 011-23782691
  - Ministry of Rural Development: 011-23782373, 011-23782327
  - PM Fasal Bima Yojana (Crop Insurance): 14447
  - Hon. Minister Office (Shri Shivraj Singh Chouhan): 011-23383370
- Each helpline includes detailed descriptions explaining when to call
- Contact information includes phone numbers and email addresses where applicable
- Important information section with usage guidelines
- Full bilingual support for accessibility

**Design Rationale**: The static site approach was chosen for simplicity, fast loading times, and ease of deployment without requiring complex build processes. This makes the application accessible even in areas with limited internet connectivity. The helpline directory provides farmers with quick access to critical government support numbers in emergency situations.

### Backend Architecture

**Dual Server Configuration**
- **Development Server** (server.js): Node.js HTTP server for local development
- **Production Deployment** (Vercel): Serverless function architecture for scalability

**AI Chat Integration**
- Serverless function endpoint at `/api/chat.js`
- OpenAI SDK configured to use OpenRouter as base URL
- Support for Mistral models through OpenRouter proxy
- Async/await pattern for handling chat completions

**Rate Limiting & Security**
- In-memory rate limiting (10 requests per 60-second window per IP)
- Request size validation (max 10KB)
- IP-based tracking with proxy header support (X-Forwarded-For)
- CORS headers configured for cross-origin requests

**Design Rationale**: The serverless architecture provides automatic scaling and cost efficiency, while the dual server setup allows for local development without cloud dependencies. Rate limiting protects against abuse while maintaining reasonable access for legitimate users.

### State Management

**Client-Side Storage**
- Browser localStorage for user preferences (language, theme)
- No session management or cookies required
- Stateless API calls to backend services

**Design Rationale**: Avoiding server-side sessions reduces complexity and allows the application to scale horizontally without session synchronization concerns.

### Internationalization (i18n)

**Comprehensive Multi-Language Support**
- **16+ Languages**: English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Russian, Italian, Turkish, Bengali, Tamil, Telugu, Marathi
- **Translation API**: MyMemory API (free, no API key required, 100+ language pairs)
- **Translation Caching**: Browser localStorage with LRU eviction (max 500 entries, keeps 300 most recent)
- **Automatic Language Detection**: Detects browser language on first visit
- **Real-time Page Translation**: Translates all text elements dynamically using `/api/translate` endpoint
- **Original Text Preservation**: Stores original English text in `data-original-text` attributes for accurate retranslation
- **Fallback Support**: Maintains legacy data-attribute translations (data-en, data-hi) for offline compatibility
- **API Endpoint**: GET https://api.mymemory.translated.net/get with query parameters
- **Daily Limit**: 5,000 characters/day (anonymous), extendable to 50,000 with email registration

**Translation Architecture**:
1. **Client-side**: `TranslationManager` (translations.js) handles language detection, caching, and page translation
2. **Server-side**: `/api/translate` endpoint proxies requests to MyMemory API with rate limiting
3. **UI**: Language dropdown in settings page with all supported languages
4. **Caching Strategy**: Translations cached by `${sourceLang}:${targetLang}:${text}` key, persisted in localStorage
5. **Performance**: Batch translation of unique text items, progress logging for large pages

**Design Rationale**: The LibreTranslate API integration provides free, unlimited translations without API keys, while client-side caching minimizes API calls and improves response times. The system preserves original English text to enable accurate multi-language switching, ensuring users can toggle between any languages seamlessly.

## External Dependencies

### AI Services
- **OpenAI SDK** (v5.23.0+): Primary library for AI chat integration
- **OpenRouter API**: Proxy service for accessing Mistral AI models
  - Base URL: https://openrouter.ai/api/v1
  - Requires OPENAI_API_KEY environment variable
  - Provides access to multiple LLM providers through unified interface

### CDN Dependencies
- **Google Fonts**: Roboto and Montserrat font families
- **FontAwesome 6.4.0**: Icon library for UI elements
- **CDN Delivery**: All external assets loaded via CDN for performance

### Deployment Platform
- **Vercel**: Serverless hosting platform
  - Static file serving for HTML/CSS/JS
  - Serverless functions for API endpoints
  - Automatic HTTPS and global CDN distribution
  - Environment variable management for API keys

### Third-Party Integrations
- **Google Site Verification**: Site ownership verification (googled7a8c221b5a9c2ad.html)

### Development Dependencies
- **Node.js**: Runtime environment (v14.0.0+)
- **HTTP Module**: Built-in Node.js server for development
- **File System Module**: Static file serving

**Design Rationale**: Minimal dependencies reduce attack surface and maintenance burden. OpenRouter provides flexibility to switch between AI providers without code changes. Vercel handles infrastructure concerns (SSL, CDN, scaling) allowing focus on application features.