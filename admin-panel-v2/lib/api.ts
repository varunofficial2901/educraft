import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Attach JWT to every request ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('edu_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auto-logout on 401 ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('edu_admin_token');
      localStorage.removeItem('edu_admin');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export function getErrorMsg(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.detail || err.response?.data?.message || err.message;
  }
  return 'Something went wrong';
}
