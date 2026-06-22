/**
 * بيانات تجريبية — تستخدم نفس مصدر الصور في lib/images.ts
 */
import type {
  Product, Category, Banner, StoreSettings,
  Order, Coupon, Customer, DashboardStats,
} from './types';
import {
  PRODUCT_IMAGES, CATEGORY_IMAGES, bannerImage, productImage,
} from '../lib/images';

const cat = (id: number, name: string, slug: string, desc: string, count: number): Category => ({
  id, name, description: desc, slug,
  imageUrl: CATEGORY_IMAGES[slug] || `/images/categories/${slug.split('-')[0]}.svg`,
  sortOrder: id, isActive: true, productCount: count,
});

export const mockCategories: Category[] = [
  cat(1, 'شخصيات', 'characters', 'شخصيات كارتونية من مجرات بعيدة', 4),
  cat(2, 'ألعاب', 'toys', 'ألعاب فضائية ومغامرات', 6),
  cat(3, 'إكسسوارات', 'accessories', 'إكسسوارات بتصميم كوني', 5),
  cat(4, 'ملصقات وفن', 'stickers-art', 'ملصقات ولوحات فنية', 4),
  cat(5, 'حزم هدايا', 'gift-bundles', 'مجموعات جاهزة للإهداء', 3),
  cat(6, 'إسقاطات محدودة', 'limited-drops', 'إصدارات حصرية لفترة قصيرة', 3),
];

type Raw = Omit<Product, 'id' | 'category'> & { id: number; categoryName: string };

