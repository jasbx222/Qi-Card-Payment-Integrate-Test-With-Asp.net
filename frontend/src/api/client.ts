import { USE_MOCK, FALLBACK_MOCK } from './config';
import { mockStoreApi, mockAdminApi } from './mockApi';
import { mockLoginOrThrow } from './demoAccounts';

const TOKEN_KEY = 'orbita_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.details || 'حدث خطأ');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function withMockFallback<T>(
  path: string,
  options: RequestInit,
  mockFn: () => Promise<T>,
): Promise<T> {
  if (USE_MOCK) return mockFn();
  try {
    return await api<T>(path, options);
  } catch (err) {
    if (import.meta.env.DEV && FALLBACK_MOCK) {
      console.warn(`[أوربيتا] API غير متاح (${path}) — بيانات تجريبية`);
      return mockFn();
    }
    throw err;
  }
}

export const authApi = {
  login: async (phoneNumber: string, password: string) => {
    if (USE_MOCK) return mockLoginOrThrow(phoneNumber, password);
    try {
      return await api<import('./types').LoginResponse>('/Login', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, password }),
      });
    } catch (err) {
      if (import.meta.env.DEV && FALLBACK_MOCK) {
        return mockLoginOrThrow(phoneNumber, password);
      }
      throw err;
    }
  },
  register: (username: string, phoneNumber: string, password: string) =>
    api<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ username, phoneNumber, password }),
    }),
};

export const storeApi = {
  getProducts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return withMockFallback(`/api/products${q}`, {}, () => mockStoreApi.getProducts(params));
  },
  getProduct: (id: number) =>
    withMockFallback(`/api/products/${id}`, {}, () => mockStoreApi.getProduct(id)),
  getCategories: () =>
    withMockFallback('/api/categories', {}, () => mockStoreApi.getCategories()),
  getBanners: (section?: string) =>
    withMockFallback(`/api/banners${section ? `?section=${section}` : ''}`, {}, () => mockStoreApi.getBanners(section)),
  getSettings: () =>
    withMockFallback('/api/settings', {}, () => mockStoreApi.getSettings()),
  checkout: (items: { productId: number; quantity: number }[]) =>
    api<import('./types').CheckoutResponse>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  finishOrder: (orderId: number) =>
    api(`/api/checkout/finish?orderId=${orderId}`),
  getMyOrders: () =>
    withMockFallback('/api/orders/my', {}, () => mockStoreApi.getMyOrders()),
  getMyOrder: (id: number) =>
    withMockFallback(`/api/orders/my/${id}`, {}, () => mockStoreApi.getMyOrder(id)),
};

export const adminApi = {
  dashboard: () =>
    withMockFallback('/api/admin/dashboard', {}, () => mockAdminApi.dashboard()),
  products: {
    list: () => withMockFallback('/api/admin/products', {}, () => mockAdminApi.products.list()),
    get: (id: number) => withMockFallback(`/api/admin/products/${id}`, {}, () => mockAdminApi.products.get(id)),
    create: (data: Partial<import('./types').Product>) =>
      api('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('./types').Product>) =>
      api(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/api/admin/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => withMockFallback('/api/admin/categories', {}, () => mockAdminApi.categories.list()),
    create: (data: Partial<import('./types').Category>) =>
      api('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('./types').Category>) =>
      api(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/api/admin/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: (status?: string) =>
      withMockFallback(`/api/admin/orders${status ? `?status=${status}` : ''}`, {}, () => mockAdminApi.orders.list()),
    get: (id: number) => api<import('./types').Order>(`/api/admin/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      api(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    delete: (id: number) => api(`/api/admin/orders/${id}`, { method: 'DELETE' }),
  },
  customers: () => withMockFallback('/api/admin/customers', {}, () => mockAdminApi.customers()),
  coupons: {
    list: () => withMockFallback('/api/admin/coupons', {}, () => mockAdminApi.coupons.list()),
    create: (data: Partial<import('./types').Coupon>) =>
      api('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('./types').Coupon>) =>
      api(`/api/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/api/admin/coupons/${id}`, { method: 'DELETE' }),
  },
  banners: {
    list: () => withMockFallback('/api/admin/banners', {}, () => mockAdminApi.banners.list()),
    create: (data: Partial<import('./types').Banner>) =>
      api('/api/admin/banners', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('./types').Banner>) =>
      api(`/api/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/api/admin/banners/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => withMockFallback('/api/admin/settings', {}, () => mockAdminApi.settings.get()),
    update: (data: Partial<import('./types').StoreSettings>) =>
      api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export function formatPrice(n: number) {
  return new Intl.NumberFormat('ar-IQ', { style: 'decimal' }).format(n) + ' د.ع';
}
