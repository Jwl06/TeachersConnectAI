# Google Translate API Setup Guide

## 🔑 Getting Your Google Translate API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Rural-Urban Teacher Connect"
4. Click "Create"

### Step 2: Enable the Translate API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Cloud Translation API"
3. Click on "Cloud Translation API"
4. Click "Enable"

### Step 3: Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage

### Step 4: Configure Your Environment
Add your API key to `.env.local`:
```env
GOOGLE_TRANSLATE_API_KEY="your_actual_api_key_here"
```

## 💰 Pricing Information

### Google Translate API Pricing (as of 2024)
- **Free Tier**: 500,000 characters per month
- **Paid Tier**: $20 per 1,000,000 characters
- **Very affordable** for educational use

### Cost Estimation for Educational Use
- Average note: ~500 characters
- 1,000 notes = 500,000 characters = **FREE** (within free tier)
- Even with heavy usage, costs are minimal

## 🛠️ Alternative Setup (No API Key Required)

If you prefer not to use Google Translate API, the system automatically falls back to OpenAI:

```env
# Only OpenAI API key needed
OPENAI_API_KEY="your_openai_api_key_here"
# GOOGLE_TRANSLATE_API_KEY=""  # Leave empty or comment out
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

### Expected Response
```json
{
  "translatedText": "नमस्ते, आप कैसे हैं?",
  "detectedLanguage": "en",
  "detectedLanguageName": "English",
  "confidence": 0.99,
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
- **Google Translate Integration**: High-quality translations
- **Automatic Fallback**: Falls back to OpenAI if Google fails
- **Language Detection**: Automatically detects source language
- **Confidence Scoring**: Shows translation confidence
- **Database Storage**: Saves translations to avoid re-translation
- **Batch Translation**: Translate multiple notes at once
- **Copy to Clipboard**: Easy copying of translated text

### 🎯 Usage Examples

#### For Teachers
1. Upload notes in your preferred language
2. Students can translate to their native language
3. Translations are saved for future reference
4. High accuracy with Google Translate API

#### For Students
1. Access notes in any language
2. Translate to your preferred language
3. Copy translated content for offline use
4. View translation confidence scores

## 🔒 Security & Privacy

### Data Handling
- Translations are processed by Google Translate API
- Original content remains in your database
- No sensitive data is sent to Google
- Translations are cached locally

### Best Practices
- Use API key restrictions in Google Cloud Console
- Monitor usage in Google Cloud Console
- Set up billing alerts for unexpected usage
- Regularly rotate API keys

## 🆘 Troubleshooting

### Common Issues

#### "Translation failed" Error
1. Check if API key is correctly set in `.env.local`
2. Verify Google Translate API is enabled
3. Check API key permissions
4. Ensure billing is enabled (even for free tier)

#### "API key not valid" Error
1. Regenerate API key in Google Cloud Console
2. Update `.env.local` with new key
3. Restart development server

#### High Translation Costs
1. Check Google Cloud Console billing
2. Set up usage quotas
3. Consider using OpenAI fallback only

### Getting Help
- Check Google Cloud Console logs
- Review API usage in Google Cloud Console
- Contact Google Cloud Support for API issues
- Check our GitHub issues for common problems

## 📊 Monitoring Usage

### Google Cloud Console
1. Go to "APIs & Services" → "Dashboard"
2. View "Cloud Translation API" usage
3. Monitor character count and costs
4. Set up alerts for high usage

### Application Logs
Check your application logs for translation requests:
```bash
# View translation logs
npm run dev
# Look for: "Translating from en to hi"
```

---

**Ready to get started?** Follow the steps above to set up Google Translate API and enjoy high-quality translations for your educational content!