const RAW: Raw[] = [
  { id: 1, sku: 'ORB-001', name: 'أسترو بير الفضائي', slug: 'astro-bear', description: 'شخصية دبدوب فضائي ناعمة', categoryId: 1, categoryName: 'شخصيات', price: 350000, compareAtPrice: 400000, stockQuantity: 50, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 2, sku: 'ORB-002', name: 'روبوت نجمة', slug: 'star-robot', description: 'روبوت كارتوني بإضاءة LED', categoryId: 2, categoryName: 'ألعاب', price: 280000, stockQuantity: 30, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 3, sku: 'ORB-003', name: 'سماعات المدار', slug: 'orbit-headphones', description: 'سماعات لاسلكية فضائية', categoryId: 3, categoryName: 'إكسسوارات', price: 45000, compareAtPrice: 60000, stockQuantity: 100, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 4, sku: 'ORB-004', name: 'شاحن النجوم', slug: 'star-charger', description: 'شاحن سريع 65 واط', categoryId: 3, categoryName: 'إكسسوارات', price: 25000, stockQuantity: 200, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 5, sku: 'ORB-005', name: 'حقيبة الكوكب', slug: 'planet-bag', description: 'حقيبة ظهر كارتونية', categoryId: 3, categoryName: 'إكسسوارات', price: 55000, stockQuantity: 40, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 6, sku: 'ORB-006', name: 'مجموعة المجرة', slug: 'galaxy-set', description: 'طقم ألعاب فضائية ١٢ قطعة', categoryId: 2, categoryName: 'ألعاب', price: 120000, compareAtPrice: 150000, stockQuantity: 25, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 7, sku: 'ORB-007', name: 'قطة القمر', slug: 'moon-cat', description: 'قط كارتوني بذيل مضيء', categoryId: 1, categoryName: 'شخصيات', price: 420000, compareAtPrice: 480000, stockQuantity: 15, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 8, sku: 'ORB-008', name: 'طائرة النيزك', slug: 'meteor-plane', description: 'طائرة ورقية بتصميم نيزك', categoryId: 2, categoryName: 'ألعاب', price: 18000, stockQuantity: 80, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 9, sku: 'ORB-009', name: 'مجموعة ملصقات المجرة', slug: 'galaxy-stickers', description: '٥٠ ملصقاً فضائياً', categoryId: 4, categoryName: 'ملصقات وفن', price: 12000, stockQuantity: 150, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 10, sku: 'ORB-010', name: 'لوحة كوكب أوربيتا', slug: 'orbita-poster', description: 'لوحة فنية A3', categoryId: 4, categoryName: 'ملصقات وفن', price: 35000, compareAtPrice: 45000, stockQuantity: 60, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 11, sku: 'ORB-011', name: 'حزمة المغامر الصغير', slug: 'adventurer-bundle', description: 'شخصية + لعبة + ملصقات', categoryId: 5, categoryName: 'حزم هدايا', price: 185000, compareAtPrice: 220000, stockQuantity: 20, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 12, sku: 'ORB-012', name: 'حزمة عيد الميلاد الفضائية', slug: 'birthday-space-bundle', description: 'تغليف فضائي + ٣ كنوز', categoryId: 5, categoryName: 'حزم هدايا', price: 250000, stockQuantity: 12, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 13, sku: 'ORB-013', name: 'تنين المشتري', slug: 'jupiter-dragon', description: 'تنين كارتوني نادر', categoryId: 6, categoryName: 'إسقاطات محدودة', price: 550000, compareAtPrice: 650000, stockQuantity: 8, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 14, sku: 'ORB-014', name: 'خوذة رائد الفضاء', slug: 'astronaut-helmet', description: 'خوذة لعب بتأثيرات صوتية', categoryId: 2, categoryName: 'ألعاب', price: 95000, stockQuantity: 35, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 15, sku: 'ORB-015', name: 'مصباح الكوكب', slug: 'planet-lamp', description: 'مصباح ليلي كوكب زحل', categoryId: 3, categoryName: 'إكسسوارات', price: 78000, compareAtPrice: 95000, stockQuantity: 45, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 16, sku: 'ORB-016', name: 'وحيد القرن النجمي', slug: 'star-unicorn', description: 'شخصية بريش متلألئ', categoryId: 1, categoryName: 'شخصيات', price: 390000, stockQuantity: 22, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 17, sku: 'ORB-017', name: 'لعبة بناء الفضاء', slug: 'space-blocks', description: 'مجموعة بناء ٨٤ قطعة', categoryId: 2, categoryName: 'ألعاب', price: 145000, compareAtPrice: 175000, stockQuantity: 18, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 18, sku: 'ORB-018', name: 'قلم مضيء', slug: 'glow-pen', description: 'طقم ٦ أقلام فضائية', categoryId: 3, categoryName: 'إكسسوارات', price: 15000, stockQuantity: 3, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 19, sku: 'ORB-019', name: 'بطاقات شخصيات أوربيتا', slug: 'character-cards', description: '٢٤ بطاقة نادرة', categoryId: 4, categoryName: 'ملصقات وفن', price: 28000, stockQuantity: 70, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 20, sku: 'ORB-020', name: 'حزمة الأخوة الفضائية', slug: 'siblings-bundle', description: 'حزمتان شخصيتين', categoryId: 5, categoryName: 'حزم هدايا', price: 320000, compareAtPrice: 380000, stockQuantity: 10, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 21, sku: 'ORB-021', name: 'محطة أوربيتا المصغّرة', slug: 'mini-station', description: 'مجسم محطة — إصدار ١/٥٠٠', categoryId: 6, categoryName: 'إسقاطات محدودة', price: 890000, stockQuantity: 5, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 22, sku: 'ORB-022', name: 'دبّ الفضاء الذهبي', slug: 'golden-space-bear', description: 'إصدار ذهبي محدود', categoryId: 6, categoryName: 'إسقاطات محدودة', price: 720000, compareAtPrice: 850000, stockQuantity: 4, isActive: true, isFeatured: true, imageUrl: '' },
  { id: 23, sku: 'ORB-023', name: 'مجموعة ألوان المجرة', slug: 'galaxy-colors', description: '٢٤ لون مائي', categoryId: 4, categoryName: 'ملصقات وفن', price: 42000, stockQuantity: 55, isActive: true, isFeatured: false, imageUrl: '' },
  { id: 24, sku: 'ORB-024', name: 'روبوت القمر الصغير', slug: 'moon-bot-mini', description: 'روبوت يمشي ويضيء', categoryId: 2, categoryName: 'ألعاب', price: 165000, compareAtPrice: 195000, stockQuantity: 28, isActive: true, isFeatured: true, imageUrl: '' },
];

export const mockProducts: Product[] = RAW.map((p) => ({
  ...p,
  imageUrl: productImage(p.sku, PRODUCT_IMAGES[p.sku]),
  category: { id: p.categoryId!, name: p.categoryName },
}));

export const mockBanners: Banner[] = [
  { id: 1, title: 'ادخل بوابة أوربيتا', subtitle: 'عالم كارتوني حيّ بين النجوم', imageUrl: bannerImage('hero'), ctaText: 'ابدأ الاستكشاف', ctaLink: '/products', section: 'hero', sortOrder: 1, isActive: true },
  { id: 2, title: 'الكنز الأسطوري', subtitle: 'تنين المشتري — اكتشاف الأسبوع', imageUrl: bannerImage('featured'), ctaText: 'اكتشف الآن', ctaLink: '/products/13', section: 'featured', sortOrder: 1, isActive: true },
  { id: 3, title: 'نافذة الصيف الفضائية', subtitle: 'خصم ٢٠٪ على مختارات المجرة', imageUrl: bannerImage('event'), ctaText: 'ادخل الحدث', ctaLink: '/drops', section: 'event', sortOrder: 1, isActive: true },
  { id: 4, title: 'حزم هدايا جاهزة', subtitle: 'تغليف فضائي مميز', imageUrl: bannerImage('editorial'), ctaText: 'استكشف الحزم', ctaLink: '/collections', section: 'editorial', sortOrder: 1, isActive: true },
];

