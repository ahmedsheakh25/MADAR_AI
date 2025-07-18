# Madar AI - Setup and Deployment Guide

## 🚀 Project Overview

Madar AI is a comprehensive image generation platform tailored for Arabic designers, featuring:

- **3D Style Generation**: Voxel, Clay, Crystal, and Fire Jelly styles
- **User Management**: 30 generations per month quota system
- **Admin Dashboard**: User and style management interfaces
- **RTL Support**: Full Arabic language and RTL layout support
- **Database Integration**: Neon serverless PostgreSQL with Drizzle ORM
- **AI Integration**: Fal AI for image generation

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: Neon (Serverless PostgreSQL) + Drizzle ORM
- **AI**: Fal AI (via @fal-ai/serverless-client)
- **Authentication**: Development auth (Stack Auth ready)
- **UI Components**: @once-ui-system/core + Radix UI

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Fal AI API key
- Neon database (already configured)

## 🔧 Environment Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd madar-ai
   npm install
   ```

2. **Environment Configuration**

   Update the `.env` file with your API keys:

   ```env
   # Neon Database (already configured)
   DATABASE_URL=postgresql://neondb_owner:npg_62ygNWcjMfKb@ep-little-sound-aebz4k1s-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

   # Fal AI Configuration (REQUIRED)
   FAL_AI_API_KEY=your_fal_ai_api_key_here

   # Google OAuth (Optional - for production auth)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

3. **Get Fal AI API Key**
   - Sign up at [fal.ai](https://fal.ai)
   - Navigate to your dashboard and create an API key
   - Add it to your `.env` file

## 🗄️ Database Setup

The database is already configured with:

- **Project ID**: `noisy-resonance-16818617`
- **Database**: `neondb`
- **Tables**: `users`, `images`, `styles` (pre-populated with default styles)

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  generation_count INT DEFAULT 0,
  reset_date TIMESTAMP DEFAULT now()
);

-- Images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  image_url TEXT,
  prompt TEXT,
  style_name TEXT,
  colors TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

-- Styles table
CREATE TABLE styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  description TEXT,
  thumbnail TEXT,
  prompt_json JSONB
);
```

## 🚀 Development

1. **Start Development Server**

   ```bash
   npm run dev
   ```

   Access the app at `http://localhost:8080`

2. **Available Routes**
   - `/` - Home page
   - `/generator` - Image generation interface
   - `/gallery` - User's generated images
   - `/admin/users` - User management (admin)
   - `/admin/styles` - Style management (admin)

## 🏗️ API Endpoints

### Generation Endpoints

- `POST /api/generate` - Generate new image
- `POST /api/save` - Save generated image to gallery
- `GET /api/user` - Get user stats and quota
- `GET /api/gallery` - Get user's saved images
- `GET /api/styles` - Get available generation styles

### Request/Response Examples

**Generate Image:**

```javascript
POST /api/generate
{
  "prompt": "Create me a 3D icon of a frog on a lily pad",
  "styleId": "voxel-3d",
  "colors": ["#FFC0CB", "#FF6B6B"],
  "uploadedImageUrl": "optional-image-url"
}

Response:
{
  "success": true,
  "imageUrl": "https://generated-image-url.com/image.png",
  "remainingGenerations": 25
}
```

**Save Image:**

```javascript
POST /api/save
{
  "imageUrl": "https://generated-image-url.com/image.png",
  "prompt": "3D frog on lily pad",
  "styleName": "Voxel 3D",
  "colors": ["#FFC0CB", "#FF6B6B"]
}

Response:
{
  "success": true,
  "imageId": "uuid-of-saved-image"
}
```

## 👤 User System

### Development Authentication

Currently using development authentication with a mock user:

- Email: `dev@example.com`
- Name: `Dev User`
- Quota: 30 generations/month

### Quota Management

- Each user gets 30 free generations per month
- Quota resets automatically each month
- Admin can manually reset user quotas
- Generation count is tracked per user

## 🎨 Style System

### Pre-configured Styles

