import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

interface GoogleLoginProps {
  role: 'artist' | 'recruiter';
}

export default function GoogleLogin({ role }: GoogleLoginProps) {
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        console.log('Google OAuth success:', { code: codeResponse.code, role });
        
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

        if (!tokenResponse.ok) {
          throw new Error(data.message || 'Failed to exchange code for token');
        }

        if (!data.token || !data.userInfo) {
          throw new Error('Invalid response from server');
        }

        // Login with role and token
        await login({
          sub: data.userInfo.sub,
          name: data.userInfo.name,
          email: data.userInfo.email,
          picture: data.userInfo.picture,
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
    flow: 'auth-code',
    redirect_uri: 'https://spotlight-frontend.vercel.app',
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
