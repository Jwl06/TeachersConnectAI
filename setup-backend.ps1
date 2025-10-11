# Rural-Urban Teacher Connect - Backend Setup Script (PowerShell)

Write-Host "🚀 Setting up Rural-Urban Teacher Connect Backend..." -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "🗄️ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Create database and run migrations
Write-Host "🔧 Setting up database..." -ForegroundColor Yellow
npx prisma db push

# Create .env.local file if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    @"
# Database
DATABASE_URL="file:./dev.db"

# Google Translate API
GOOGLE_TRANSLATE_API_KEY="your_google_translate_api_key_here"

# OpenAI API
OPENAI_API_KEY="your_openai_api_key_here"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# Application
NODE_ENV="development"
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "⚠️  Please update .env.local with your actual API keys!" -ForegroundColor Red
} else {
    Write-Host ".env.local already exists, skipping creation..." -ForegroundColor Blue
}

Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your API keys:" -ForegroundColor White
Write-Host "   - Get Google Translate API key from: https://console.cloud.google.com/" -ForegroundColor Gray
Write-Host "   - Get OpenAI API key from: https://platform.openai.com/api-keys" -ForegroundColor Gray
Write-Host "2. Run the development server: npm run dev" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000 to see your application" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

Read-Host "Press Enter to continue"
