import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radar } from 'lucide-react';
import PageHero from '../../components/store/PageHero';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PageHero
        label="تتبع المهمة"
        title="أين حمولتك الآن؟"
        description="أدخل رقم المهمة ورقم هاتفك لتتبع حالة الطلب."
      />
      <div className="container" style={{ maxWidth: 480, paddingBottom: '4rem' }}>
        <form className="holo-panel" style={{ padding: '2rem' }} onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>رقم المهمة</label>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="#1234" />
          </div>
          <div className="form-group">
            <label>رقم الهاتف</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXXX" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            للمسجّلين: تتبع مباشر من <Link to="/account/orders" style={{ color: 'var(--orbit-cyan)' }}>طلباتي</Link>
          </p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Radar size={18} /> مسح الإشارة
          </button>
        </form>
      </div>
    </div>
  );
}
