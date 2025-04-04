import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '../components/GoogleLogin';
import LoginAnimation from '../components/auth/LoginAnimation';

const ARTIST_CLIENT_ID = import.meta.env.VITE_GOOGLE_ARTIST_CLIENT_ID || '';
const RECRUITER_CLIENT_ID = import.meta.env.VITE_GOOGLE_RECRUITER_CLIENT_ID || '';

export default function Auth() {
  const [selectedRole, setSelectedRole] = useState<'artist' | 'recruiter'>('artist');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Login Animation */}
        <div className="mb-6">
          <LoginAnimation />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2">Welcome to Spotlight</h1>
          <p className="text-gray-600">Sign in to continue to your dashboard</p>
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
                className={`p-4 rounded-lg border transition-all ${
                  selectedRole === 'artist'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="block text-2xl mb-2">👤</span>
                <span className="font-medium">Artist</span>
              </button>
              <button
                onClick={() => setSelectedRole('recruiter')}
                className={`p-4 rounded-lg border transition-all ${
                  selectedRole === 'recruiter'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="block text-2xl mb-2">🏢</span>
                <span className="font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {/* Google Login */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleOAuthProvider 
                clientId={selectedRole === 'artist' ? ARTIST_CLIENT_ID : RECRUITER_CLIENT_ID}
              >
                <GoogleLogin role={selectedRole} />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
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
  );
}
