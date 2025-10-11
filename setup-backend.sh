#!/bin/bash

# Rural-Urban Teacher Connect - Backend Setup Script

echo "🚀 Setting up Rural-Urban Teacher Connect Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Create database and run migrations
echo "🔧 Setting up database..."
npx prisma db push

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
EOF
    echo "⚠️  Please update .env.local with your actual API keys!"
fi

echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your API keys:"
echo "   - Get Google Translate API key from: https://console.cloud.google.com/"
echo "   - Get OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Run the development server: npm run dev"
echo "3. Visit http://localhost:3000 to see your application"
echo ""
echo "🎉 Happy coding!"
