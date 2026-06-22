import './CosmicBackground.css';

export default function CosmicBackground({ variant = 'store' }: { variant?: 'store' | 'admin' | 'portal' }) {
  return (
    <div className={`cosmic-bg cosmic-bg--${variant}`} aria-hidden>
      <div className="cosmic-bg__nebula cosmic-bg__nebula--1" />
      <div className="cosmic-bg__nebula cosmic-bg__nebula--2" />
      <div className="cosmic-bg__nebula cosmic-bg__nebula--3" />
      <div className="cosmic-bg__stars" />
      <div className="cosmic-bg__grid" />
      {variant === 'portal' && <div className="cosmic-bg__portal-ring" />}
    </div>
  );
}
