# Google OAuth Authentication Setup

## Overview
Complete Google OAuth authentication system with JWT tokens, Neon database integration, and Edge Function support.

## 🔧 **Environment Variables Required**

Add these to your Vercel environment variables:

```env
# Existing variables
DATABASE_URL=postgresql://your-neon-connection-string
FAL_AI_API_KEY=your-fal-ai-key

# New authentication variables
JWT_SECRET=your-super-secure-jwt-secret-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback
```

## 🚀 **Google Cloud Console Setup**

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application Type** to **Web Application**
6. Add **Authorized Redirect URIs**:
   - `https://your-domain.vercel.app/api/auth/callback`
   - `http://localhost:8080/api/auth/callback` (for development)

### 2. Get Credentials
- Copy **Client ID** → `GOOGLE_CLIENT_ID`
- Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

## 📊 **Database Schema Updates**

The system automatically uses the updated schema with these new fields:

### Users Table (Enhanced)
```sql
- googleId: text (unique) - Google user ID
- profilePicture: text - Google profile picture URL  
- createdAt: timestamp - Account creation date
- lastLoginAt: timestamp - Last login tracking
```

### Sessions Table (New)
```sql
- id: uuid (primary key)
- userId: uuid (foreign key to users)
- token: text (unique) - JWT token
- expiresAt: timestamp - Token expiration
- createdAt: timestamp - Session creation
```

## 🔗 **API Endpoints**

### Authentication Endpoints

#### 1. **Get Google Auth URL**
```
GET /api/auth/google
```
**Response:**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### 2. **Google OAuth Callback**
```
GET /api/auth/callback?code=...
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "name": "User Name",
    "profilePicture": "https://...",
    "generationCount": 0,
    "resetDate": "2025-01-01T00:00:00Z"
  },
  "token": "jwt-token-here",
  "isNewUser": true
}
```

#### 3. **Logout**
```
POST /api/auth/logout
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Protected Endpoints

All these endpoints now require `Authorization: Bearer <jwt-token>` header:

- `POST /api/generate` - Generate images
- `POST /api/save` - Save images  
- `GET /api/gallery` - User gallery
- `GET /api/user` - User stats

## 🔒 **Authentication Flow**

### Frontend Implementation

#### 1. **Login Flow**
```javascript
// Get Google auth URL
const response = await fetch('/api/auth/google');
const { authUrl } = await response.json();

// Redirect user to Google
window.location.href = authUrl;

// After Google redirects back to /api/auth/callback
// The callback endpoint returns user data and JWT token
// Store the token for future API calls
```

#### 2. **Making Authenticated Requests**
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### 3. **Logout**
```javascript
await fetch('/api/auth/logout', { method: 'POST' });
localStorage.removeItem('authToken');
```

## 🛡️ **Security Features**

### JWT Tokens
- **Algorithm**: HS256 
- **Expiration**: 7 days
- **Issuer/Audience**: Validated for security
- **Secret**: Environment variable (`JWT_SECRET`)

### Database Security  
- **Password hashing**: Not needed (OAuth only)
- **Session management**: JWT tokens with expiration
- **User data**: Minimal storage, Google handles sensitive data

### API Protection
- **Middleware**: Automatic authentication checking
- **Error handling**: Proper 401 responses
- **Token validation**: JWT signature verification

## 🔄 **Migration from Test Mode**

The system automatically migrates from test mode:

1. **Existing test user** (`dev@example.com`) can still be used
2. **New real users** authenticate via Google OAuth
3. **All API endpoints** now require authentication
4. **Backward compatibility** maintained for development

## 🎯 **Production Checklist**

- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure Google OAuth credentials
- [ ] Set correct `GOOGLE_REDIRECT_URI` 
- [ ] Test authentication flow
- [ ] Update frontend to handle auth states
- [ ] Remove any hardcoded test credentials

## 📱 **Frontend Integration**

Update your authentication hooks to use the new endpoints:

```javascript
// useAuth hook example
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const login = async () => {
    const response = await fetch('/api/auth/google');
    const { authUrl } = await response.json();
    window.location.href = authUrl;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return { user, token, login, logout };
};
```

## ✅ **Testing**

1. **Test endpoints**:
   - `/api/auth/google` - Should return Google auth URL
   - `/api/auth/callback` - Should handle OAuth callback
   - `/api/user` - Should require authentication

2. **Test authentication**:
   - Login with Google account
   - Make authenticated API calls
   - Verify JWT token validation

Authentication system is now production-ready! 🎉 