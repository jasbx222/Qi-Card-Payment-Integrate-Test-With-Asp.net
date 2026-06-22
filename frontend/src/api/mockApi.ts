import {
  mockProducts, mockCategories, mockBanners, mockSettings,
  mockCoupons, mockCustomers, mockOrders, mockDashboard,
  filterMockProducts,
} from './mockData';
import type { Product } from './types';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

export const mockStoreApi = {
  getProducts: async (params?: Record<string, string>) => {
    await delay();
    return filterMockProducts(params);
  },
  getProduct: async (id: number) => {
    await delay();
    const p = mockProducts.find((x) => x.id === id);
    if (!p) throw new Error('المنتج غير موجود');
    return p;
  },
  getCategories: async () => { await delay(); return mockCategories; },
  getBanners: async (section?: string) => {
    await delay();
    return section ? mockBanners.filter((b) => b.section === section) : mockBanners;
  },
  getSettings: async () => { await delay(); return mockSettings; },
  getMyOrders: async () => { await delay(); return mockOrders; },
  getMyOrder: async (id: number) => {
    await delay();
    const o = mockOrders.find((x) => x.id === id);
    if (!o) throw new Error('المهمة غير موجودة');
    return o;
  },
};

export const mockAdminApi = {
  dashboard: async () => { await delay(); return mockDashboard; },
  products: {
    list: async () => { await delay(); return mockProducts as Product[]; },
    get: async (id: number) => mockStoreApi.getProduct(id),
  },
  categories: { list: async () => { await delay(); return mockCategories; } },
  orders: { list: async () => { await delay(); return mockOrders; } },
  customers: async () => { await delay(); return mockCustomers; },
  coupons: { list: async () => { await delay(); return mockCoupons; } },
  banners: { list: async () => { await delay(); return mockBanners; } },
  settings: { get: async () => { await delay(); return mockSettings; } },
};
