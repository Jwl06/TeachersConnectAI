# Rural-Urban Teacher Connect

A comprehensive educational platform that bridges the gap between rural and urban teachers through AI-powered tools, resource sharing, and collaboration features.

## 🌟 Features

### Core Functionality
- **Shared Notes System**: Teachers can upload and share educational notes with automatic translation support
- **Prepared Classes**: Access to teacher-prepared lesson plans and AI-generated content
- **Shift Management**: Rural schools can request support from urban teachers
- **Collaboration Board**: Real-time collaboration between rural and urban educators

### AI-Powered Features
- **Enhanced AI Chatbot**: Educational assistant with Q&A generation capabilities
- **AI Translation**: Intelligent translation using OpenAI with educational context awareness
- **File Upload Translation**: Upload text files and translate them automatically
- **AI Video Generation**: Automatically create educational videos based on topics and grade levels
- **Smart Lesson Generation**: AI-powered lesson plan creation

### Technical Features
- **Modern Backend**: Built with Next.js 15, Prisma, and SQLite
- **Real-time Updates**: Live chat and collaboration features
- **Responsive Design**: Works on all devices with low-bandwidth optimization
- **Database Integration**: Proper data persistence with Prisma ORM

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- OpenAI API key (required for AI features)

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd rural-urban-teacher-connect
   ```

2. **Run setup script**:
   
   **For Windows (PowerShell)**:
   ```powershell
   .\setup-backend.ps1
   ```
   
   **For Windows (Command Prompt)**:
   ```cmd
   setup-backend.bat
   ```
   
   **For Linux/Mac**:
   ```bash
   chmod +x setup-backend.sh
   ./setup-backend.sh
   ```

2. **Configure environment variables**:
   Run the setup script:
   ```powershell
   .\setup-env.ps1
   ```
   
   Then edit `.env.local` and add your OpenAI API key:
   ```env
   # Required
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your_actual_openai_api_key_here"
   
   # Optional
   NEXTAUTH_SECRET="your_nextauth_secret_here"
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Visit the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### Classes
- `GET /api/classes` - Get all prepared classes
- `POST /api/classes` - Create a new class
- `PUT /api/classes/[id]` - Update a class
- `DELETE /api/classes/[id]` - Delete a class

### Translation
- `POST /api/translate` - Translate text using AI with educational context
- `POST /api/translate-file` - Upload and translate files using AI

### Chat
- `POST /api/chat` - AI chat with Q&A capabilities

### Video Generation
- `POST /api/generate-video` - Generate AI educational videos
- `GET /api/videos` - Get all generated videos
- `POST /api/videos` - Create video request
- `PUT /api/videos/[id]` - Update video status

### Shifts
- `GET /api/shifts` - Get all shift requests
- `POST /api/shifts` - Create shift request
- `PUT /api/shifts/[id]` - Update shift (volunteer)

## 🗄️ Database Schema

The application uses Prisma with SQLite for data persistence:

- **Users**: Teacher/student profiles with location and role
- **Notes**: Educational content with translation support
- **PreparedClasses**: Lesson plans and syllabi
- **Shifts**: Support requests between rural and urban schools
- **Videos**: AI-generated educational content
- **ChatMessages**: AI conversation history

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma database connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `GOOGLE_TRANSLATE_API_KEY` | Google Translate API key | No* |
| `NEXTAUTH_SECRET` | Secret for authentication | No |
| `NODE_ENV` | Environment (development/production) | Yes |

*Required for accurate translations. Falls back to OpenAI if not provided.

### API Keys Setup

1. **OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add to `.env.local`

2. **Google Translate API Key** (Optional):
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Translate API
   - Create credentials
   - Add to `.env.local`

## 🎯 Usage

### For Teachers
1. **Upload Notes**: Share educational content with automatic translation
2. **Create Classes**: Prepare lesson plans for different grade levels
3. **Generate Videos**: Use AI to create educational videos
4. **Request Support**: Rural teachers can request help from urban colleagues
5. **AI Assistant**: Get help with teaching strategies and content creation

### For Students
1. **Access Notes**: View shared educational content
2. **Watch Videos**: Learn from AI-generated educational videos
3. **AI Chat**: Get help with homework and concepts
4. **Practice Questions**: Use Q&A generator for self-assessment

## 🛠️ Development

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Adding New Features
1. Update Prisma schema in `prisma/schema.prisma`
2. Run `npx prisma generate` and `npx prisma db push`
3. Create API routes in `app/api/`
4. Update frontend components in `app/`

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices, making it accessible to teachers and students in rural areas with limited technology access.

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Railway**: Supports Prisma and Next.js
- **Netlify**: For static deployment
- **DigitalOcean**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time video streaming
- [ ] Advanced AI tutoring
- [ ] Mobile app development
- [ ] Offline mode support
- [ ] Multi-language UI
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS platforms

---

Built with ❤️ for educators worldwide
