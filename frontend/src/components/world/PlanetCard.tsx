import { Link } from 'react-router-dom';
import type { Category } from '../../api/types';
import SafeImage from '../SafeImage';
import './PlanetCard.css';

export default function PlanetCard({ category, index }: { category: Category; index: number }) {
  const hues = ['cyan', 'violet', 'magenta', 'gold'] as const;
  const hue = hues[index % hues.length];

  return (
    <Link
      to={`/products?categoryId=${category.id}`}
      className={`planet-card planet-card--${hue}`}
      style={{ '--orbit-delay': `${index * 0.8}s` } as React.CSSProperties}
    >
      <div className="planet-card__orbit" />
      <div className="planet-card__sphere">
        <SafeImage variant="category" slug={category.slug} src={category.imageUrl} alt={category.name} />
      </div>
      <div className="planet-card__info">
        <span className="planet-card__zone">منطقة {index + 1}</span>
        <h3>{category.name}</h3>
        <p>{category.description || 'استكشف كنوز هذا الكوكب'}</p>
        <span className="planet-card__cta">دخول المدار ←</span>
      </div>
    </Link>
  );
}
