import './PageHero.css';

interface Props {
  label: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHero({ label, title, description, children }: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero__glow" />
      <div className="container page-hero__inner">
        <span className="scene-label">{label}</span>
        <h1 className="scene-title">{title}</h1>
        {description && <p className="scene-desc">{description}</p>}
        {children}
      </div>
    </section>
  );
}
