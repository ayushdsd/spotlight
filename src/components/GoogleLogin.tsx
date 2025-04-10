import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GoogleLoginProps {
  role: 'artist' | 'recruiter';
}

export default function GoogleLogin({ role }: GoogleLoginProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Get the redirect URI without trailing slash
  const redirectUri = window.location.origin.replace(/\/$/, '');

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: redirectUri,
    onSuccess: async (codeResponse) => {
      try {
        console.log('Google OAuth success:', {
          code_length: codeResponse.code?.length,
          role,
          redirect_uri: redirectUri
        });
        
        // Exchange code for tokens using our backend
        const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: codeResponse.code,
            role,
            redirect_uri: redirectUri
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error('Token exchange failed:', errorData);
          throw new Error(errorData.message || 'Failed to exchange token');
        }

        const data = await tokenResponse.json();
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
        
        // Redirect based on role
        navigate(role === 'artist' ? '/artist/dashboard' : '/recruiter/dashboard');
      } catch (error: any) {
        console.error('Google OAuth error:', error);
        // You can add a toast notification here to show the error to the user
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      // You can add a toast notification here to show the error to the user
    },
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5 mr-3"
      />
      <span className="font-medium">Continue with Google</span>
    </button>
  );
}
