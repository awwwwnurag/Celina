import axios from 'axios';

const axiosInstance = axios.create();

// ── REQUEST INTERCEPTOR ────────────────────────────────────────────────────────
// Automatically attach Authorization header from localStorage on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('evara_user_info');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (_) {
        // Malformed storage — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────────
// On 401 (token expired / invalid), clear auth state and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('evara_user_info');
      // Preserve the current path so user lands back after re-login
      const currentPath = window.location.pathname;
      const loginPath =
        currentPath && currentPath !== '/login'
          ? `/login?redirect=${encodeURIComponent(currentPath)}`
          : '/login';
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
