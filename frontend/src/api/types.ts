export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  sku: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId?: number;
  category?: { id: number; name: string };
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  parentId?: number;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  section: string;
  sortOrder: number;
  isActive: boolean;
}

export interface StoreSettings {
  id: number;
  storeName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  whatsApp: string;
  facebook: string;
  instagram: string;
  tikTok: string;
  seoTitle: string;
  seoDescription: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
  phoneNumber?: string;
  userName?: string;
  roles?: string[];
}

export interface CheckoutResponse {
  orderId: number;
  paymentId: number;
  requestId: string;
  qiCardPaymentId: string;
  amount: number;
  status: string;
  formUrl: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

export interface Payment {
  id: number;
  orderId: number;
  status: string;
  amount: number;
  formUrl: string;
}

export interface Order {
  id: number;
  userId: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  payments: Payment[];
}

export interface Coupon {
  id: number;
  code: string;
  discountType: string;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  ordersToday: number;
  ordersMonth: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  salesChart: { date: string; revenue: number; orders: number }[];
  topProducts: { productId: number; name: string; quantitySold: number; revenue: number }[];
}

export interface Customer {
  id: string;
  userName?: string;
  phoneNumber?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
