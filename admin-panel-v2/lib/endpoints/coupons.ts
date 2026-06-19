import { api } from '../api';

export interface Coupon {
  _id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  is_active: boolean;
  max_uses: number;
  used_count: number;
  expiry_date?: string | null;
  created_at: string;
}

export const couponsApi = {
  list: async (): Promise<Coupon[]> => {
    const { data } = await api.get('/api/admin/coupons');
    return data.data;
  },
  create: async (payload: Omit<Coupon, '_id' | 'used_count' | 'created_at'>): Promise<Coupon> => {
    const { data } = await api.post('/api/admin/coupons', payload);
    return data.data;
  },
  toggle: async (id: string): Promise<Coupon> => {
    const { data } = await api.patch(`/api/admin/coupons/${id}/toggle`);
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/coupons/${id}`);
  },
};