export default function StaticPage({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="lore-page container">
      <header className="lore-page__header">
        <span className="scene-label">أرشيف أوربيتا</span>
        <h1 className="scene-title">{title}</h1>
        {subtitle && <p className="scene-desc">{subtitle}</p>}
      </header>
      <div className="lore-page__body holo-panel">{children}</div>
    </div>
  );
}
