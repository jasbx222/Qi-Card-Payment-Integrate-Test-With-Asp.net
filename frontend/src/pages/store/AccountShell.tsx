import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, User, MapPin, Heart, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storeApi, formatPrice } from '../../api/client';
import type { Order } from '../../api/types';
import './AccountShell.css';

const NAV = [
  { to: '/account', icon: LayoutDashboard, label: 'لوحة المسافر', end: true },
  { to: '/account/orders', icon: Package, label: 'مهماتي' },
  { to: '/account/profile', icon: User, label: 'بياناتي' },
  { to: '/account/addresses', icon: MapPin, label: 'العناوين' },
  { to: '/wishlist', icon: Heart, label: 'المفضلة' },
  { to: '/account/notifications', icon: Bell, label: 'الإشعارات' },
];

export default function AccountShell() {
  const { userName, phoneNumber } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="account-shell container">
      <aside className="account-sidebar holo-panel">
        <div className="account-sidebar__pilot">
          <div className="account-sidebar__avatar">{userName?.[0]?.toUpperCase() || 'م'}</div>
          <div>
            <strong>{userName}</strong>
            <span dir="ltr">{phoneNumber}</span>
          </div>
        </div>
        <nav>
          {NAV.map(({ to, icon: Icon, label, end }) => {
            const isActive = end ? pathname === '/account' : pathname === to || pathname.startsWith(to + '/');
            return (
              <Link key={to} to={to} className={`account-nav__item ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="account-main holo-panel">
        <Outlet />
      </main>
    </div>
  );
}

export function AccountDashboard() {
  return (
    <div>
      <h2 className="account-page-title">مرحباً في محطتك الشخصية</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>إدارة مهماتك واكتشافاتك من هنا</p>
      <div className="account-quick-grid">
        <Link to="/account/orders" className="account-quick holo-panel">
          <Package size={24} color="var(--orbit-cyan)" />
          <strong>مهماتي</strong>
          <span>تتبع الطلبات</span>
        </Link>
        <Link to="/wishlist" className="account-quick holo-panel">
          <Heart size={24} color="var(--orbit-magenta)" />
          <strong>المفضلة</strong>
          <span>كنوز محفوظة</span>
        </Link>
        <Link to="/track-order" className="account-quick holo-panel">
          <MapPin size={24} color="var(--orbit-violet)" />
          <strong>تتبع</strong>
          <span>مسح الإشارة</span>
        </Link>
      </div>
    </div>
  );
}

export function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { storeApi.getMyOrders().then(setOrders); }, []);

  return (
    <div>
      <h2 className="account-page-title">مهماتي</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>لا توجد مهمات بعد — <Link to="/products" style={{ color: 'var(--orbit-cyan)' }}>ابدأ الاستكشاف</Link></p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>المبلغ</th><th>الحالة</th><th>العناصر</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatPrice(o.totalAmount)}</td>
                  <td><span className="badge badge-info">{o.status}</span></td>
                  <td>{o.items?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AccountProfile() {
  const { userName, phoneNumber } = useAuth();
  return (
    <div>
      <h2 className="account-page-title">بيانات المسافر</h2>
      <div className="form-group"><label>اسم المستخدم</label><input defaultValue={userName || ''} readOnly /></div>
      <div className="form-group"><label>الهاتف</label><input defaultValue={phoneNumber || ''} readOnly /></div>
    </div>
  );
}

export function AccountAddresses() {
  return (
    <div>
      <h2 className="account-page-title">عناوين التوصيل</h2>
      <p style={{ color: 'var(--text-muted)' }}>لا توجد عناوين محفوظة بعد.</p>
      <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>+ إضافة عنوان</button>
    </div>
  );
}

export function AccountNotifications() {
  return (
    <div>
      <h2 className="account-page-title">الإشعارات</h2>
      <p style={{ color: 'var(--text-muted)' }}>لا توجد إشعارات جديدة.</p>
    </div>
  );
}
