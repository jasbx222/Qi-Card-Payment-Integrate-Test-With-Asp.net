/** وضع البيانات التجريبية — false = ربط API حقيقي (الافتراضي) */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** في التطوير: fallback للـ mock إذا فشل الـ API */
export const FALLBACK_MOCK = import.meta.env.VITE_FALLBACK_MOCK !== 'false';
