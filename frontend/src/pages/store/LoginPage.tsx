import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ACCOUNTS, type DemoAccount } from '../../api/demoAccounts';
import CosmicBackground from '../../components/world/CosmicBackground';
import './DockingPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(phone, password);
      if (res.roles?.includes('Admin')) navigate('/admin');
      else navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (account: DemoAccount) => {
    setPhone(account.phone);
    setPassword(account.password);
    setLoading(true);
    setError('');
    try {
      const res = await login(account.phone, account.password);
      if (res.roles?.includes('Admin')) navigate('/admin');
      else navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="docking-page">
      <CosmicBackground variant="portal" />
      <div className="docking-card holo-panel">
        <div className="docking-card__icon"><Radar size={32} /></div>
        <h1>دخول المحطة</h1>
        <p>مرحباً بعودتك أيها المسافر</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>إشارة الهاتف</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXXX" required dir="ltr" />
          </div>
          <div className="form-group">
            <label>رمز الوصول</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="docking-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-portal" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'جاري الاتصال...' : 'دخول'}
          </button>
        </form>

        <div className="docking-demo">
          <span className="docking-demo__label">حسابات تجريبية</span>
          <button
            type="button"
            className="docking-demo__btn"
            disabled={loading}
            onClick={() => quickLogin(DEMO_ACCOUNTS.customer)}
          >
            <User size={16} />
            <span>
              <strong>{DEMO_ACCOUNTS.customer.label}</strong>
              <small dir="ltr">{DEMO_ACCOUNTS.customer.phone} · User@123</small>
            </span>
          </button>
          <button
            type="button"
            className="docking-demo__btn docking-demo__btn--admin"
            disabled={loading}
            onClick={() => quickLogin(DEMO_ACCOUNTS.admin)}
          >
            <Shield size={16} />
            <span>
              <strong>{DEMO_ACCOUNTS.admin.label}</strong>
              <small dir="ltr">{DEMO_ACCOUNTS.admin.phone} · Admin@123</small>
            </span>
          </button>
        </div>

        <p className="docking-footer">
          ليس لديك بطاقة طاقم؟ <Link to="/register">انضم للمهمة</Link>
        </p>
      </div>
    </div>
  );
}
