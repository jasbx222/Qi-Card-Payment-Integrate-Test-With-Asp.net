import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, Radar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { storeApi } from '../api/client';
import type { Category } from '../api/types';
import CosmicBackground from '../components/world/CosmicBackground';
import MegaMenu from '../components/store/MegaMenu';
import './StoreLayout.css';

const NAV = [
  { to: '/', label: 'البوابة' },
  { to: '/discover', label: 'اكتشف' },
  { to: '/collections', label: 'المجموعات', mega: true },
  { to: '/about', label: 'الأسطورة' },
];

export default function StoreLayout() {
  const { token, userName, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    storeApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="universe">
      <CosmicBackground variant="store" />

      <header className="command-deck">
        <div className="container deck-inner">
          <button className="deck-toggle hide-desktop" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="deck-brand">
            <span className="deck-brand__icon"><Radar size={22} /></span>
            <div className="deck-brand__text">
              <strong>أوربيتا</strong>
              <small>مجرّة الكارتون</small>
            </div>
          </Link>

          <form
            className="deck-scanner hide-mobile"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/products?q=${encodeURIComponent(search)}`;
            }}
          >
            <Search size={17} />
            <input
              placeholder="مسح المجرة للبحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="deck-scanner__hint">⌘K</span>
          </form>

          <nav className={`deck-nav ${menuOpen ? 'open' : ''}`}>
            {NAV.map(({ to, label, mega }) => (
              mega ? (
                <span
                  key={to}
                  className="deck-nav__link deck-nav__link--mega"
                  onMouseEnter={() => setMegaOpen(true)}
                  onClick={() => { setMegaOpen(!megaOpen); setMenuOpen(false); }}
                >
                  {label}
                </span>
              ) : (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="deck-nav__link">
                  {label}
                </Link>
              )
            ))}
          </nav>

          <div className="deck-actions">
            <Link to="/wishlist" className="deck-action hide-mobile" title="اكتشافات محفوظة">
              <Heart size={19} />
              {wishCount > 0 && <span className="deck-action__count">{wishCount}</span>}
            </Link>
            <Link to="/cart" className="deck-action deck-action--cargo" title="السلة">
              <ShoppingCart size={19} />
              {count > 0 && <span className="deck-action__count">{count}</span>}
            </Link>
            {token ? (
              <>
                <Link to="/account" className="deck-action" title="ملف المسافر">
                  <User size={19} />
                </Link>
                <span className="deck-pilot hide-mobile">{userName}</span>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary btn-sm">مركز القيادة</Link>
                )}
                <button className="btn btn-ghost btn-sm" onClick={logout}>خروج</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">دخول المحطة</Link>
            )}
          </div>
        </div>
        <MegaMenu categories={categories} open={megaOpen} onClose={() => setMegaOpen(false)} />
        <div className="deck-status-bar">
          <span>● المحطة متصلة</span>
          <span>أوربيتا v1</span>
        </div>
      </header>

      <main className="universe-main"><Outlet /></main>

      <footer className="control-deck">
        <div className="control-deck__glow" />
        <div className="container control-deck__grid">
          <div className="control-deck__brand">
            <h3>أوربيتا</h3>
            <p>محطة تسوق كارتونية في أعماق المجرة — كل منتج قصة، كل طلب رحلة.</p>
          </div>
          <div>
            <h4>مسارات</h4>
            <Link to="/products">استكشاف الكنوز</Link>
            <Link to="/collections">المجموعات</Link>
            <Link to="/discover">خريطة المجرة</Link>
            <Link to="/faq">دليل المسافر</Link>
            <Link to="/track-order">تتبع المهمة</Link>
          </div>
          <div>
            <h4>سياسات</h4>
            <Link to="/policies/shipping">الشحن</Link>
            <Link to="/policies/privacy">الخصوصية</Link>
            <Link to="/contact">تواصل</Link>
          </div>
          <div>
            <h4>إشارة</h4>
            <p>بغداد · العراق</p>
            <p dir="ltr">07700000000</p>
          </div>
        </div>
        <div className="control-deck__bottom container">
          <span>© {new Date().getFullYear()} أوربيتا — جميع المدارات محفوظة</span>
          <span className="control-deck__coords">RA 14h 32m · Dec +22°</span>
        </div>
      </footer>
    </div>
  );
}
