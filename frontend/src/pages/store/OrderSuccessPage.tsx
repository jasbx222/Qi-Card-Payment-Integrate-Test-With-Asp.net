import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Rocket, CheckCircle } from 'lucide-react';
import { storeApi, formatPrice } from '../../api/client';
import CosmicBackground from '../../components/world/CosmicBackground';
import './MissionComplete.css';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [result, setResult] = useState<{
    orderId: number;
    orderStatus: string;
    totalAmount: number;
    payments: { status: string; amount: number }[];
  } | null>(null);

  useEffect(() => {
    if (orderId) {
      storeApi.finishOrder(Number(orderId)).then((data) => {
        setResult(data as typeof result);
      }).catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="mission-complete">
      <CosmicBackground variant="portal" />
      <div className="mission-complete__inner container">
        <div className="mission-complete__icon">
          <CheckCircle size={72} color="var(--success)" />
          <div className="mission-complete__ring" />
        </div>
        <span className="scene-label">المهمة مكتملة</span>
        <h1 className="scene-title">تم إطلاق طلبك بنجاح!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {result ? `حالة المهمة: ${result.orderStatus}` : 'جاري استقبال إشارة التأكيد...'}
        </p>
        {result && (
          <div className="holo-panel" style={{ padding: '1.5rem', textAlign: 'right', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
            <p>رقم المهمة: <strong>#{result.orderId}</strong></p>
            <p>الحمولة: <strong>{formatPrice(result.totalAmount)}</strong></p>
            {result.payments?.[0] && (
              <p>حالة الدفع: <span className="badge badge-info">{result.payments[0].status}</span></p>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/account/orders" className="btn btn-secondary"><Rocket size={16} /> مهامي</Link>
          <Link to="/products" className="btn btn-primary">متابعة الاستكشاف</Link>
        </div>
      </div>
    </div>
  );
}
