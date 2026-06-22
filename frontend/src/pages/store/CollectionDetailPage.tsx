import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storeApi } from '../../api/client';
import type { Category, Product } from '../../api/types';
import ProductCard from '../../components/ProductCard';
import PageHero from '../../components/store/PageHero';

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;
    storeApi.getCategories().then((cats) => {
      const c = cats.find((x) => x.id === Number(id));
      setCategory(c || null);
    });
    storeApi.getProducts({ categoryId: id }).then(setProducts);
  }, [id]);

  return (
    <div>
      <PageHero
        label={`كوكب · ${category?.name || '...'}`}
        title={category?.name || 'مجموعة'}
        description={category?.description || 'استكشف كنوز هذا العالم الكارتوني.'}
      />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="grid-loot">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
