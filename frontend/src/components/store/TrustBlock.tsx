import { Shield, Truck, CreditCard, Headphones } from 'lucide-react';
import './TrustBlock.css';

const ITEMS = [
  { icon: Shield, title: 'دفع آمن', desc: 'بوابة Qi Card مشفّرة' },
  { icon: Truck, title: 'توصيل سريع', desc: 'لجميع محافظات العراق' },
  { icon: CreditCard, title: 'دفع مرن', desc: 'بطاقة إلكترونية فورية' },
  { icon: Headphones, title: 'دعم مسافرين', desc: 'فريق أوربيتا جاهز' },
];

export default function TrustBlock() {
  return (
    <div className="trust-block">
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="trust-block__item holo-panel">
          <div className="trust-block__icon"><Icon size={22} /></div>
          <div>
            <strong>{title}</strong>
            <span>{desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
