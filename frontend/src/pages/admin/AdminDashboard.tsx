import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, Users, AlertTriangle, Plus } from 'lucide-react';
import { adminApi, formatPrice } from '../../api/client';
import type { DashboardStats } from '../../api/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => { adminApi.dashboard().then(setStats).catch(console.error); }, []);

  if (!stats) return <p style={{ color: 'var(--text-muted)' }}>جاري تحميل بيانات المحطة...</p>;

  return (
    <div>
      <header className="mc-page-header">
        <h1>مرحباً، قائد المهمة</h1>
        <p>نظرة عامة على عمليات أوربيتا — {new Date().toLocaleDateString('ar-IQ')}</p>
      </header>

      <div className="mc-stats">
        <div className="stat-card">
          <TrendingUp size={18} color="var(--orbit-cyan)" style={{ marginBottom: '0.5rem' }} />
          <div className="value">{formatPrice(stats.revenueMonth)}</div>
          <div className="label">إيرادات الشهر</div>
        </div>
        <div className="stat-card">
          <Package size={18} color="var(--orbit-violet)" style={{ marginBottom: '0.5rem' }} />
          <div className="value">{stats.ordersMonth}</div>
          <div className="label">مهمات الشهر</div>
        </div>
        <div className="stat-card">
          <Users size={18} color="var(--orbit-magenta)" style={{ marginBottom: '0.5rem' }} />
          <div className="value">{stats.totalCustomers}</div>
          <div className="label">المسافرون</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.totalProducts}</div>
          <div className="label">كنوز نشطة</div>
        </div>
        <div className="stat-card">
          <AlertTriangle size={18} color="var(--warning)" style={{ marginBottom: '0.5rem' }} />
          <div className="value" style={{ color: 'var(--warning)' }}>{stats.lowStockCount}</div>
          <div className="label">تنبيه مخزون</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="mc-panel holo-panel">
          <h3>أكثر الكنوز مبيعاً</h3>
          {stats.topProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>لا توجد بيانات بعد</p>
          ) : stats.topProducts.map((p) => (
            <div key={p.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>{p.name}</span>
              <span style={{ color: 'var(--orbit-cyan)' }}>{p.quantitySold} · {formatPrice(p.revenue)}</span>
            </div>
          ))}
        </div>

        <div className="mc-panel holo-panel">
          <h3>نشاط المبيعات</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
            {stats.salesChart.slice(-14).map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `linear-gradient(to top, var(--orbit-cyan), var(--orbit-violet))`,
                  borderRadius: '3px 3px 0 0',
                  height: `${Math.max(12, (d.revenue / (stats.revenueMonth || 1)) * 100)}%`,
                  opacity: 0.7 + (i / 14) * 0.3,
                }}
                title={d.date}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mc-panel holo-panel" style={{ marginTop: '1.5rem' }}>
        <h3>إجراءات سريعة</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm"><Plus size={16} /> إضافة كنز</Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">المهمات</Link>
          <Link to="/admin/banners" className="btn btn-secondary btn-sm">تحديث البث</Link>
        </div>
      </div>
    </div>
  );
}
