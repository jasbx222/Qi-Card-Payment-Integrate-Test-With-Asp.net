import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { storeApi } from '../../api/client';
import type { Product } from '../../api/types';
import ProductCard from '../../components/ProductCard';
import PageHero from '../../components/store/PageHero';

interface Props {
  label: string;
  title: string;
  description?: string;
  apiParams?: Record<string, string>;
}

export default function ProductListingPage({ label, title, description, apiParams }: Props) {
  const [params] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const q = params.get('q') || apiParams?.q || '';
  const merged = { ...apiParams };
  if (q) merged.q = q;

  useEffect(() => {
    setLoading(true);
    storeApi.getProducts(Object.keys(merged).length ? merged : undefined)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [JSON.stringify(merged)]);

  return (
    <div className="catalog-universe">
      <PageHero label={label} title={title} description={description} />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-mission">{products.length} اكتشاف</span>
        </div>
        {loading ? (
          <div className="catalog-loading">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state holo-panel"><h3>لا إشارات في هذا المدار</h3></div>
        ) : (
          <div className="grid-loot">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
