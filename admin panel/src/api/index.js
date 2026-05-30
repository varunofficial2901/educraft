import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edu_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edu_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:          (data) => api.post('/admin/login', data),
  me:             ()     => api.get('/v1/auth/me'),
  updateProfile:  (data) => api.put('/admin/auth/update-profile', data),
  changePassword: (data) => api.put('/v1/auth/change-password', data),
};

export const dashboardAPI = {
  get: () => api.get('/admin/dashboard'),
};

export const coursesAPI = {
  getAll:       ()         => api.get('/admin/courses'),
  getOne:       (id)       => api.get(`/admin/courses/${id}`),
  create:       (fd)       => api.post('/admin/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:       (id, fd)   => api.put(`/admin/courses/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleStatus: (id)       => api.patch(`/admin/courses/${id}/toggle-status`),
  delete:       (id)       => api.delete(`/admin/courses/${id}`),
};

export const papersAPI = {
  getAll:           (courseId) => api.get('/admin/papers', { params: courseId ? { course: courseId } : {} }),
  create:           (fd)       => api.post('/admin/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:           (id, fd)   => api.put(`/admin/papers/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleVisibility: (id)       => api.patch(`/admin/papers/${id}/toggle-visibility`),
  delete:           (id)       => api.delete(`/admin/papers/${id}`),
};

export const enrollmentsAPI = {
  getAll:        (params) => api.get('/admin/enrollments', { params }),
  updatePayment: (id, paymentStatus) => api.patch(`/admin/enrollments/${id}/payment`, { paymentStatus }),
  delete:        (id)     => api.delete(`/admin/enrollments/${id}`),
};

export const studentsAPI = {
  getCourses:  ()                 => api.get('/admin/students'),
  getByCourse: (courseId, params) => api.get(`/admin/students/course/${courseId}`, { params }),
};

export const messagesAPI = {
  getAll:     (params) => api.get('/admin/messages', { params }),
  markRead:   (id)     => api.patch(`/admin/messages/${id}/read`),
  markUnread: (id)     => api.patch(`/admin/messages/${id}/unread`),
  delete:     (id)     => api.delete(`/admin/messages/${id}`),
};

export default api;

export const testsAPI = {
  getBycourse: (courseId) => api.get(`/admin/tests/course/${courseId}`),
  create:      (data)     => api.post('/admin/tests', data),
  getOne:      (id)       => api.get(`/admin/tests/${id}`),
  delete:      (id)       => api.delete(`/admin/tests/${id}`),
};

export const bundlesAPI = {
  getByCourse: (courseId)           => api.get(`/admin/bundles/course/${courseId}`),
  create:      (fd)                 => api.post('/admin/bundles', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne:      (id)                 => api.get(`/admin/bundles/${id}`),
  delete:      (id)                 => api.delete(`/admin/bundles/${id}`),
  uploadCSV:   (bundleId, fd)       => api.post(`/admin/bundles/${bundleId}/papers/upload-csv`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePaper: (bundleId, paperId)  => api.delete(`/admin/bundles/${bundleId}/papers/${paperId}`),
};









// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach JWT token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('edu_admin_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Handle 401 globally
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('edu_admin_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// // ─── Auth ──────────────────────────────────────────────────────────────────────
// export const authAPI = {
//   login: (data) => api.post('/admin/login', data),
//   me: () => api.get('/v1/auth/me'),
//   updateProfile: (data) => api.put('/admin/auth/update-profile', data),
//   changePassword: (data) => api.put('/v1/auth/change-password', data),
// };

// // ─── Dashboard ─────────────────────────────────────────────────────────────────
// export const dashboardAPI = {
//   get: () => api.get('/dashboard'),
// };

// // ─── Courses ───────────────────────────────────────────────────────────────────
// export const coursesAPI = {
//   getAll: () => api.get('/courses'),
//   getOne: (id) => api.get(`/courses/${id}`),
//   create: (formData) => api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, formData) => api.put(`/courses/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   toggleStatus: (id) => api.patch(`/courses/${id}/toggle-status`),
//   delete: (id) => api.delete(`/courses/${id}`),
// };

// // ─── Papers ────────────────────────────────────────────────────────────────────
// export const papersAPI = {
//   getAll: (courseId) => api.get('/papers', { params: courseId ? { course: courseId } : {} }),
//   create: (formData) => api.post('/papers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, formData) => api.put(`/papers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   toggleVisibility: (id) => api.patch(`/papers/${id}/toggle-visibility`),
//   reorder: (orders) => api.patch('/papers/reorder/batch', { orders }),
//   delete: (id) => api.delete(`/papers/${id}`),
// };

// // ─── Enrollments ───────────────────────────────────────────────────────────────
// export const enrollmentsAPI = {
//   getAll: (params) => api.get('/enrollments', { params }),
//   updatePayment: (id, paymentStatus) => api.patch(`/enrollments/${id}/payment`, { paymentStatus }),
//   delete: (id) => api.delete(`/enrollments/${id}`),
// };

// // ─── Students ──────────────────────────────────────────────────────────────────
// export const studentsAPI = {
//   getCourses: () => api.get('/students'),
//   getByCourse: (courseId, params) => api.get(`/students/course/${courseId}`, { params }),
// };

// // ─── Messages ──────────────────────────────────────────────────────────────────
// export const messagesAPI = {
//   getAll: (params) => api.get('/messages', { params }),
//   markRead: (id) => api.patch(`/messages/${id}/read`),
//   markUnread: (id) => api.patch(`/messages/${id}/unread`),
//   delete: (id) => api.delete(`/messages/${id}`),
// };

// export default api;
