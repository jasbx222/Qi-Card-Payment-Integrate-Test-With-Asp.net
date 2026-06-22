import type { ReactNode } from 'react';
import PageHero from '../../components/store/PageHero';
import TrustBlock from '../../components/store/TrustBlock';

interface Props {
  label: string;
  title: string;
  children: ReactNode;
}

export default function PolicyPage({ label, title, children }: Props) {
  return (
    <div>
      <PageHero label={label} title={title} />
      <div className="container" style={{ maxWidth: 720, paddingBottom: '3rem' }}>
        <div className="holo-panel" style={{ padding: '2rem', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
      <TrustBlock />
    </div>
  );
}
