import { api } from '../api';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string; // index as string: "0","1","2","3"
  explanation?: string;
}

export interface Test {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  is_free: boolean;
  bundle_id: string;
  bundle_title: string;
  question_count: number;
  questions?: Question[];
  created_at: string;
}

export const testsApi = {
  list: async (bundle_id?: string): Promise<Test[]> => {
    const params = bundle_id ? { bundle_id } : {};
    const { data } = await api.get('/api/admin/tests', { params });
    return data.data;
  },

  get: async (id: string): Promise<Test> => {
    const { data } = await api.get(`/api/admin/tests/${id}`);
    return data.data;
  },

  create: async (payload: {
    title: string;
    subject: string;
    duration: number;
    is_free: boolean;
    bundle_id: string;
    questions: Question[];
  }): Promise<Test> => {
    const { data } = await api.post('/api/admin/tests', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<Test>): Promise<Test> => {
    const { data } = await api.put(`/api/admin/tests/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/tests/${id}`);
  },

  uploadCSV: async (test_id: string, file: File): Promise<{ uploaded: number; errors: string[] }> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/api/admin/tests/${test_id}/questions/upload-csv`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
