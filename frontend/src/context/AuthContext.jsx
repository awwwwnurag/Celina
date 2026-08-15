import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while validating stored token

  // On mount: load from localStorage, then re-validate token with the server
  useEffect(() => {
    const validateToken = async () => {
      const stored = localStorage.getItem('evara_user_info');
      if (!stored) {
        setLoading(false);
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(stored);
      } catch (_) {
        localStorage.removeItem('evara_user_info');
        setLoading(false);
        return;
      }

      if (!parsed?.token) {
        setLoading(false);
        return;
      }

      try {
        // Re-validate the stored JWT with the server
        const { data } = await axiosInstance.get('/api/auth/me');
        // Merge fresh server data with stored token
        const freshUser = { ...parsed, ...data };
        setUser(freshUser);
        localStorage.setItem('evara_user_info', JSON.stringify(freshUser));
      } catch (_) {
        // Token is invalid or expired — the interceptor in axiosInstance
        // will redirect to /login automatically on 401; we just clear state here.
        setUser(null);
        localStorage.removeItem('evara_user_info');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('evara_user_info', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/api/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('evara_user_info', JSON.stringify(data));
    return data;
  };

  const loginWithGoogle = async (userInfo) => {
    // userInfo = { googleId, email, name, picture }  — fetched from Google userinfo endpoint
    const { data } = await axiosInstance.post('/api/auth/google', userInfo);
    setUser(data);
    localStorage.setItem('evara_user_info', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (_) {
      // Even if server logout fails, clear local state
    }
    setUser(null);
    localStorage.removeItem('evara_user_info');
  };

  const updateProfile = async (profileData) => {
    const { data } = await axiosInstance.put('/api/users/profile', profileData);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('evara_user_info', JSON.stringify(updatedUser));
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
