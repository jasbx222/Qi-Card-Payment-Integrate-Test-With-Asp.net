import type { LoginResponse } from './types';

/** حسابات تجريبية — نفسها في الـ backend (DataSeeder) */
export const DEMO_ACCOUNTS = {
  admin: {
    label: 'قائد المحطة (أدمن)',
    phone: '07700000001',
    password: 'Admin@123',
    userName: 'admin',
    roles: ['Admin'] as const,
  },
  customer: {
    label: 'مسافر (عميل)',
    phone: '07700000002',
    password: 'User@123',
    userName: 'مسافر',
    roles: ['Customer'] as const,
  },
} as const;

export const DEMO_ACCOUNT_LIST = [DEMO_ACCOUNTS.admin, DEMO_ACCOUNTS.customer];

export type DemoAccount = (typeof DEMO_ACCOUNT_LIST)[number];

export function mockLogin(phoneNumber: string, password: string): LoginResponse {
  const account = DEMO_ACCOUNT_LIST.find(
    (a) => a.phone === phoneNumber.trim() && a.password === password,
  );
  if (!account) {
    return { isSuccess: false, message: 'رقم الهاتف أو كلمة المرور غير صحيحة' };
  }
  return {
    isSuccess: true,
    token: `mock-orbita-${account.roles[0].toLowerCase()}`,
    phoneNumber: account.phone,
    userName: account.userName,
    roles: [...account.roles],
  };
}

export function mockLoginOrThrow(phoneNumber: string, password: string): LoginResponse {
  const res = mockLogin(phoneNumber, password);
  if (!res.isSuccess || !res.token) throw new Error(res.message || 'فشل تسجيل الدخول');
  return res;
}
