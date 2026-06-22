import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import type { Banner } from '../../api/types';

const SECTIONS = [
  { key: 'hero', label: 'بوابة الوصول' },
  { key: 'featured', label: 'اكتشاف مميز' },
  { key: 'event', label: 'حدث كوني' },
  { key: 'editorial', label: 'تحريري' },
];

export default function AdminCmsPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '', section: 'hero', isActive: true });

  const load = () => adminApi.banners.list().then(setBanners);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.banners.create(form);
    setForm({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '', section: 'hero', isActive: true });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>إدارة الصفحة الرئيسية</h1>
        <p style={{ color: 'var(--text-muted)' }}>تحكم بأقسام البوابة والأحداث والمحتوى التحريري</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>أقسام الصفحة الرئيسية</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {SECTIONS.map((s) => (
            <div key={s.key} className="holo-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <strong>{s.label}</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {banners.filter((b) => b.section === s.key).length} عنصر
              </p>
            </div>
          ))}
        </div>
      </div>

      <form className="card" onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>إضافة محتوى</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label>العنوان</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="form-group"><label>القسم</label>
            <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
              {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label>العنوان الفرعي</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
          <div className="form-group"><label>رابط الصورة</label><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
          <div className="form-group"><label>نص الزر</label><input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} /></div>
          <div className="form-group"><label>الرابط</label><input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} /></div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>نشر المحتوى</button>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>القسم</th><th>العنوان</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td><span className="badge badge-info">{b.section}</span></td>
                <td>{b.title}</td>
                <td><span className={`badge ${b.isActive ? 'badge-success' : 'badge-error'}`}>{b.isActive ? 'نشط' : 'معطل'}</span></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => adminApi.banners.delete(b.id).then(load)}>حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
