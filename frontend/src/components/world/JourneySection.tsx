import type { ReactNode } from 'react';

interface Props {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  compact?: boolean;
  id?: string;
}

export default function JourneySection({ label, title, description, children, compact, id }: Props) {
  return (
    <section className={`journey-scene ${compact ? 'journey-scene--compact' : ''}`} id={id}>
      <div className="container">
        <header className="journey-header">
          <span className="scene-label">{label}</span>
          <h2 className="scene-title">{title}</h2>
          {description && <p className="scene-desc">{description}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
