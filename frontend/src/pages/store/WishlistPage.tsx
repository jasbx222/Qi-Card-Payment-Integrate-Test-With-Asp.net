import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import PageHero from '../../components/store/PageHero';
import ProductCard from '../../components/ProductCard';

export default function WishlistPage() {
  const { items, count } = useWishlist();
  const { add } = useCart();

  return (
    <div>
      <PageHero
        label="اكتشافات محفوظة"
        title="نجومك المفضّلة"
        description={`${count} كنز محفوظ في مدارك الشخصي`}
      />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {items.length === 0 ? (
          <div className="empty-state holo-panel">
            <Heart size={48} strokeWidth={1} color="var(--orbit-magenta)" style={{ margin: '0 auto', opacity: 0.5 }} />
            <h3>لم تضف نجوماً بعد</h3>
            <p>اضغط على القلب في أي منتج لحفظه هنا</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>استكشف المجرة</Link>
          </div>
        ) : (
          <div className="grid-loot">
            {items.map((p) => (
              <div key={p.id} style={{ position: 'relative' }}>
                <ProductCard product={p} />
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={() => add(p)}
                >
                  انقل لحجرة الشحن
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
