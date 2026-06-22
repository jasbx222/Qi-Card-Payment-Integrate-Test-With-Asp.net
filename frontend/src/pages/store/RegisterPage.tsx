import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CosmicBackground from '../../components/world/CosmicBackground';
import './DockingPage.css';

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(username, phone, password);
      await login(phone, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="docking-page">
      <CosmicBackground variant="portal" />
      <div className="docking-card holo-panel">
        <div className="docking-card__icon"><UserPlus size={32} /></div>
        <h1>انضم لطاقم أوربيتا</h1>
        <p>احصل على بطاقة مسافر وابدأ رحلتك</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>اسم المسافر</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>إشارة الهاتف</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXXX" required />
          </div>
          <div className="form-group">
            <label>رمز الوصول</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          {error && <p className="docking-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-portal" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء بطاقة الطاقم'}
          </button>
        </form>
        <p className="docking-footer">
          لديك بطاقة؟ <Link to="/login">دخول المحطة</Link>
        </p>
      </div>
    </div>
  );
}
