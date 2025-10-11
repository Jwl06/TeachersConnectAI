# PowerShell script to set up environment variables
Write-Host "Setting up environment variables for Rural-Urban Teacher Connect" -ForegroundColor Green

# Create .env.local file
$envContent = @"
# Database
DATABASE_URL="file:./dev.db"

# OpenAI API Key (required for AI features)
OPENAI_API_KEY="your_openai_api_key_here"

# NextAuth Secret (optional)
NEXTAUTH_SECRET="your_nextauth_secret_here"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Created .env.local file" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Please edit .env.local and add your OpenAI API key:" -ForegroundColor Red
Write-Host "1. Get your API key from: https://platform.openai.com/account/api-keys" -ForegroundColor Cyan
Write-Host "2. Replace 'your_openai_api_key_here' with your actual API key" -ForegroundColor Cyan
Write-Host "3. Save the file" -ForegroundColor Cyan
Write-Host ""
Write-Host "Example:" -ForegroundColor Yellow
Write-Host 'OPENAI_API_KEY="sk-1234567890abcdef..."' -ForegroundColor Gray
Write-Host ""
Write-Host "After setting up your API key, restart the development server:" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Cyan
