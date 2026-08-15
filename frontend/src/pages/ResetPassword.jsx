import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength indicator
  const getStrength = (pw) => {
    if (!pw) return { label: '', color: '' };
    if (pw.length < 6) return { label: 'Too short', color: 'text-red-500' };
    if (pw.length < 9) return { label: 'Fair', color: 'text-amber-500' };
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.match(/[^a-zA-Z0-9]/)) {
      return { label: 'Strong', color: 'text-green-500' };
    }
    return { label: 'Good', color: 'text-blue-500' };
  };
  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/api/auth/reset-password/${token}`, { newPassword });
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or has expired.');
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
            <Lock size={26} className="text-brand-burgundy" />
          </div>
          <h2 className="font-display font-semibold text-2xl uppercase tracking-wider text-brand-burgundy dark:text-white">
            Set New Password
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            Create a strong password for your account
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">Password Updated!</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Your password has been reset successfully.<br />
                Redirecting you to login...
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block bg-brand-burgundy text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950 p-2.5 rounded border border-red-200 dark:border-red-900">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full text-sm p-3 pr-10 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword && (
                  <p className={`text-xs font-bold ${strength.color}`}>
                    Strength: {strength.label}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 font-bold">Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-green-500 font-bold">✓ Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
