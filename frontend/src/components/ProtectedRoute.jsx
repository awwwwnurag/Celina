import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SessionLoader = () => (
  <div className="flex items-center justify-center py-32">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-[3px] border-brand-burgundy border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
        Verifying session...
      </p>
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <SessionLoader />;

  if (!user) {
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <SessionLoader />;

  return user && user.role === 'Admin' ? <Outlet /> : <Navigate to="/home" replace />;
};
