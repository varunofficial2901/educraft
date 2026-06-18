import { api } from '../api';

// ─── Students ────────────────────────────────────────────────────────────────
export interface Student {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  bundles: string[];
  joined: string;
  last_login?: string;
  provider: string;
}

export const studentsApi = {
  list: async (params?: { search?: string; page?: number; limit?: number }) => {
    const { data } = await api.get('/api/admin/students', { params });
    return data as { data: Student[]; pagination: { total: number; pages: number; page: number } };
  },

  toggle: async (id: string) => {
    const { data } = await api.patch(`/api/admin/students/${id}/toggle`);
    return data.data as { is_active: boolean };
  },

  delete: async (id: string) => {
    await api.delete(`/api/admin/students/${id}`);
  },
};

// ─── Enrollments ──────────────────────────────────────────────────────────────
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Enrollment {
  _id: string;
  student_name: string;
  email: string;
  bundle_id: string;
  bundle_title: string;
  amount: number;
  payment_status: PaymentStatus;
  access_active: boolean;
  created_at: string;
}

export const enrollmentsApi = {
  list: async (params?: { search?: string; payment_status?: string; page?: number; limit?: number }) => {
    const { data } = await api.get('/api/admin/enrollments', { params });
    return data as { data: Enrollment[]; pagination: { total: number; pages: number; page: number } };
  },

  updateStatus: async (id: string, payment_status: PaymentStatus) => {
    const { data } = await api.patch(`/api/admin/enrollments/${id}/status`, { payment_status });
    return data.data as Enrollment;
  },

  toggleAccess: async (id: string) => {
    const { data } = await api.patch(`/api/admin/enrollments/${id}/access`);
    return data.data as { access_active: boolean };
  },

  delete: async (id: string) => {
    await api.delete(`/api/admin/enrollments/${id}`);
  },
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const messagesApi = {
  list: async (params?: { search?: string; is_read?: boolean }) => {
    const { data } = await api.get('/api/admin/messages', { params });
    return data as { data: Message[]; unread_count: number };
  },

  markRead: async (id: string) => {
    await api.patch(`/api/admin/messages/${id}/read`);
  },

  markUnread: async (id: string) => {
    await api.patch(`/api/admin/messages/${id}/unread`);
  },

  delete: async (id: string) => {
    await api.delete(`/api/admin/messages/${id}`);
  },
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  get: async () => {
    const { data } = await api.get('/api/admin/analytics');
    return data as {
      bundle_analytics: {
        bundle_id: string;
        bundle_title: string;
        total_enrollments: number;
        paid_enrollments: number;
        revenue: number;
      }[];
      test_stats: {
        _id: string;
        title: string;
        subject: string;
        question_count: number;
        is_free: boolean;
      }[];
    };
  },

  dashboard: async () => {
    const { data } = await api.get('/api/admin/dashboard');
    return data as {
      stats: {
        total_students: number;
        total_bundles: number;
        total_tests: number;
        total_enrollments: number;
        paid_enrollments: number;
        total_revenue: number;
        unread_messages: number;
      };
      monthly_trend: { month: string; revenue: number; enrollments: number }[];
      bundle_stats: { bundle_id: string; bundle_title: string; count: number }[];
      recent_enrollments: {
        _id: string;
        student_name: string;
        email: string;
        payment_status: string;
        amount: number;
        bundle_title: string;
        created_at: string;
      }[];
    };
  },
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  updateProfile: async (payload: { name?: string; email?: string }) => {
    const { data } = await api.put('/api/admin/settings/profile', payload);
    return data.admin;
  },

  updatePassword: async (payload: { current_password: string; new_password: string }) => {
    const { data } = await api.put('/api/admin/settings/password', payload);
    return data;
  },
};
