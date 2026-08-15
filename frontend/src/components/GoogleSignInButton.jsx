import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

/**
 * GoogleSignInButton
 * Uses the "Authorization Code" flow with useGoogleLogin so we control
 * exactly when the popup opens (no forced render of Google's iframe button).
 */
export const GoogleSignInButton = ({ className = '' }) => {
  const { loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError('');
    try {
      // Exchange the access token for user info, then send credential to backend
      const { data: googleUser } = await axiosInstance.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      // Build a minimal credential object the backend can use
      // We'll POST the id_token — need to fetch it via token endpoint
      // Instead, send googleId + email + name + picture directly to a dedicated endpoint
      await loginWithGoogle({
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      });

      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign-in was cancelled or failed.')
  });

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-900">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-60 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition ${className}`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>
    </div>
  );
};

export default GoogleSignInButton;
