# Stack Auth Setup Instructions

## 1. Get Stack Auth Credentials

To complete the Stack Auth integration, you need to get the actual credentials from your Stack Auth dashboard:

1. Go to [Stack Auth Dashboard](https://dashboard.stack-auth.com/)
2. Log in or create an account
3. Navigate to your project: `3bdd90d0-3097-4df6-ad2d-87b282db0a06`
4. Go to the "API Keys" or "Settings" section
5. Copy the following credentials:
   - **Publishable Client Key** (starts with `pk_`)
   - **Secret Server Key** (starts with `sk_`)

## 2. Update Environment Variables

Replace the placeholder values in your `.env` file:

```bash
# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=3bdd90d0-3097-4df6-ad2d-87b282db0a06
VITE_STACK_PROJECT_ID=3bdd90d0-3097-4df6-ad2d-87b282db0a06
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pk_test_your_actual_publishable_key_here
VITE_STACK_SECRET_SERVER_KEY=sk_test_your_actual_secret_key_here
```

## 3. Configure OAuth Providers

In your Stack Auth dashboard, make sure to:

1. Enable Google OAuth provider
2. Configure redirect URLs:
   - Development: `http://localhost:8080/en/handler/oauth/callback`
   - Production: `https://yourdomain.com/en/handler/oauth/callback`

## 4. Test Authentication

After updating the credentials:

1. Restart the development server: `npm run dev`
2. Navigate to the home page
3. Click "Get Started" - it should redirect to Stack Auth login
4. Test Google OAuth login
5. After successful login, you should be redirected to the generator page

## 5. Current Implementation

The following components are already integrated with Stack Auth:

- **Home page**: Get Started button redirects based on auth status
- **Login page**: Redirects authenticated users to generator
- **Generator page**: Shows user-specific navigation and logout
- **Hero component**: Smart navigation based on authentication
- **Navigation menus**: Show sign in/out options based on user state

## 6. Available Auth Hooks

You can use these Stack Auth hooks in your components:

```tsx
import { useUser } from "@stackframe/stack";

function MyComponent() {
  const user = useUser();

  if (user) {
    // User is authenticated
    return <div>Welcome {user.displayName}!</div>;
  } else {
    // User is not authenticated
    return <div>Please sign in</div>;
  }
}
```

## 7. Sign Out

To sign out a user:

```tsx
const user = useUser();
user?.signOut();
```

The authentication system is fully integrated and ready to use once the proper credentials are configured.
