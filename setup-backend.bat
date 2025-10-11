@echo off
echo 🚀 Setting up Rural-Urban Teacher Connect Backend...

echo 📦 Installing dependencies...
npm install

echo 🗄️ Generating Prisma client...
npx prisma generate

echo 🔧 Setting up database...
npx prisma db push

echo 📝 Creating .env.local file...
if not exist .env.local (
    echo # Database > .env.local
    echo DATABASE_URL="file:./dev.db" >> .env.local
    echo. >> .env.local
    echo # Google Translate API >> .env.local
    echo GOOGLE_TRANSLATE_API_KEY="your_google_translate_api_key_here" >> .env.local
    echo. >> .env.local
    echo # OpenAI API >> .env.local
    echo OPENAI_API_KEY="your_openai_api_key_here" >> .env.local
    echo. >> .env.local
    echo # NextAuth.js >> .env.local
    echo NEXTAUTH_URL="http://localhost:3000" >> .env.local
    echo NEXTAUTH_SECRET="your_nextauth_secret_here" >> .env.local
    echo. >> .env.local
    echo # Application >> .env.local
    echo NODE_ENV="development" >> .env.local
    echo ⚠️  Please update .env.local with your actual API keys!
) else (
    echo .env.local already exists, skipping creation...
)

echo ✅ Backend setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your API keys:
echo    - Get Google Translate API key from: https://console.cloud.google.com/
echo    - Get OpenAI API key from: https://platform.openai.com/api-keys
echo 2. Run the development server: npm run dev
echo 3. Visit http://localhost:3000 to see your application
echo.
echo 🎉 Happy coding!
pause
