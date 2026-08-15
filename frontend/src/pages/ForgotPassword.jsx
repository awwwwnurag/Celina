import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-8 rounded-lg shadow-sm space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-burgundy/10 mb-4">
            <Mail size={26} className="text-brand-burgundy" />
          </div>
          <h2 className="font-display font-semibold text-2xl uppercase tracking-wider text-brand-burgundy dark:text-white">
            Forgot Password
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            Enter your email and we'll send a reset link
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">Check your inbox!</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                A password reset link has been sent to <strong>{email}</strong>.<br />
                The link is valid for <strong>10 minutes</strong>.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-brand-burgundy font-bold hover:underline"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2.5 rounded border border-red-200 dark:border-red-900">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="text-center pt-2 border-t border-brand-border dark:border-zinc-800">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-burgundy font-bold transition"
          >
            <ArrowLeft size={13} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
