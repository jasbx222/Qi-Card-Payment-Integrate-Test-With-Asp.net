import { useEffect, useState } from 'react';
import { adminApi, formatPrice } from '../../api/client';
import type { Customer, Coupon, Banner, StoreSettings } from '../../api/types';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => { adminApi.customers().then(setCustomers); }, []);
  return (
    <div>
      <div className="page-header"><h1>العملاء</h1></div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>الاسم</th><th>الهاتف</th><th>الطلبات</th><th>إجمالي الإنفاق</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.userName}</td>
                <td>{c.phoneNumber}</td>
                <td>{c.orderCount}</td>
                <td>{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ code: '', discountType: 'percent', value: 10, isActive: true });
  const load = () => adminApi.coupons.list().then(setCoupons);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.coupons.create(form);
    setForm({ code: '', discountType: 'percent', value: 10, isActive: true });
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>الكوبونات</h1></div>
      <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleCreate}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group"><label>الكود</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
          <div className="form-group">
            <label>النوع</label>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="percent">نسبة %</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>
          <div className="form-group"><label>القيمة</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
          <button type="submit" className="btn btn-primary">إضافة</button>
        </div>
      </form>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>الكود</th><th>النوع</th><th>القيمة</th><th>الاستخدام</th><th>الحالة</th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.code}</strong></td>
                <td>{c.discountType === 'percent' ? 'نسبة' : 'ثابت'}</td>
                <td>{c.value}{c.discountType === 'percent' ? '%' : ' د.ع'}</td>
                <td>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-error'}`}>{c.isActive ? 'نشط' : 'منتهي'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', ctaText: 'تسوّق الآن', ctaLink: '/products', section: 'hero', sortOrder: 1, isActive: true });
  const load = () => adminApi.banners.list().then(setBanners);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.banners.create(form);
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>إدارة المحتوى</h1></div>
      <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleCreate}>
        <div className="form-group"><label>العنوان</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label>الوصف</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
        <div className="form-group"><label>رابط الصورة</label><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
        <button type="submit" className="btn btn-primary">إضافة بانر</button>
      </form>
      <div className="card">
        {banners.map((b) => (
          <div key={b.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <img src={b.imageUrl} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 6 }} />
            <div><strong>{b.title}</strong><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.subtitle}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { adminApi.settings.get().then(setSettings); }, []);

  if (!settings) return <p>جاري التحميل...</p>;

  const set = (k: keyof StoreSettings, v: string) => setSettings({ ...settings, [k]: v });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await adminApi.settings.update(settings);
    setSaving(false);
    alert('تم الحفظ');
  };

  return (
    <div>
      <div className="page-header"><h1>إعدادات المتجر</h1></div>
      <form className="card form-card" onSubmit={handleSave}>
        <div className="form-group"><label>اسم المتجر</label><input value={settings.storeName} onChange={(e) => set('storeName', e.target.value)} /></div>
        <div className="form-group"><label>الشعار النصي</label><input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} /></div>
        <div className="form-group"><label>الهاتف</label><input value={settings.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} /></div>
        <div className="form-group"><label>البريد</label><input value={settings.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} /></div>
        <div className="form-group"><label>العنوان</label><input value={settings.address} onChange={(e) => set('address', e.target.value)} /></div>
        <div className="form-group"><label>واتساب</label><input value={settings.whatsApp} onChange={(e) => set('whatsApp', e.target.value)} /></div>
        <div className="form-group"><label>إنستغرام</label><input value={settings.instagram} onChange={(e) => set('instagram', e.target.value)} /></div>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
      </form>
    </div>
  );
}
