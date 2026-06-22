import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Truck, Gift, Compass, HelpCircle } from 'lucide-react';
import { storeApi } from '../../api/client';
import type { Product, Category, Banner } from '../../api/types';
import ProductCard from '../../components/ProductCard';
import JourneySection from '../../components/world/JourneySection';
import PlanetCard from '../../components/world/PlanetCard';
import SafeImage from '../../components/SafeImage';
import { bannerImage } from '../../lib/images';
import TrustBlock from '../../components/store/TrustBlock';
import './HomePage.css';

const LORE = [
  { icon: Zap, text: 'كنوز حصرية من مجرات بعيدة' },
  { icon: Shield, text: 'دفع آمن عبر بوابة كي كارد' },
  { icon: Truck, text: 'توصيل لكل محافظات العراق' },
];

const TESTIMONIALS = [
  { name: 'سارة من بغداد', text: 'ما توقعت التسوق يكون تجربة كاملة — كأني بلعبة فضائية!' },
  { name: 'علي من البصرة', text: 'المنتجات وصلت بسرعة والتغليف كان خرافي.' },
  { name: 'نور من أربيل', text: 'أفضل متجر كارتوني بالعراق، فعلاً مختلف.' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    storeApi.getProducts().then(setProducts).catch(console.error);
    storeApi.getProducts({ featured: 'true' }).then(setFeatured).catch(console.error);
    storeApi.getCategories().then(setCategories).catch(console.error);
    storeApi.getBanners('hero').then((b: Banner[]) => setBanner(b[0] || null)).catch(console.error);
  }, []);

  const spotlight = (featured.length ? featured : products)[0];
  const drops = (featured.length ? featured : products).slice(0, 4);
  const arrivals = products.slice(0, 6);
  const bestsellers = products.slice(0, 4);
  const bundles = products.slice(2, 5);

  return (
    <div className="home-universe">
      {/* ═══ SCENE 1: ARRIVAL PORTAL ═══ */}
      <section className="portal-arrival">
        <div className="portal-arrival__aura" aria-hidden />
        <div className="portal-arrival__content container">
          <div className="portal-arrival__text">
            <span className="portal-arrival__signal">
              <span className="pulse-dot" /> إشارة واردة من المجرة
            </span>
            <h1 className="portal-arrival__title">
              {banner?.title || 'ادخل بوابة أوربيتا'}
            </h1>
            <p className="portal-arrival__desc">
              {banner?.subtitle || 'ليس متجراً عادياً — عالم كارتوني حيّ بين النجوم. اكتشف كنوزاً نادرة، تابع مهماتك، واحمل غنائمك إلى الأرض.'}
            </p>
            <div className="portal-arrival__actions">
              <Link to="/products" className="btn btn-primary btn-portal">
                {banner?.ctaText || 'ابدأ الاستكشاف'}
                <ArrowLeft size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary">أسطورة المجرّة</Link>
            </div>
            <div className="portal-arrival__stats">
              <div><strong>+{products.length || 6}</strong><span>كنز</span></div>
              <div><strong>{categories.length || 3}</strong><span>كواكب</span></div>
              <div><strong>4.9</strong><span>تقييم</span></div>
            </div>
          </div>
          <div className="portal-arrival__visual">
            <div className="portal-gate">
              <div className="portal-gate__ring portal-gate__ring--1" />
              <div className="portal-gate__ring portal-gate__ring--2" />
              <div className="portal-gate__core">
                <SafeImage
                  src={bannerImage('hero', banner?.imageUrl)}
                  alt="بوابة أوربيتا"
                  fallback="/images/portal-hero.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="portal-arrival__scroll">
          <span>مرر للاستكشاف</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="orbit-divider" />

      {/* ═══ SCENE 2: WORLD DISCOVERY ═══ */}
      <JourneySection
        id="worlds"
        label="المرحلة ٢ — اكتشاف العوالم"
        title="اختر كوكبك وابدأ المهمة"
        description="كل تصنيف عالم كارتوني بمدار خاص — ادخل واستكشف كنوزه."
      >
        <div className="planets-orbit">
          {categories.map((c, i) => (
            <PlanetCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </JourneySection>

      <div className="orbit-divider" />

      {/* ═══ SCENE 3: SPOTLIGHT LOOT ═══ */}
      {spotlight && (
        <JourneySection
          label="اكتشاف مميز"
          title="الكنز الأسطوري لهذا الأسبوع"
          compact
        >
          <ProductCard product={spotlight} variant="spotlight" />
        </JourneySection>
      )}

      {/* ═══ SCENE 4: MISSION DROPS ═══ */}
      <JourneySection
        label="المرحلة ٣ — إسقاطات المهمة"
        title="مجموعات نادرة من المدار"
        description="منتجات مختارة من فريق أوربيتا — أندر الكنوز أولاً."
      >
        <div className="section-row">
          <Link to="/products?featured=true" className="section-row__link">كل الإسقاطات ←</Link>
        </div>
        <div className="grid-loot">
          {drops.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </JourneySection>

      {/* ═══ SCENE 5: NEW SIGNALS ═══ */}
      <JourneySection
        label="إشارات جديدة"
        title="وصل للتو من أقاصي المجرة"
        compact
      >
        <div className="loot-carousel">
          {arrivals.map((p) => (
            <div key={p.id} className="loot-carousel__item">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </JourneySection>

      {/* ═══ SCENE 6: PORTAL EVENT ═══ */}
      <section className="portal-event container">
        <div className="portal-event__inner">
          <span className="badge badge-mission">حدث كوني · محدود</span>
          <h2>نافذة الصيف الفضائية — خصم ٢٠٪</h2>
          <p>على مختارات من ألعاب المجرة — العرض ينتهي قريباً</p>
          <Link to="/drops" className="btn btn-primary">ادخل الحدث</Link>
        </div>
      </section>

      {/* ═══ SCENE 7: TRUST SIGNALS ═══ */}
      <section className="container" style={{ padding: '2rem 0' }}>
        <TrustBlock />
      </section>

      {/* ═══ SCENE 8: BESTSELLERS ═══ */}
      <JourneySection
        label="كنوز المسافرين"
        title="الأكثر طلباً في المجرة"
        compact
      >
        <div className="section-row">
          <Link to="/bestsellers" className="section-row__link">كل الأكثر مبيعاً ←</Link>
        </div>
        <div className="grid-loot">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </JourneySection>

      {/* ═══ SCENE 9: GIFT BUNDLES ═══ */}
      <JourneySection
        label="حزم هدايا"
        title="مجموعات جاهزة للإهداء"
        description="اختر حزمة كاملة — تغليف فضائي مميز"
        compact
      >
        <div className="editorial-grid">
          <div className="editorial-card holo-panel">
            <Gift size={32} color="var(--orbit-magenta)" />
            <h3>حزمة المغامر الصغير</h3>
            <p>شخصية + لعبة + ملصقات — هدية مثالية</p>
            <Link to="/products" className="btn btn-secondary btn-sm">استكشف الحزم</Link>
          </div>
          <div className="grid-loot" style={{ gridColumn: 'span 2' }}>
            {bundles.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </JourneySection>

      {/* ═══ SCENE 10: UNIVERSE LORE ═══ */}
      <JourneySection
        label="أسطورة أوربيتا"
        title="من نحن في هذا الكون؟"
        description="ولدت أوربيتا من حلم بسيط: ما إذا كان التسوق يقدر يكون مغامرة؟"
        compact
      >
        <div className="lore-grid">
          <div className="lore-story holo-panel">
            <p>
              في قلب مجرّة بعيدة، اكتشفنا محطة كارتونية تطفو بين النجوم — مليئة بشخصيات، ألعاب، وكنوز نادرة.
              كل منتج عندنا ليس سلعة فقط، بل قطعة من عالم خيالي نصنعه لعشاق الكارتون في العراق والعالم العربي.
            </p>
            <Link to="/about" className="btn btn-secondary btn-sm">اقرأ القصة كاملة</Link>
          </div>
          <div className="lore-trust">
            {LORE.map(({ icon: Icon, text }) => (
              <div key={text} className="lore-trust__item holo-panel">
                <Icon size={22} color="var(--orbit-cyan)" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </JourneySection>

      {/* ═══ SCENE 11: TRAVELER VOICES ═══ */}
      <JourneySection label="أصوات المسافرين" title="ماذا يقول طاقم أوربيتا؟" compact>
        <div className="voices-grid">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="voice-card holo-panel">
              <p>"{t.text}"</p>
              <footer>— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </JourneySection>

      {/* ═══ SCENE 12: DISCOVER MAP CTA ═══ */}
      <section className="discover-cta container">
        <div className="discover-cta__inner holo-panel">
          <Compass size={48} color="var(--orbit-cyan)" style={{ opacity: 0.7 }} />
          <h2>خريطة المجرة بانتظارك</h2>
          <p>استكشف كل الكواكب والمجموعات في رحلة بصرية واحدة</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/discover" className="btn btn-primary">افتح الخريطة</Link>
            <Link to="/collections" className="btn btn-secondary">المجموعات</Link>
          </div>
        </div>
      </section>

      {/* ═══ SCENE 13: FAQ QUICK ═══ */}
      <section className="container faq-quick" style={{ padding: '3rem 0' }}>
        <div className="faq-quick__grid">
          <Link to="/faq" className="faq-quick__item holo-panel">
            <HelpCircle size={22} color="var(--orbit-cyan)" />
            <span>دليل المسافر</span>
          </Link>
          <Link to="/track-order" className="faq-quick__item holo-panel">
            <Compass size={22} color="var(--orbit-violet)" />
            <span>تتبع المهمة</span>
          </Link>
          <Link to="/policies/shipping" className="faq-quick__item holo-panel">
            <Truck size={22} color="var(--orbit-magenta)" />
            <span>سياسة الشحن</span>
          </Link>
          <Link to="/contact" className="faq-quick__item holo-panel">
            <Shield size={22} color="var(--orbit-gold)" />
            <span>تواصل معنا</span>
          </Link>
        </div>
      </section>

      {/* ═══ SCENE 14: JOIN CREW ═══ */}
      <section className="join-crew container">
        <div className="join-crew__inner holo-panel">
          <h2>انضم لطاقم أوربيتا</h2>
          <p>كن أول من يعرف عن الإسقاطات الجديدة والمهمات الحصرية</p>
          <form className="join-crew__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="بريدك الإلكتروني" />
            <button type="submit" className="btn btn-primary">اشترك</button>
          </form>
        </div>
      </section>
    </div>
  );
}
