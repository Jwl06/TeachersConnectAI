# Windows Installation Guide

## Quick Fix for Dependency Conflicts

If you encounter dependency conflicts during installation, use one of these methods:

### Method 1: Use Legacy Peer Deps (Recommended)
```powershell
npm install --legacy-peer-deps
```

### Method 2: Force Installation
```powershell
npm install --force
```

### Method 3: Clear Cache and Reinstall
```powershell
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

## Complete Setup Process

1. **Install dependencies with legacy peer deps**:
   ```powershell
   npm install --legacy-peer-deps
   ```

2. **Generate Prisma client**:
   ```powershell
   npx prisma generate
   ```

3. **Setup database**:
   ```powershell
   npx prisma db push
   ```

4. **Create environment file**:
   ```powershell
   # Create .env.local file
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
   ```

5. **Start development server**:
   ```powershell
   npm run dev
   ```

## Troubleshooting

### If you still get dependency errors:
- Try updating npm: `npm install -g npm@latest`
- Use yarn instead: `yarn install`
- Use pnpm: `pnpm install`

### If Prisma commands fail:
- Make sure you have the latest Node.js version (18+)
- Try running: `npx prisma --version`
- Check if the database file is created: `ls dev.db`

## Next Steps

1. Get your API keys:
   - OpenAI: https://platform.openai.com/api-keys
   - Google Translate: https://console.cloud.google.com/

2. Update `.env.local` with your actual API keys

3. Visit http://localhost:3000 to see your application
