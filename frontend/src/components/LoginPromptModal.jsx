import React, { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { X, Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

export const LoginPromptModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, loginWithGoogle } = useContext(AuthContext);

  console.log("LoginPromptModal rendering, isOpen:", isOpen);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Success Handler
  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setGoogleError('');
    try {
      // Exchange the access token for user info
      const { data: googleUser } = await axiosInstance.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      // Log in on backend
      await loginWithGoogle({
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setGoogleError(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setGoogleError('Google sign-in was cancelled or failed.')
  });

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-brand-border dark:border-zinc-800 z-10 transform scale-95 animate-zoomIn flex flex-col">
        
        {/* Top Banner (Dark Navy Wavy Gradient with Bag) */}
        <div className="relative h-44 bg-gradient-to-r from-slate-950 via-zinc-900 to-indigo-950 px-6 py-8 flex items-center justify-between overflow-hidden border-b border-zinc-800">
          {/* Subtle wavy vector background overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" className="text-indigo-500" />
            </svg>
          </div>

          {/* Heading text (Left) */}
          <div className="relative z-10 max-w-[200px] space-y-2">
            <h3 className="font-Poppins font-black text-xl text-white uppercase tracking-wide leading-tight">
              Ready to add this to your bag?
            </h3>
            {/* Sparkle icon style indicator */}
            <div className="flex gap-1 text-indigo-400">
              <span className="animate-pulse text-xs">✦</span>
              <span className="animate-pulse delay-75 text-sm">✦</span>
            </div>
          </div>

          {/* Bag Image (Right) */}
          <div className="relative z-10 w-36 h-36 flex-shrink-0 flex items-center justify-center translate-y-2">
            <img 
              src="/assets/img/login_bag.png" 
              alt="Luxury purse" 
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" 
            />
          </div>

          {/* Close button in top-left */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
          <div className="text-center sm:text-left">
            <h4 className="font-Poppins font-bold text-lg text-black dark:text-white uppercase tracking-wide">
              Log in or sign up
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Get personalised suggestions, offers & more
            </p>
          </div>

          {/* Error messages */}
          {error && (
            <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2.5 rounded border border-red-200 dark:border-red-900 animate-shake">
              {error}
            </p>
          )}
          {googleError && (
            <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2.5 rounded border border-red-200 dark:border-red-900 animate-shake">
              {googleError}
            </p>
          )}

          {/* Inline Email/Password Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full text-sm p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 rounded-lg outline-none focus:border-brand-burgundy text-brand-dark dark:text-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm p-3 pr-10 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 rounded-lg outline-none focus:border-brand-burgundy text-brand-dark dark:text-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isFormValid 
                  ? 'bg-brand-burgundy text-white hover:bg-opacity-95 hover:shadow-md' 
                  : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          </div>

          {/* Custom Google Sign-In Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 disabled:opacity-60 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Registration Redirect info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 font-semibold border-t border-brand-border dark:border-zinc-800/80 pt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-brand-burgundy dark:text-red-400 font-bold hover:underline">
              Register
            </a>
          </div>

          {/* Privacy Policy disclaimer */}
          <p className="text-[10px] text-center text-gray-400 leading-normal max-w-[280px] mx-auto">
            By continuing, I agree to Celina's{' '}
            <a href="/terms" className="text-brand-burgundy dark:text-red-450 underline font-semibold">Terms & Conditions</a>{' '}
            and{' '}
            <a href="/privacy" className="text-brand-burgundy dark:text-red-450 underline font-semibold">Privacy Policy</a>.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoomIn {
          animation: zoomIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .backdrop-blur-xs {
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
};

export default LoginPromptModal;
