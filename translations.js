const TranslationManager = {
    supportedLanguages: {
        'en': { name: 'English', flag: '🇬🇧', nativeName: 'English' },
        'hi': { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
        'es': { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
        'fr': { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
        'de': { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
        'pt': { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
        'zh': { name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
        'ja': { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
        'ar': { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
        'ru': { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
        'it': { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
        'tr': { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
        'bn': { name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
        'ta': { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
        'te': { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
        'mr': { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' }
    },

    currentLanguage: 'en',
    translationCache: new Map(),
    isTranslating: false,

    init() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.supportedLanguages[savedLang]) {
            this.currentLanguage = savedLang;
        } else {
            const browserLang = navigator.language.split('-')[0];
            if (this.supportedLanguages[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
        
        const savedCache = localStorage.getItem('translationCache');
        if (savedCache) {
            try {
                const cacheData = JSON.parse(savedCache);
                this.translationCache = new Map(Object.entries(cacheData));
            } catch (e) {
                console.warn('Failed to load translation cache:', e);
            }
        }

        console.log(`🌐 Translation Manager initialized. Current language: ${this.supportedLanguages[this.currentLanguage].nativeName}`);
    },

    setLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) {
            console.error(`Unsupported language: ${langCode}`);
            return false;
        }

        this.currentLanguage = langCode;
        localStorage.setItem('preferredLanguage', langCode);
        
        console.log(`Language changed to: ${this.supportedLanguages[langCode].nativeName}`);
        return true;
    },

    getCacheKey(text, sourceLang, targetLang) {
        return `${sourceLang}:${targetLang}:${text}`;
    },

    async translateText(text, targetLang, sourceLang = 'en') {
        if (!text || text.trim().length === 0) {
            return text;
        }

        if (sourceLang === targetLang) {
            return text;
        }

        const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
        
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    targetLang: targetLang,
                    sourceLang: sourceLang
                })
            });

            if (!response.ok) {
                throw new Error(`Translation failed: ${response.status}`);
            }

            const data = await response.json();
            const translatedText = data.translatedText;

            this.translationCache.set(cacheKey, translatedText);
            this.saveCacheToStorage();

            return translatedText;

        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },

    async translatePage(targetLang, sourceLang = 'en') {
        if (this.isTranslating) {
            console.log('Translation already in progress...');
            return;
        }

        if (!this.supportedLanguages[targetLang]) {
            console.error(`Unsupported target language: ${targetLang}`);
            return;
        }

        this.isTranslating = true;

        try {
            const elementsToTranslate = document.querySelectorAll('[data-translate], [data-en], h1, h2, h3, h4, h5, h6, p, span, a, button, label, .page-title, .page-subtitle');
            
            const uniqueTexts = new Set();
            const elementsMap = new Map();

            elementsToTranslate.forEach(element => {
                let textToTranslate = '';
                
                if (element.hasAttribute('data-original-text')) {
                    textToTranslate = element.getAttribute('data-original-text');
                } else if (element.hasAttribute('data-en')) {
                    textToTranslate = element.getAttribute('data-en');
                    element.setAttribute('data-original-text', textToTranslate);
                } else if (element.hasAttribute('data-translate')) {
                    textToTranslate = element.getAttribute('data-translate');
                    element.setAttribute('data-original-text', textToTranslate);
                } else {
                    const textContent = element.textContent.trim();
                    if (textContent && textContent.length > 0 && textContent.length < 500) {
                        if (!element.querySelector('*') || element.children.length === 0) {
                            textToTranslate = textContent;
                            element.setAttribute('data-original-text', textToTranslate);
                        }
                    }
                }

                if (textToTranslate && textToTranslate.length > 0) {
                    uniqueTexts.add(textToTranslate);
                    
                    if (!elementsMap.has(textToTranslate)) {
                        elementsMap.set(textToTranslate, []);
                    }
                    elementsMap.get(textToTranslate).push(element);
                }
            });

            console.log(`Translating ${uniqueTexts.size} unique text items to ${this.supportedLanguages[targetLang].nativeName}...`);

            const translations = new Map();
            const textsArray = Array.from(uniqueTexts);
            
            for (let i = 0; i < textsArray.length; i++) {
                const text = textsArray[i];
                const translated = await this.translateText(text, targetLang, sourceLang);
                translations.set(text, translated);
                
                if ((i + 1) % 5 === 0) {
                    console.log(`Translation progress: ${i + 1}/${textsArray.length}`);
                }
            }

            elementsMap.forEach((elements, originalText) => {
                const translatedText = translations.get(originalText);
                if (translatedText) {
                    elements.forEach(element => {
                        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                            element.setAttribute('placeholder', translatedText);
                        } else {
                            element.textContent = translatedText;
                        }
                    });
                }
            });

            if (document.documentElement.lang) {
                document.documentElement.lang = targetLang;
            }

            console.log(`✅ Page translation complete!`);

        } catch (error) {
            console.error('Page translation error:', error);
        } finally {
            this.isTranslating = false;
        }
    },

    saveCacheToStorage() {
        try {
            const cacheObj = Object.fromEntries(this.translationCache);
            const cacheSize = Object.keys(cacheObj).length;
            
            if (cacheSize > 500) {
                const entries = Array.from(this.translationCache.entries());
                const recentEntries = entries.slice(-300);
                this.translationCache = new Map(recentEntries);
            }
            
            localStorage.setItem('translationCache', JSON.stringify(Object.fromEntries(this.translationCache)));
        } catch (e) {
            console.warn('Failed to save translation cache:', e);
        }
    },

    clearCache() {
        this.translationCache.clear();
        localStorage.removeItem('translationCache');
        console.log('Translation cache cleared');
    },

    getCurrentLanguage() {
        return this.currentLanguage;
    },

    getLanguageInfo(langCode) {
        return this.supportedLanguages[langCode] || null;
    },

    getAllLanguages() {
        return Object.entries(this.supportedLanguages).map(([code, info]) => ({
            code,
            ...info
        }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationManager;
}
