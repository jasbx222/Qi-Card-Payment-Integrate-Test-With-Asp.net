import { Link } from 'react-router-dom';
import type { Category } from '../../api/types';
import SafeImage from '../SafeImage';
import './MegaMenu.css';

interface Props {
  categories: Category[];
  open: boolean;
  onClose: () => void;
}

const QUICK = [
  { to: '/new', label: 'وصل حديثاً', desc: 'إشارات جديدة' },
  { to: '/bestsellers', label: 'الأكثر مبيعاً', desc: 'كنوز المسافرين' },
  { to: '/drops', label: 'إسقاطات محدودة', desc: 'حملات حصرية' },
  { to: '/discover', label: 'اكتشف العوالم', desc: 'خريطة المجرة' },
];

export default function MegaMenu({ categories, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="mega-menu" onMouseLeave={onClose}>
      <div className="container mega-menu__grid">
        <div className="mega-menu__col">
          <h4>الكواكب</h4>
          {categories.map((c) => (
            <Link key={c.id} to={`/collections/${c.id}`} onClick={onClose} className="mega-menu__link">
              <SafeImage variant="category" slug={c.slug} src={c.imageUrl} alt="" />
              <span>{c.name}</span>
            </Link>
          ))}
          <Link to="/collections" onClick={onClose} className="mega-menu__all">كل المجموعات ←</Link>
        </div>
        <div className="mega-menu__col">
          <h4>مسارات سريعة</h4>
          {QUICK.map((q) => (
            <Link key={q.to} to={q.to} onClick={onClose} className="mega-menu__quick">
              <strong>{q.label}</strong>
              <span>{q.desc}</span>
            </Link>
          ))}
        </div>
        <div className="mega-menu__promo holo-panel">
          <span className="badge badge-mission">حدث كوني</span>
          <h3>رحلة الصيف الفضائية</h3>
          <p>خصم ٢٠٪ على مختارات مختارة</p>
          <Link to="/drops" className="btn btn-primary btn-sm" onClick={onClose}>ادخل الحدث</Link>
        </div>
      </div>
    </div>
  );
}
