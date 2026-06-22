import { Link } from 'react-router-dom';
import { Sparkles, Plus, Heart } from 'lucide-react';
import type { Product } from '../api/types';
import { formatPrice } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SafeImage from './SafeImage';
import './ProductCard.css';

export default function ProductCard({ product, variant = 'grid' }: { product: Product; variant?: 'grid' | 'spotlight' }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <article className={`loot-card loot-card--${variant}`}>
      <div className="loot-card__scanline" />
      <Link to={`/products/${product.id}`} className="loot-card__display">
        <button
          className={`loot-card__wish ${has(product.id) ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          aria-label="حفظ في المفضلة"
        >
          <Heart size={16} fill={has(product.id) ? 'currentColor' : 'none'} />
        </button>
        {product.isFeatured && (
          <span className="badge badge-loot"><Sparkles size={10} /> اكتشاف نادر</span>
        )}
        {discount > 0 && <span className="loot-card__discount">-{discount}%</span>}
        <div className="loot-card__holo-frame">
          <SafeImage
            variant="product"
            sku={product.sku}
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
      </Link>
      <div className="loot-card__data">
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="loot-card__meta">
          <span className="loot-card__rating">★ 4.8</span>
          {product.stockQuantity < 10 && product.stockQuantity > 0 && (
            <span className="loot-card__stock">باقي {product.stockQuantity} قطعة</span>
          )}
        </div>
        <div className="loot-card__footer">
          <div className="loot-card__price">
            <span className="loot-card__price-main">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="loot-card__price-old">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            className="loot-card__collect"
            onClick={() => add(product)}
            disabled={product.stockQuantity < 1}
            aria-label="أضف لحجرة الشحن"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
