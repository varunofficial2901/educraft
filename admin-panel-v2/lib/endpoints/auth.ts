import { api } from '../api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    // Backend returns { token, admin } — NOT access_token
    const { data } = await api.post('/api/admin/login', { email, password });
    return data as { token: string; admin: AdminUser };
  },
};

export function saveAdminSession(token: string, admin: AdminUser) {
  localStorage.setItem('edu_admin_token', token);
  localStorage.setItem('edu_admin', JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem('edu_admin_token');
  localStorage.removeItem('edu_admin');
}

export function getAdminFromStorage(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('edu_admin');
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('edu_admin_token');
}
