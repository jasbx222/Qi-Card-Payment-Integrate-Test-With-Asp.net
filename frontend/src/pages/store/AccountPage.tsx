import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { storeApi, formatPrice } from '../../api/client';
import type { Order } from '../../api/types';
import { useAuth } from '../../context/AuthContext';

const statusBadge = (s: string) => {
  if (s === 'Paid') return 'badge-success';
  if (s === 'Failed') return 'badge-error';
  if (s === 'AwaitingPayment') return 'badge-warning';
  return 'badge-info';
};

export function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { storeApi.getMyOrders().then(setOrders).catch(console.error); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>طلباتي</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>لا توجد طلبات بعد</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>المبلغ</th><th>الحالة</th><th>العناصر</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatPrice(o.totalAmount)}</td>
                  <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                  <td>{o.items?.length || 0} منتج</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  const { userName, phoneNumber } = useAuth();
  const location = useLocation();
  const isOrders = location.pathname.includes('/orders');

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
      <aside className="card" style={{ height: 'fit-content' }}>
        <h3 style={{ marginBottom: '1rem' }}>{userName}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{phoneNumber}</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link to="/account" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>الملف الشخصي</Link>
          <Link to="/account/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>طلباتي</Link>
        </nav>
      </aside>
      <div className="card">
        {isOrders ? <AccountOrdersPage /> : (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>مرحباً، {userName}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>إدارة حسابك وطلباتك من هنا</p>
          </div>
        )}
      </div>
    </div>
  );
}
