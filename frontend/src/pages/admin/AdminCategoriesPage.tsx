import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/client';
import type { Category } from '../../api/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', sortOrder: 0, isActive: true });

  const load = () => adminApi.categories.list().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.categories.create(form);
    setForm({ name: '', description: '', imageUrl: '', sortOrder: 0, isActive: true });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف التصنيف؟')) return;
    await adminApi.categories.delete(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>إدارة التصنيفات</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={18} /> إضافة</button>
      </div>
      {showForm && (
        <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleCreate}>
          <div className="form-group"><label>الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>الوصف</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label>رابط الصورة</label><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">حفظ</button>
        </form>
      )}
      <div className="card table-wrap">
        <table>
          <thead><tr><th>الاسم</th><th>المنتجات</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.productCount || 0}</td>
                <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-error'}`}>{c.isActive ? 'نشط' : 'معطّل'}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
