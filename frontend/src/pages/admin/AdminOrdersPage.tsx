import { useEffect, useState } from 'react';
import { adminApi, formatPrice } from '../../api/client';
import type { Order } from '../../api/types';

const statuses = ['AwaitingPayment', 'Paid', 'Failed', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const load = () => adminApi.orders.list(filter || undefined).then(setOrders);
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    await adminApi.orders.updateStatus(id, status);
    load();
    setSelected(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>إدارة الطلبات</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">كل الحالات</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>#</th><th>المبلغ</th><th>الحالة</th><th>العناصر</th><th>إجراء</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{formatPrice(o.totalAmount)}</td>
                <td><span className="badge badge-info">{o.status}</span></td>
                <td>{o.items?.length || 0}</td>
                <td><button className="btn btn-secondary btn-sm" onClick={() => setSelected(o)}>تفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3>طلب #{selected.id}</h3>
          <p>المبلغ: {formatPrice(selected.totalAmount)}</p>
          <ul style={{ margin: '1rem 0', paddingRight: '1.5rem' }}>
            {selected.items?.map((i) => (
              <li key={i.id}>{i.product?.name || `منتج ${i.productId}`} × {i.quantity}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {statuses.map((s) => (
              <button key={s} className="btn btn-sm btn-secondary" onClick={() => updateStatus(selected.id, s)}>{s}</button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSelected(null)}>إغلاق</button>
        </div>
      )}
    </div>
  );
}
