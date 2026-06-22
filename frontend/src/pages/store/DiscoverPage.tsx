import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { storeApi } from '../../api/client';
import type { Category, Product } from '../../api/types';
import PageHero from '../../components/store/PageHero';
import PlanetCard from '../../components/world/PlanetCard';
import ProductCard from '../../components/ProductCard';
import JourneySection from '../../components/world/JourneySection';

export default function DiscoverPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    storeApi.getCategories().then(setCategories);
    storeApi.getProducts({ featured: 'true' }).then(setFeatured);
  }, []);

  return (
    <div>
      <PageHero
        label="خريطة المجرة"
        title="اكتشف عوالم أوربيتا"
        description="رحلة بصرية عبر الكواكب والمجموعات — اختر وجهتك التالية."
      />

      <JourneySection label="العوالم" title="مدارات الاستكشاف" compact>
        <div className="planets-orbit">
          {categories.map((c, i) => <PlanetCard key={c.id} category={c} index={i} />)}
        </div>
      </JourneySection>

      <JourneySection label="كنوز مميزة" title="اكتشافات من كل مدار" compact>
        <div className="grid-loot">
          {featured.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <Link to="/products" className="btn btn-secondary" style={{ marginTop: '2rem' }}>استكشف الكل</Link>
      </JourneySection>

      <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <Compass size={48} color="var(--orbit-cyan)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
        <p className="scene-desc" style={{ margin: '0 auto' }}>
          كل زيارة لأوربيتا رحلة جديدة — عد غداً لإسقاطات وكنوز لا تراها اليوم.
        </p>
      </section>
    </div>
  );
}
