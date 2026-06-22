import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi, formatPrice } from '../../api/client';
import type { Product } from '../../api/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.products.list().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذا المنتج؟')) return;
    await adminApi.products.delete(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>إدارة المنتجات</h1>
        <Link to="/admin/products/new" className="btn btn-primary"><Plus size={18} /> إضافة منتج</Link>
      </div>
      <div className="card table-wrap">
        {loading ? <p>جاري التحميل...</p> : (
          <table>
            <thead>
              <tr>
                <th>الصورة</th><th>الاسم</th><th>SKU</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /></td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td style={{ color: p.stockQuantity < 5 ? 'var(--warning)' : undefined }}>{p.stockQuantity}</td>
                  <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>{p.isActive ? 'نشط' : 'معطّل'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm"><Pencil size={16} /></Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
