/**
 * روابط صور ثابتة وموثوقة — picsum بـ seed ثابت + SVG محلي كاحتياطي.
 * عند الربط الحقيقي: استبدل imageUrl من الـ API فقط، الـ fallback يبقى يعمل.
 */
const P = (seed: string, w = 600) => `https://picsum.photos/seed/${seed}/${w}/${w}`;

export const IMG = {
  placeholder: '/images/placeholder-product.svg',
  categories: {
    characters: '/images/categories/characters.svg',
    toys: '/images/categories/toys.svg',
    accessories: '/images/categories/accessories.svg',
    'stickers-art': '/images/categories/stickers.svg',
    'gift-bundles': '/images/categories/gifts.svg',
    'limited-drops': '/images/categories/limited.svg',
  } as Record<string, string>,
};

/** صورة منتج حسب SKU */
export function productImage(sku: string, imageUrl?: string | null): string {
  if (imageUrl?.startsWith('/') && !imageUrl.includes('unsplash')) return imageUrl;
  if (imageUrl?.startsWith('http') && !imageUrl.includes('unsplash.com')) return imageUrl;
  if (PRODUCT_IMAGES[sku]) return PRODUCT_IMAGES[sku];
  const seed = sku.toLowerCase().replace(/[^a-z0-9]/g, '');
  return P(`orbita-${seed || 'product'}`);
}

/** صورة تصنيف حسب slug */
export function categoryImage(slug: string, imageUrl?: string | null): string {
  if (IMG.categories[slug]) return IMG.categories[slug];
  if (imageUrl?.startsWith('/') ) return imageUrl;
  return P(`orbita-cat-${slug}`);
}

/** بانر / هيرو */
export function bannerImage(section: string, imageUrl?: string | null): string {
  if (imageUrl?.startsWith('/') && !imageUrl.includes('unsplash')) return imageUrl;
  if (imageUrl?.startsWith('http') && !imageUrl.includes('unsplash.com')) return imageUrl;
  if (section === 'hero') return '/images/portal-hero.svg';
  return P(`orbita-banner-${section}`, 1200);
}

/** خريطة SKU → picsum (للـ seeder والـ mock) */
export const PRODUCT_IMAGES: Record<string, string> = {
  'ORB-001': P('orbita-orb001'),
  'ORB-002': P('orbita-orb002'),
  'ORB-003': P('orbita-orb003'),
  'ORB-004': P('orbita-orb004'),
  'ORB-005': P('orbita-orb005'),
  'ORB-006': P('orbita-orb006'),
  'ORB-007': P('orbita-orb007'),
  'ORB-008': P('orbita-orb008'),
  'ORB-009': P('orbita-orb009'),
  'ORB-010': P('orbita-orb010'),
  'ORB-011': P('orbita-orb011'),
  'ORB-012': P('orbita-orb012'),
  'ORB-013': P('orbita-orb013'),
  'ORB-014': P('orbita-orb014'),
  'ORB-015': P('orbita-orb015'),
  'ORB-016': P('orbita-orb016'),
  'ORB-017': P('orbita-orb017'),
  'ORB-018': P('orbita-orb018'),
  'ORB-019': P('orbita-orb019'),
  'ORB-020': P('orbita-orb020'),
  'ORB-021': P('orbita-orb021'),
  'ORB-022': P('orbita-orb022'),
  'ORB-023': P('orbita-orb023'),
  'ORB-024': P('orbita-orb024'),
};

export const CATEGORY_IMAGES: Record<string, string> = {
  characters: IMG.categories.characters,
  toys: IMG.categories.toys,
  accessories: IMG.categories.accessories,
  'stickers-art': IMG.categories['stickers-art'],
  'gift-bundles': IMG.categories['gift-bundles'],
  'limited-drops': IMG.categories['limited-drops'],
};
