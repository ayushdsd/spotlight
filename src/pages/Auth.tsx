import { useState, useEffect } from 'react';
import { Link, useSearchParams, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '../components/GoogleLogin';
import LoginAnimation from '../components/auth/LoginAnimation';

const ARTIST_CLIENT_ID = import.meta.env.VITE_GOOGLE_ARTIST_CLIENT_ID || '';
const RECRUITER_CLIENT_ID = import.meta.env.VITE_GOOGLE_RECRUITER_CLIENT_ID || '';

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'artist' | 'recruiter'>(() => {
    // Try to get role from localStorage
    const savedRole = localStorage.getItem('selectedRole');
    return (savedRole === 'artist' || savedRole === 'recruiter') ? savedRole : 'artist';
  });

  // Save selected role to localStorage
  useEffect(() => {
    localStorage.setItem('selectedRole', selectedRole);
  }, [selectedRole]);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-cream-200 p-8">
        {/* Login Animation */}
        <div className="mb-6">
          <LoginAnimation />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-minimal font-bold text-blue-900 mb-2">Welcome to Spotlight</h1>
          <p className="text-blue-700">Sign in to continue to your dashboard</p>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('artist')}
                className={`p-4 rounded-lg border transition-all font-semibold ${
                  selectedRole === 'artist'
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow'
                    : 'border-cream-200 text-gray-600 hover:bg-cream-100'
                }`}
              >
                <span className="block text-2xl mb-2">👤</span>
                <span className="font-medium">Artist</span>
              </button>
              <button
                onClick={() => setSelectedRole('recruiter')}
                className={`p-4 rounded-lg border transition-all font-semibold ${
                  selectedRole === 'recruiter'
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow'
                    : 'border-cream-200 text-gray-600 hover:bg-cream-100'
                }`}
              >
                <span className="block text-2xl mb-2">🏢</span>
                <span className="font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {/* Google Sign In */}
          <div>
            <GoogleOAuthProvider 
              clientId={selectedRole === 'artist' ? ARTIST_CLIENT_ID : RECRUITER_CLIENT_ID}
            >
              <GoogleLogin role={selectedRole} />
            </GoogleOAuthProvider>
          </div>

          {/* Terms and Privacy */}
          <p className="text-sm text-blue-700 text-center">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Auth() {
  const [searchParams] = useSearchParams();

  // Handle OAuth redirect
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      return;
    }

    if (code) {
      console.log('Received authorization code:', code);
      // The code will be handled by @react-oauth/google automatically
      // We just need to ensure the role is preserved during the redirect
      const savedRole = localStorage.getItem('selectedRole');
      if (savedRole === 'artist' || savedRole === 'recruiter') {
        // Role is already saved in localStorage
        console.log('Using saved role:', savedRole);
      }
    }
  }, [searchParams]);

  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
