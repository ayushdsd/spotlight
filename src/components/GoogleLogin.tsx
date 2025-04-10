import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GoogleLoginProps {
  role: 'artist' | 'recruiter';
}

export default function GoogleLogin({ role }: GoogleLoginProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173',
    onSuccess: async (codeResponse) => {
      try {
        console.log('Google OAuth success:', { 
          code: codeResponse.code, 
          role,
          client_id: role === 'artist' 
            ? import.meta.env.VITE_GOOGLE_ARTIST_CLIENT_ID 
            : import.meta.env.VITE_GOOGLE_RECRUITER_CLIENT_ID
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
          }),
        });

        const data = await tokenResponse.json();
        console.log('Server response:', data);

        if (!tokenResponse.ok) {
          console.error('Server error:', data);
          throw new Error(data.message || 'Failed to exchange code for token');
        }

        if (!data.token || !data.user) {
          console.error('Invalid server response:', data);
          throw new Error('Invalid response from server');
        }

        console.log('Attempting login with:', {
          sub: data.user._id,
          name: data.user.name,
          email: data.user.email,
          picture: data.user.profilePicture,
          role: data.user.role,
          token: data.token ? 'present' : 'missing'
        });

        // Login with role and token
        await login({
          sub: data.user._id,
          name: data.user.name,
          email: data.user.email,
          picture: data.user.profilePicture,
          role: data.user.role,
          token: data.token,
        });

        console.log('Login successful, navigating to dashboard');

        // Redirect to the appropriate dashboard
        if (role === 'artist') {
          navigate('/artist/dashboard');
        } else if (role === 'recruiter') {
          navigate('/recruiter/dashboard');
        }

      } catch (error) {
        console.error('Login error:', error);
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
