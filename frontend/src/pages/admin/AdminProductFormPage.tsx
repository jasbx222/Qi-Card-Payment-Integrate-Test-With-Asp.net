import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/client';
import type { Product, Category } from '../../api/types';

const empty: Partial<Product> = {
  name: '', description: '', slug: '', sku: '', imageUrl: '',
  price: 0, stockQuantity: 100, isActive: true, isFeatured: false,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState<Partial<Product>>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.categories.list().then(setCategories);
    if (!isNew && id) adminApi.products.get(Number(id)).then(setForm);
  }, [id, isNew]);

  const set = (k: keyof Product, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.products.create(form);
      else await adminApi.products.update(Number(id), form);
      navigate('/admin/products');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isNew ? 'إضافة منتج' : 'تعديل منتج'}</h1>
      </div>
      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group"><label>الاسم</label><input value={form.name || ''} onChange={(e) => set('name', e.target.value)} required /></div>
        <div className="form-group"><label>الوصف</label><textarea rows={4} value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
        <div className="form-group"><label>SKU</label><input value={form.sku || ''} onChange={(e) => set('sku', e.target.value)} /></div>
        <div className="form-group"><label>رابط الصورة</label><input value={form.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label>السعر (د.ع)</label><input type="number" value={form.price || 0} onChange={(e) => set('price', Number(e.target.value))} required /></div>
          <div className="form-group"><label>سعر المقارنة</label><input type="number" value={form.compareAtPrice || ''} onChange={(e) => set('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label>المخزون</label><input type="number" value={form.stockQuantity || 0} onChange={(e) => set('stockQuantity', Number(e.target.value))} /></div>
          <div className="form-group">
            <label>التصنيف</label>
            <select value={form.categoryId || ''} onChange={(e) => set('categoryId', e.target.value ? Number(e.target.value) : undefined)}>
              <option value="">بدون تصنيف</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <label><input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> نشط</label>
          <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> مميز</label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/products')}>إلغاء</button>
        </div>
      </form>
    </div>
  );
}
