import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface GoogleLoginProps {
  role: 'artist' | 'recruiter';
}

export default function GoogleLogin({ role }: GoogleLoginProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect URI without trailing slash
  const redirectUri = window.location.origin.replace(/\/$/, '');

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: redirectUri,
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        const requestBody = {
          code: codeResponse.code,
          role,
          redirect_uri: redirectUri
        };

        console.log('Sending request to server:', {
          ...requestBody,
          code: requestBody.code ? `[${requestBody.code.length} chars]` : undefined
        });
        
        // Exchange code for tokens using our backend
        const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
          console.error('Token exchange failed:', {
            status: tokenResponse.status,
            data,
            requestBody: {
              ...requestBody,
              code: requestBody.code ? `[${requestBody.code.length} chars]` : undefined
            }
          });
          throw new Error(data.message || 'Failed to exchange token');
        }

        console.log('Token exchange successful');
        
        // Update auth context with user data
        login({
          sub: data.user._id,
          name: data.user.name,
          email: data.user.email,
          picture: data.user.profilePicture,
          role: data.user.role,
          token: data.token
        });
        
        // Redirect based on user's role from server response
        navigate(data.user.role === 'artist' ? '/artist/dashboard' : '/recruiter/dashboard');
      } catch (error: any) {
        console.error('Google OAuth error:', error);
        // You can add a toast notification here to show the error to the user
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setIsLoading(false);
      // You can add a toast notification here to show the error to the user
    },
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center">
          <img
            src="/spotlight-logo.png"
            alt="Loading"
            className="w-5 h-5 mr-3 animate-spin"
          />
          <span className="font-medium">Logging in...</span>
        </div>
      ) : (
        <>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-3"
          />
          <span className="font-medium">Continue with Google</span>
        </>
      )}
    </button>
  );
}
