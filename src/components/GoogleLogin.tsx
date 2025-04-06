import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

interface GoogleLoginProps {
  role: 'artist' | 'recruiter';
}

export default function GoogleLogin({ role }: GoogleLoginProps) {
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();

        // Get JWT token from our backend
        const backendResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenResponse.access_token,
            role,
          }),
        });

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json();
          throw new Error(errorData.message || 'Failed to authenticate with backend');
        }

        const data = await backendResponse.json();
        
        if (!data.token) {
          throw new Error('No token received from backend');
        }

        // Login with role and token
        await login({
          sub: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          role,
          token: data.token,
        });

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
