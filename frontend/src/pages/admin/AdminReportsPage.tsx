import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import { adminApi, formatPrice } from '../../api/client';
import type { DashboardStats } from '../../api/types';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.dashboard().then(setStats);
  }, []);

  if (!stats) return <div className="card">جاري تحميل التقارير...</div>;

  const cards = [
    { icon: TrendingUp, label: 'إيرادات اليوم', value: formatPrice(stats.revenueToday), color: 'var(--orbit-cyan)' },
    { icon: BarChart3, label: 'مهمات اليوم', value: String(stats.ordersToday), color: 'var(--orbit-violet)' },
    { icon: Users, label: 'المسافرون', value: String(stats.totalCustomers), color: 'var(--orbit-magenta)' },
    { icon: Package, label: 'الكنوز', value: String(stats.totalProducts), color: 'var(--orbit-gold)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>تقارير المجرة</h1>
        <p style={{ color: 'var(--text-muted)' }}>نظرة شاملة على أداء المحطة</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Icon size={28} color={color} style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>إيرادات الشهر · {formatPrice(stats.revenueMonth)}</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
            {stats.salesChart.slice(-14).map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: 'linear-gradient(to top, var(--orbit-cyan), var(--orbit-violet))',
                  borderRadius: '3px 3px 0 0',
                  height: `${Math.max(12, (d.revenue / (stats.revenueMonth || 1)) * 100)}%`,
                }}
                title={`${d.date}: ${formatPrice(d.revenue)}`}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>أكثر الكنوز مبيعاً</h3>
          {stats.topProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>لا توجد بيانات بعد</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>المنتج</th><th>الكمية</th><th>الإيراد</th></tr></thead>
                <tbody>
                  {stats.topProducts.map((p) => (
                    <tr key={p.productId}>
                      <td>{p.name}</td>
                      <td>{p.quantitySold}</td>
                      <td>{formatPrice(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {stats.lowStockCount > 0 && (
        <div className="card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle color="var(--warning)" />
          <span>{stats.lowStockCount} كنز بحاجة لإعادة تزويد المخزون</span>
        </div>
      )}
    </div>
  );
}
