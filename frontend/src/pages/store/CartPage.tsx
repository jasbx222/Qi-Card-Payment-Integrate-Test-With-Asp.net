import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Package, Rocket } from 'lucide-react';
import SafeImage from '../../components/SafeImage';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../api/client';
import './CargoBay.css';

export default function CartPage() {
  const { items, updateQty, remove, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cargo-bay cargo-bay--empty container">
        <div className="cargo-empty holo-panel">
          <Package size={64} strokeWidth={1} color="var(--orbit-cyan)" style={{ opacity: 0.5 }} />
          <h2>حجرة الشحن فارغة</h2>
          <p>مدارك لا يزال بانتظار أول كنز — ارجع للاستكشاف</p>
          <Link to="/products" className="btn btn-primary">استكشف المجرة</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cargo-bay container">
      <header className="cargo-header">
        <span className="scene-label">حجرة الشحن</span>
        <h1 className="scene-title">حمولة مهمتك</h1>
        <p className="scene-desc">{items.length} كنز جاهز للإطلاق</p>
      </header>

      <div className="cargo-layout">
        <div className="cargo-items">
          {items.map((item) => (
            <article key={item.product.id} className="cargo-row holo-panel">
              <div className="cargo-row__img">
                <SafeImage variant="product" sku={item.product.sku} src={item.product.imageUrl} alt={item.product.name} />
              </div>
              <div className="cargo-row__info">
                <h3>{item.product.name}</h3>
                <span className="cargo-row__unit">{formatPrice(item.product.price)}</span>
              </div>
              <div className="cargo-row__qty">
                <button onClick={() => updateQty(item.product.id, item.quantity - 1)}><Minus size={14} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.product.id, item.quantity + 1)}><Plus size={14} /></button>
              </div>
              <span className="cargo-row__total">{formatPrice(item.product.price * item.quantity)}</span>
              <button className="cargo-row__remove" onClick={() => remove(item.product.id)}>
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>

        <aside className="cargo-summary holo-panel">
          <h3>ملخص الإطلاق</h3>
          <div className="cargo-summary__line">
            <span>المجموع</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="cargo-summary__line cargo-summary__line--total">
            <span>جاهز للإطلاق</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button className="btn btn-primary btn-portal" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/checkout')}>
            <Rocket size={18} /> تأكيد الإطلاق
          </button>
          <Link to="/products" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '0.75rem' }}>
            متابعة الاستكشاف
          </Link>
        </aside>
      </div>
    </div>
  );
}