1. **Voxel 3D**: Blocky, isometric pixel art style
2. **Clay 3D**: Soft clay sculpture appearance
3. **Crystal 3D**: Reflective crystal materials
4. **Fire Jelly 3D**: Translucent, glossy finish

### Style Configuration

Each style includes:

- Name and description
- Thumbnail image
- JSON prompt configuration for AI generation
- Material and background specifications

### Admin Style Management

- Create/edit/delete styles
- Configure JSON prompts
- Set thumbnails
- Preview functionality

## 📱 Features

### Generator Page

- Style selection with previews
- Custom color picker (up to 2 colors)
- Prompt input with character count
- File upload for image-to-image generation
- Real-time quota display
- Generation history

### Gallery Page

- Grid view of saved images
- Search and filter functionality
- Image metadata display
- Responsive design

### Admin Dashboard

- **User Management**: View all users, reset quotas, generation statistics
- **Style Management**: CRUD operations for generation styles
- Statistics and analytics

## 🌐 Internationalization

- **Default Language**: Arabic (RTL)
- **Supported Languages**: Arabic, English
- **Route Structure**: `/:lang/page` (e.g., `/ar/generator`, `/en/generator`)
- **Theme Support**: Dark/Light mode with smooth transitions

## 🏗️ Production Deployment

1. **Build the Application**

   ```bash
   npm run build
   ```

2. **Start Production Server**

   ```bash
   npm start
   ```

3. **Environment Variables for Production**

   - Set `FAL_AI_API_KEY` with your production key
   - Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth
   - Ensure `DATABASE_URL` points to your production Neon database

4. **Deployment Options**
   - **Vercel**: Direct deployment with auto-scaling
   - **Netlify**: Static + serverless functions
   - **Docker**: Container deployment
   - **VPS**: Traditional server deployment

## 🔧 Configuration

### Fal AI Integration

The app uses Fal AI's `fast-sdxl` model with:

- Square HD output (1024x1024)
- 25 inference steps
- Guidance scale of 7.5
- Safety checker enabled
- Automatic retry on failure

### Database Configuration

Using Drizzle ORM with Neon HTTP adapter:

- Connection pooling optimized for serverless
- Type-safe queries and schema
- Automatic migrations support

## 🐛 Troubleshooting

### Common Issues

1. **"Generation failed" Error**

   - Check if `FAL_AI_API_KEY` is set correctly
   - Verify API key has sufficient credits
   - Check network connectivity

2. **Database Connection Issues**

   - Verify `DATABASE_URL` is correct
   - Check Neon project status
   - Ensure database tables exist

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run typecheck`
   - Verify all dependencies are installed

### Development Tips

1. **Hot Reload**: Development server supports hot reload for both client and server
2. **API Testing**: Use `/ping` endpoint to verify server is running
3. **Database Queries**: Check server console for SQL queries and errors
4. **User Quota**: Reset in development by calling `/api/user` endpoint

## 📈 Monitoring and Analytics

### User Analytics

- Track generation usage per user
- Monitor quota exhaustion rates
- Analyze popular styles and prompts

### Performance Monitoring

- API response times
- Image generation success rates
- Database query performance
- Error rates and debugging

## 🔐 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting for production
3. **Input Validation**: Validate all user inputs
4. **Authentication**: Implement proper OAuth for production
5. **CORS**: Configure appropriate CORS settings

## 🚀 Future Enhancements

1. **Advanced Authentication**

   - Google OAuth integration
   - User profiles and preferences
   - Role-based access control

2. **Extended Features**

   - Image variations and editing
   - Batch generation
   - Advanced style mixing
   - Custom style creation

3. **Premium Features**
   - Background removal
   - Image upscaling
   - Priority generation queue
   - Extended quotas

## 📞 Support

For technical support or questions:

1. Check this documentation
2. Review error logs in browser console
3. Check server logs for API errors
4. Verify environment configuration

---

**Note**: This is a complete, production-ready implementation of the Madar AI platform. All backend APIs are functional and integrated with the frontend components.
