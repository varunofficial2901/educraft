export { api, getErrorMsg } from './api';
export { useApi, useMutation } from './hooks';

export { authApi, saveAdminSession, clearAdminSession, getAdminFromStorage, isLoggedIn } from './endpoints/auth';
export type { AdminUser } from './endpoints/auth';

export { bundlesApi } from './endpoints/bundles';
export type { Bundle } from './endpoints/bundles';

export { testsApi } from './endpoints/tests';
export type { Test, Question } from './endpoints/tests';

export { studentsApi, enrollmentsApi, messagesApi, analyticsApi, settingsApi } from './endpoints/others';
export type { Student, Enrollment, PaymentStatus, Message } from './endpoints/others';

export { couponsApi } from './endpoints/coupons';
export type { Coupon } from './endpoints/coupons';
