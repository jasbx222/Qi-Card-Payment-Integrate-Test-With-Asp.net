import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radar, SlidersHorizontal } from 'lucide-react';
import { storeApi } from '../../api/client';
import type { Product, Category } from '../../api/types';
import ProductCard from '../../components/ProductCard';
import './CatalogPage.css';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') || '';
  const categoryId = params.get('categoryId') || '';
  const sort = params.get('sort') || '';
  const featured = params.get('featured') || '';

  useEffect(() => {
    setLoading(true);
    const apiParams: Record<string, string> = {};
    if (q) apiParams.q = q;
    if (categoryId) apiParams.categoryId = categoryId;
    if (sort) apiParams.sort = sort;
    if (featured) apiParams.featured = 'true';

    Promise.all([
      storeApi.getProducts(Object.keys(apiParams).length ? apiParams : undefined),
      storeApi.getCategories(),
    ])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q, categoryId, sort, featured]);

  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  return (
    <div className="catalog-universe">
      <section className="catalog-hero">
        <div className="container catalog-hero__inner">
          <span className="scene-label"><Radar size={14} /> مسح المجرة</span>
          <h1 className="scene-title">
            {activeCategory ? `كوكب ${activeCategory.name}` : q ? `نتائج: "${q}"` : 'خريطة الكنوز'}
          </h1>
          <p className="scene-desc">
            {activeCategory?.description || 'تصفح الاكتشافات المتاحة في هذا المدار — كل قطعة قصة فريدة.'}
          </p>
        </div>
      </section>

      <div className="container catalog-body">
        <button className="catalog-filters-toggle hide-desktop" onClick={() => setFiltersOpen(!filtersOpen)}>
          <SlidersHorizontal size={18} /> فلاتر المهمة
        </button>

        <div className="catalog-layout">
          <aside className={`catalog-radar holo-panel ${filtersOpen ? 'open' : ''}`}>
            <h3 className="catalog-radar__title">رادار المهمة</h3>

            <div className="form-group">
              <label>البحث</label>
              <input
                placeholder="ابحث عن كنز..."
                defaultValue={q}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    if (val) params.set('q', val); else params.delete('q');
                    setParams(params);
                  }
                }}
              />
            </div>

            <div className="catalog-radar__section">
              <label>الكواكب</label>
              <button
                className={`catalog-chip ${!categoryId ? 'active' : ''}`}
                onClick={() => { params.delete('categoryId'); setParams(params); }}
              >
                كل المدارات
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`catalog-chip ${categoryId === String(c.id) ? 'active' : ''}`}
                  onClick={() => { params.set('categoryId', String(c.id)); setParams(params); }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>ترتيب الاكتشاف</label>
              <select
                value={sort}
                onChange={(e) => {
                  if (e.target.value) params.set('sort', e.target.value);
                  else params.delete('sort');
                  setParams(params);
                }}
              >
                <option value="">الافتراضي</option>
                <option value="newest">الأحدث وصلاً</option>
                <option value="price_asc">الأقل سعراً</option>
                <option value="price_desc">الأعلى سعراً</option>
              </select>
            </div>
          </aside>

          <div className="catalog-results">
            <div className="catalog-results__bar">
              <span className="badge badge-mission">{products.length} اكتشاف</span>
            </div>

            {loading ? (
              <div className="catalog-loading">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state holo-panel">
                <h3>لا إشارات في هذا المدار</h3>
                <p>جرّب كوكباً آخر أو عدّل فلاتر المهمة</p>
              </div>
            ) : (
              <div className="grid-loot">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
