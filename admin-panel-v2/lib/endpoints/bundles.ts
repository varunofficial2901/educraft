import { api } from '../api';

export interface Bundle {
  _id: string;
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  points: string[];
  test_count: number;
  enroll_count: number;
  created_at: string;
}

export const bundlesApi = {
  list: async (): Promise<Bundle[]> => {
    const { data } = await api.get('/api/admin/bundles');
    return data.data;
  },

  create: async (payload: Omit<Bundle, '_id' | 'test_count' | 'enroll_count' | 'created_at'>): Promise<Bundle> => {
    const { data } = await api.post('/api/admin/bundles', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<Bundle>): Promise<Bundle> => {
    const { data } = await api.put(`/api/admin/bundles/${id}`, payload);
    return data.data;
  },

  toggle: async (id: string): Promise<Bundle> => {
    const { data } = await api.patch(`/api/admin/bundles/${id}/toggle`);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/bundles/${id}`);
  },
};
