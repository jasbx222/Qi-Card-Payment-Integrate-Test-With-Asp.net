import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Sparkles, Shield, Rocket } from 'lucide-react';
import { storeApi, formatPrice } from '../../api/client';
import type { Product } from '../../api/types';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import SafeImage from '../../components/SafeImage';
import './ShowcasePage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    storeApi.getProduct(Number(id)).then(setProduct).catch(() => navigate('/products'));
    storeApi.getProducts().then((all) =>
      setRelated(all.filter((p) => p.id !== Number(id)).slice(0, 4))
    );
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="showcase-loading container">
        <div className="skeleton-card" style={{ maxWidth: 600, margin: '4rem auto' }} />
      </div>
    );
  }

  return (
    <div className="showcase-chamber">
      <div className="container">
        <nav className="showcase-breadcrumb">
          <Link to="/">البوابة</Link>
          <span>/</span>
          <Link to="/products">الاستكشاف</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="showcase-grid">
          <div className="showcase-holo holo-panel">
            <div className="showcase-holo__frame">
              <div className="showcase-holo__corners" />
              <SafeImage variant="product" sku={product.sku} src={product.imageUrl} alt={product.name} />
              <div className="showcase-holo__scan" />
            </div>
            {product.isFeatured && (
              <span className="badge badge-loot showcase-badge"><Sparkles size={12} /> اكتشاف أسطوري</span>
            )}
          </div>

          <div className="showcase-data">
            <span className="scene-label">غرفة العرض · SKU {product.sku}</span>
            <h1 className="showcase-title">{product.name}</h1>
            <div className="showcase-rating">★★★★★ <span>4.8 · 120 تقييم</span></div>

            <div className="showcase-price-block holo-panel">
              <span className="showcase-price">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="showcase-price-old">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="showcase-desc">{product.description}</p>

            <div className="showcase-status">
              {product.stockQuantity > 0 ? (
                <span className="badge badge-success">● متوفر — {product.stockQuantity} في المخزن</span>
              ) : (
                <span className="badge badge-error">نفد من المدار</span>
              )}
            </div>

            <div className="showcase-qty">
              <label>الكمية</label>
              <div className="showcase-qty__controls">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}>+</button>
              </div>
            </div>

            <div className="showcase-actions">
              <button className="btn btn-primary btn-portal" onClick={() => add(product, qty)} disabled={product.stockQuantity < 1}>
                <ShoppingCart size={18} /> أضف لحجرة الشحن
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => { add(product, qty); navigate('/checkout'); }}
                disabled={product.stockQuantity < 1}
              >
                <Rocket size={18} /> إطلاق فوري
              </button>
            </div>

            <div className="showcase-trust">
              <div><Shield size={16} /> دفع آمن · Qi Card</div>
              <div><Rocket size={16} /> توصيل لجميع المحافظات</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="showcase-related">
            <h2 className="scene-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>اكتشافات مشابهة</h2>
            <div className="grid-loot">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <div className="showcase-sticky hide-mobile">
        <div className="container showcase-sticky__inner holo-panel">
          <span className="showcase-sticky__name">{product.name}</span>
          <span className="showcase-sticky__price">{formatPrice(product.price)}</span>
          <button className="btn btn-primary btn-sm" onClick={() => add(product, qty)} disabled={product.stockQuantity < 1}>
            أضف للشحن
          </button>
        </div>
      </div>
    </div>
  );
}
