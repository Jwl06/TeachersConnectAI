# LibreTranslate API Setup Guide

## 🔑 Getting Started with LibreTranslate

### What is LibreTranslate?
LibreTranslate is a free and open-source translation API that provides high-quality translations without requiring API keys for basic usage. It's perfect for educational applications!

### Step 1: Basic Setup (No API Key Required)
LibreTranslate offers free usage without requiring an API key. Simply set up your environment:

```env
# Optional - LibreTranslate API key for higher rate limits
LIBRETRANSLATE_API_KEY=""
# Leave empty for free usage
```

### Step 2: Configure Your Environment
Add to `.env.local`:
```env
# LibreTranslate (optional for free usage)
LIBRETRANSLATE_API_KEY=""

# Required for fallback
OPENAI_API_KEY="your_openai_api_key_here"
```

## 💰 Pricing Information

### LibreTranslate Pricing
- **Free Tier**: Unlimited translations (with rate limits)
- **Paid Tier**: Higher rate limits and priority processing
- **Perfect for educational use** - completely free!

### Cost Estimation for Educational Use
- Average note: ~500 characters
- **Unlimited notes = FREE** (within rate limits)
- No monthly costs or character limits

## 🛠️ Alternative Setup (With API Key)

If you need higher rate limits, you can get a LibreTranslate API key:

1. Visit [LibreTranslate API](https://libretranslate.com/)
2. Sign up for an account
3. Get your API key
4. Add to `.env.local`:

```env
LIBRETRANSLATE_API_KEY="your_libretranslate_api_key_here"
```

## 🔧 Testing Your Setup

### Test Translation API
```bash
# Test the translation endpoint
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "targetLanguage": "Hindi"
  }'
```

### Test File Upload Translation
```bash
# Test file upload and translation
curl -X POST http://localhost:3000/api/translate-file \
  -F "file=@sample.txt" \
  -F "targetLanguage=Hindi" \
  -F "sourceLanguage=English" \
  -F "title=Sample Translation"
```

### Expected Response
```json
{
  "translatedText": "नमस्ते, आप कैसे हैं?",
  "detectedLanguage": "en",
  "detectedLanguageName": "English",
  "confidence": 0.9,
  "targetLanguage": "Hindi",
  "success": true
}
```

## 🌍 Supported Languages

The system supports 20+ languages including:

### Indian Languages
- Hindi (हिन्दी)
- Bengali (বাংলা)
- Marathi (मराठी)
- Telugu (తెలుగు)
- Tamil (தமிழ்)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Odia (ଓଡ଼ିଆ)
- Punjabi (ਪੰਜਾਬੀ)
- Urdu (اردو)

### International Languages
- English, Spanish, French, German
- Chinese, Japanese, Korean
- Arabic, Portuguese, Russian

## 🚀 Features

### ✅ What's Implemented
- **LibreTranslate Integration**: Free, high-quality translations
- **File Upload Translation**: Upload .txt files and translate them
- **Automatic Fallback**: Falls back to OpenAI if LibreTranslate fails
- **Language Detection**: Automatically detects source language
- **Database Storage**: Saves translations to avoid re-translation
- **Batch Translation**: Translate multiple notes at once
- **Copy to Clipboard**: Easy copying of translated text

### 🎯 Usage Examples

#### For Teachers
1. Upload notes in your preferred language
2. Upload text files and translate them automatically
3. Students can translate to their native language
4. Translations are saved for future reference
5. High accuracy with LibreTranslate API

#### For Students
1. Access notes in any language
2. Translate to your preferred language
3. Copy translated content for offline use
4. View translation confidence scores

## 🔒 Security & Privacy

### Data Handling
- Translations are processed by LibreTranslate API
- Original content remains in your database
- No sensitive data is sent to external services
- Translations are cached locally

### Best Practices
- LibreTranslate is open-source and privacy-focused
- No data collection or tracking
- Free to use without restrictions
- Regular updates and improvements

## 🆘 Troubleshooting

### Common Issues

#### "Translation failed" Error
1. Check if LibreTranslate service is available
2. Verify internet connection
3. Check API key if using paid version
4. Ensure OpenAI fallback is configured

#### "File upload failed" Error
1. Check file format (only .txt supported currently)
2. Ensure file size is reasonable
3. Verify file contains text content
4. Check server logs for detailed errors

#### High Translation Costs
1. LibreTranslate is free - no costs!
2. Only OpenAI fallback may have costs
3. Check OpenAI usage in your dashboard
4. Consider using LibreTranslate only

### Getting Help
- Check LibreTranslate status page
- Review application logs for errors
- Check our GitHub issues for common problems
- LibreTranslate community support

## 📊 Monitoring Usage

### Application Logs
Check your application logs for translation requests:
```bash
# View translation logs
npm run dev
# Look for: "Translating from en to hi"
```

### LibreTranslate Status
- LibreTranslate is generally very reliable
- Free service with good uptime
- Community-maintained and open-source

## 🔄 Migration from Google Translate

If you're migrating from Google Translate:

1. **Remove Google Translate API key** from `.env.local`
2. **Add LibreTranslate API key** (optional)
3. **Update environment variables**:
   ```env
   # Remove this
   # GOOGLE_TRANSLATE_API_KEY=""
   
   # Add this (optional)
   LIBRETRANSLATE_API_KEY=""
   ```
4. **Restart your development server**
5. **Test translations** to ensure everything works

## 🆕 New Features

### File Upload Translation
- Upload .txt files directly
- Automatic language detection
- Translate entire documents
- Save as notes for future reference

### Enhanced UI
- File upload interface
- Progress indicators
- Better error handling
- Improved user experience

---

**Ready to get started?** LibreTranslate provides free, high-quality translations perfect for your educational application!
