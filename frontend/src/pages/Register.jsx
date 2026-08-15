import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-8 rounded-lg shadow-sm space-y-6">
        
        <div className="text-center">
          <h2 className="font-display font-semibold text-2xl uppercase tracking-wider text-brand-burgundy dark:text-white">
            Register Account
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Join the Celina Clothing Community</p>
        </div>

        {error && <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2.5 rounded border border-red-200 dark:border-red-900">{error}</p>}

        {/* Google Sign-Up */}
        <GoogleSignInButton />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-border dark:bg-zinc-700" />
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-brand-border dark:bg-zinc-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500">First & Last Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Sharma"
              className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. anjali@gmail.com"
              className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm p-3 pr-10 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm p-3 pr-10 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 font-semibold border-t border-brand-border dark:border-zinc-800 pt-4">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="text-brand-burgundy font-bold hover:underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Register;
