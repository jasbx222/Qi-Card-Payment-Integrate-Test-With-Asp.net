import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storeApi } from '../../api/client';
import type { Category } from '../../api/types';
import PageHero from '../../components/store/PageHero';
import PlanetCard from '../../components/world/PlanetCard';

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    storeApi.getCategories().then(setCategories);
  }, []);

  return (
    <div>
      <PageHero
        label="المجموعات"
        title="عوالم أوربيتا"
        description="كل مجموعة كوكب بمدار خاص — ادخل واستكشف كنوزه الحصرية."
      />
      <div className="container planets-orbit" style={{ paddingBottom: '5rem', flexWrap: 'wrap' }}>
        {categories.map((c, i) => (
          <PlanetCard key={c.id} category={c} index={i} />
        ))}
      </div>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Link to="/discover" className="btn btn-secondary">خريطة الاستكشاف الكاملة</Link>
      </div>
    </div>
  );
}