export const mockSettings: StoreSettings = {
  id: 1, storeName: 'أوربيتا', tagline: 'مجرّة الكارتون — كل منتج مغامرة',
  logoUrl: '', contactEmail: 'info@orbita.iq', contactPhone: '07700000000',
  address: 'بغداد، العراق', whatsApp: '07700000000',
  facebook: 'https://facebook.com/orbita.iq', instagram: 'https://instagram.com/orbita.iq',
  tikTok: 'https://tiktok.com/@orbita.iq',
  seoTitle: 'أوربيتا — متجر الكارتون الفضائي', seoDescription: 'شخصيات، ألعاب، وكنوز كارتونية حصرية',
};

export const mockCoupons: Coupon[] = [
  { id: 1, code: 'ORBITA20', discountType: 'percent', value: 20, minOrderAmount: 50000, maxUses: 100, usedCount: 34, isActive: true },
  { id: 2, code: 'SPACE50K', discountType: 'fixed', value: 50000, minOrderAmount: 200000, maxUses: 50, usedCount: 8, isActive: true },
  { id: 3, code: 'WELCOME10', discountType: 'percent', value: 10, usedCount: 12, isActive: true },
];

export const mockCustomers: Customer[] = [
  { id: '1', userName: 'سارة', phoneNumber: '07701234567', orderCount: 3, totalSpent: 1150000 },
  { id: '2', userName: 'علي', phoneNumber: '07709876543', orderCount: 2, totalSpent: 890000 },
  { id: '3', userName: 'نور', phoneNumber: '07705551234', orderCount: 1, totalSpent: 185000 },
];

export const mockOrders: Order[] = [
  { id: 1001, userId: '1', totalAmount: 745000, status: 'Paid', items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 350000, product: mockProducts[0] }, { id: 2, productId: 3, quantity: 1, unitPrice: 45000, product: mockProducts[2] }], payments: [] },
  { id: 1002, userId: '2', totalAmount: 670000, status: 'Paid', items: [{ id: 3, productId: 2, quantity: 1, unitPrice: 280000, product: mockProducts[1] }, { id: 4, productId: 7, quantity: 1, unitPrice: 420000, product: mockProducts[6] }], payments: [] },
  { id: 1003, userId: '1', totalAmount: 185000, status: 'Pending', items: [{ id: 5, productId: 11, quantity: 1, unitPrice: 185000, product: mockProducts[10] }], payments: [] },
];

export const mockDashboard: DashboardStats = {
  revenueToday: 1415000, revenueMonth: 4250000, ordersToday: 3, ordersMonth: 12,
  totalCustomers: 8, totalProducts: 24, lowStockCount: 2,
  salesChart: Array.from({ length: 30 }, (_, i) => ({
    date: `${String(i + 1).padStart(2, '0')}/06`,
    revenue: 80000 + (i * 3500), orders: 1 + (i % 4),
  })),
  topProducts: [
    { productId: 1, name: 'أسترو بير الفضائي', quantitySold: 18, revenue: 6300000 },
    { productId: 13, name: 'تنين المشتري', quantitySold: 7, revenue: 3850000 },
    { productId: 6, name: 'مجموعة المجرة', quantitySold: 12, revenue: 1440000 },
    { productId: 11, name: 'حزمة المغامر الصغير', quantitySold: 9, revenue: 1665000 },
    { productId: 2, name: 'روبوت نجمة', quantitySold: 11, revenue: 3080000 },
  ],
};

export function filterMockProducts(params?: Record<string, string>): Product[] {
  let list = mockProducts.filter((p) => p.isActive);
  const q = params?.q?.toLowerCase();
  if (q) list = list.filter((p) => p.name.includes(q) || p.description.includes(q) || p.sku.toLowerCase().includes(q));
  if (params?.categoryId) list = list.filter((p) => p.categoryId === Number(params.categoryId));
  if (params?.featured === 'true') list = list.filter((p) => p.isFeatured);
  return list;
}
