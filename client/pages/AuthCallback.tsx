import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthManager, UserCache } from '../lib/auth-manager';
import { useLanguage } from '../hooks/use-language';
import { useTranslation } from '../hooks/use-translation';
import { Heading, Text } from '../components/design-system/Typography';
import { motion } from 'framer-motion';

interface CallbackState {
  status: 'processing' | 'success' | 'error';
  message: string;
  error?: string;
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const [state, setState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing authentication...',
  });

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      // Handle OAuth errors
      if (error) {
        setState({
          status: 'error',
          message: 'Authentication failed',
          error: `OAuth error: ${error}`,
        });
        
        setTimeout(() => {
          navigate(`/${language}/login`);
        }, 3000);
        return;
      }

      if (!code) {
        setState({
          status: 'error',
          message: 'Authentication failed',
          error: 'No authorization code received',
        });
        
        setTimeout(() => {
          navigate(`/${language}/login`);
        }, 3000);
        return;
      }

      setState({
        status: 'processing',
        message: 'Completing authentication...',
      });

      // Call the callback API
      const response = await fetch(`/api/auth/callback?code=${code}`);
      const result = await response.json();

      if (result.success && result.token && result.user) {
        // Store authentication data
        AuthManager.setToken(result.token);
        UserCache.save(result.user);

        setState({
          status: 'success',
          message: result.isNewUser 
            ? 'Account created successfully! Welcome to Madar AI!' 
            : 'Welcome back to Madar AI!',
        });

        // Redirect to generator page
        setTimeout(() => {
          navigate(`/${language}/generator`);
        }, 2000);

      } else {
        throw new Error(result.error || 'Authentication failed');
      }

    } catch (error) {
      console.error('OAuth callback error:', error);
      
      setState({
        status: 'error',
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });

      setTimeout(() => {
        navigate(`/${language}/login`);
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'processing':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        );
      case 'success':
        return (
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 flex justify-center">
          {getStatusIcon()}
        </div>

        <Heading 
          as="h1" 
          size="2xl" 
          className={`mb-4 ${getStatusColor()}`}
        >
          {state.status === 'processing' && 'Authenticating...'}
          {state.status === 'success' && 'Success!'}
          {state.status === 'error' && 'Authentication Failed'}
        </Heading>

        <Text className="mb-6 text-muted-foreground">
          {state.message}
        </Text>

        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-700 text-sm">
              {state.error}
            </Text>
          </div>
        )}

        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
          <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>

        {state.status === 'success' && (
          <Text className="mt-4 text-sm text-muted-foreground">
            Redirecting to generator...
          </Text>
        )}

        {state.status === 'error' && (
          <Text className="mt-4 text-sm text-muted-foreground">
            Redirecting to login page...
          </Text>
        )}
      </motion.div>
    </div>
  );
} 