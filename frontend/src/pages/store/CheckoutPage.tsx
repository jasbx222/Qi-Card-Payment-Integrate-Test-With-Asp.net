import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Shield, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { storeApi, formatPrice } from '../../api/client';
import SafeImage from '../../components/SafeImage';
import './LaunchBay.css';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  if (!token) {
    return (
      <div className="launch-bay container">
        <div className="launch-denied holo-panel">
          <h2>يجب تسجيل الدخول للمحطة</h2>
          <p>المسافرون المسجّلون فقط يمكنهم إطلاق المهمات</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>دخول المحطة</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await storeApi.checkout(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );
      clear();
      if (res.formUrl) window.location.href = res.formUrl;
      else navigate(`/order/success?orderId=${res.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل إطلاق المهمة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="launch-bay container">
      <header className="launch-header">
        <span className="scene-label">منصة الإطلاق</span>
        <h1 className="scene-title">تأكيد المهمة النهائية</h1>
      </header>

      <div className="launch-steps">
        {['مراجعة الحمولة', 'تأكيد الإطلاق', 'الدفع'].map((s, i) => (
          <div key={s} className={`launch-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <span className="launch-step__num">{step > i ? <CheckCircle2 size={16} /> : i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="launch-grid">
        <div className="launch-manifest holo-panel">
          <h3>بيان الحمولة</h3>
          {items.map((item) => (
            <div key={item.product.id} className="launch-item">
              <SafeImage variant="product" sku={item.product.sku} src={item.product.imageUrl} alt="" />
              <div>
                <strong>{item.product.name}</strong>
                <span>× {item.quantity}</span>
              </div>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="launch-total">
            <span>الإجمالي</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>

        <div className="launch-boarding holo-panel">
          <h3><Shield size={18} /> بوابة الدفع الآمنة</h3>
          <p>سيتم توجيهك لبوابة Qi Card لإتمام الدفع — محمي ومشفّر</p>

          {error && <div className="launch-error">{error}</div>}

          {step < 3 ? (
            <button className="btn btn-primary btn-portal" style={{ width: '100%' }} onClick={() => setStep(step + 1)}>
              متابعة
            </button>
          ) : (
            <button className="btn btn-primary btn-portal" style={{ width: '100%' }} onClick={handlePay} disabled={loading}>
              <Rocket size={18} />
              {loading ? 'جاري الإطلاق...' : 'إطلاق الدفع'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
