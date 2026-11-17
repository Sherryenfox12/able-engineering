import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, CheckIcon, FactoryIcon, GearIcon, GlobeIcon, PackageIcon, WrenchIcon } from '../components/Icons'
import { COMPANY } from '../constants/company'
import { IMAGES } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import './HomePage.css'

// Deterministic "spark" particles for the hero animation (left %, size px, duration s, delay s)
const SPARKS = [
  [6, 4, 9, 0],
  [14, 6, 12, 2],
  [22, 3, 8, 4],
  [31, 5, 11, 1],
  [40, 4, 10, 5],
  [48, 7, 13, 3],
  [57, 3, 9, 6],
  [65, 5, 12, 0.5],
  [73, 4, 10, 2.5],
  [81, 6, 14, 4.5],
  [89, 3, 8, 1.5],
  [95, 5, 11, 3.5],
]

const SERVICE_KEYS = [
  {
    icon: FactoryIcon,
    key: 'machines',
    image: IMAGES.factory,
    to: '/products?category=machine',
  },
  {
    icon: PackageIcon,
    key: 'parts',
    image: IMAGES.machineParts,
    to: '/contact',
  },
  {
    icon: WrenchIcon,
    key: 'repair',
    image: IMAGES.technician,
    to: '/repair-service',
  },
]

const NEW_ARRIVALS = [
  {
    src: 'https://www.yamazen.com/Portals/0/brother-speedio-s1000x1-machine-min.png?ver=w70tM-wxC_xh6PXsLCr_mw%3D%3D?format=webp',
    name: 'Brother SPEEDIO S1000X1',
    textKey: 'home.arrivals.speedio',
  },
  {
    src: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310057709/BO/EC/FR/13595935/114-500x500.jpg',
    name: 'Brother TC-31B',
    textKey: 'home.arrivals.tc31b',
  },
]

const BRAND_LOGOS = [
  { src: '/product-branding-list/brother.jpg', alt: 'Brother' },
  { src: '/product-branding-list/Fanuc.png', alt: 'FANUC' },
  { src: '/product-branding-list/mitsubishi.png', alt: 'Mitsubishi Electric' },
  { src: '/product-branding-list/SMC.png', alt: 'SMC' },
  { src: '/product-branding-list/tosoku.png', alt: 'Tosoku' },
]

function HomePage() {
  const { t } = useLanguage()

  const services = SERVICE_KEYS.map(({ icon, key, image, to }) => ({
    icon,
    image,
    to,
    title: t(`home.services.${key}.title`),
    tag: t(`home.services.${key}.tag`),
    text: t(`home.services.${key}.text`),
    points: t(`home.services.${key}.points`),
    cta: t(`home.services.${key}.cta`),
  }))

  const highlights = [
    { icon: GearIcon, value: `${COMPANY.yearsExperience}+`, label: t('home.highlights.years') },
    { icon: GlobeIcon, value: t('home.highlights.market'), label: t('home.highlights.marketLabel') },
    { icon: CheckIcon, value: t('home.highlights.onestop'), label: t('home.highlights.onestopLabel') },
  ]

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" style={{ backgroundImage: `url(${IMAGES.heroBackground})` }} />
        <div className="hero__overlay" />
        <div className="hero__grid-lines" />

        <div className="hero__sparks" aria-hidden="true">
          {SPARKS.map(([left, size, duration, delay], i) => (
            <span
              key={i}
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">{t('home.eyebrow')}</span>
            <h1 id="hero-title">
              {t('home.titleBefore')} <span>{t('home.titleHighlight')}</span> {t('home.titleAfter')}
            </h1>
            <p>{t('home.lead', { years: COMPANY.yearsExperience })}</p>
            <div className="hero__actions">
              <a href="#what-we-do" className="btn btn--primary">
                {t('home.ctaExplore')} <ArrowRightIcon size={18} />
              </a>
              <Link to="/about" className="btn btn--ghost">
                {t('home.ctaAbout')}
              </Link>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__gear hero__gear--lg">
              <GearIcon size={220} strokeWidth={0.6} />
            </div>
            <div className="hero__gear hero__gear--sm">
              <GearIcon size={110} strokeWidth={0.8} />
            </div>
            <div className="hero__badge">
              <strong>{COMPANY.yearsExperience}</strong>
              <span>
                {t('home.badgeYears')}
                <br />
                {t('home.badgeIndustry')}
              </span>
            </div>
          </div>
        </div>

        <svg className="hero__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- What we do ---------------- */}
      <section className="section section--ice" id="what-we-do">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('home.whatWeDo')}</span>
            <h2 className="section-title">{t('home.servicesTitle')}</h2>
            <p className="section-lead">{t('home.servicesLead')}</p>
          </Reveal>

          <div className="services">
            {services.map(({ icon: ServiceIcon, title, tag, text, points, image, cta, to }, i) => (
              <Reveal key={title} delay={i * 120} className="service-card">
                <div className="service-card__image">
                  <img src={image} alt={title} loading="lazy" />
                  <span className="service-card__icon">
                    <ServiceIcon size={26} />
                  </span>
                </div>
                <div className="service-card__body">
                  <span className="service-card__tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <ul className="service-card__points">
                    {(Array.isArray(points) ? points : []).map((point) => (
                      <li key={point}>
                        <CheckIcon size={16} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link to={to} className="btn btn--outline service-card__cta">
                    {cta} <ArrowRightIcon size={18} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Highlights ---------------- */}
      <section className="highlights" aria-label={t('home.highlightsLabel')}>
        <div className="container highlights__grid">
          {highlights.map(({ icon: HighlightIcon, value, label }, i) => (
            <Reveal key={label} delay={i * 120} className="highlight">
              <span className="highlight__icon">
                <HighlightIcon size={30} />
              </span>
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- About teaser ---------------- */}
      <section className="section section--panel">
        <div className="container teaser">
          <Reveal className="teaser__image">
            <img src={IMAGES.machinery} alt={t('home.machineryAlt')} loading="lazy" />
          </Reveal>
          <Reveal delay={120} className="teaser__content">
            <span className="eyebrow">{t('home.aboutEyebrow')}</span>
            <h2 className="section-title">{t('home.aboutTitle')}</h2>
            <p>{t('home.aboutText')}</p>
            <Link to="/about" className="btn btn--outline">
              {t('home.aboutCta')} <ArrowRightIcon size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- New arrivals ---------------- */}
      <section className="section section--ice section--tight" id="new-arrival" aria-labelledby="new-arrival-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="new-arrival-title" className="section-title">
              {t('home.newArrival')}
            </h2>
          </Reveal>

          <div className="new-arrivals">
            {NEW_ARRIVALS.map(({ src, name, textKey }, i) => (
              <Reveal key={name} delay={i * 120} className="new-arrival">
                <div className="new-arrival__image">
                  <img src={src} alt={name} loading="lazy" />
                </div>
                <div className="new-arrival__content">
                  <h3>{name}</h3>
                  <p>{t(textKey)}</p>
                  <button type="button" className="btn btn--outline">
                    {t('home.seeMore')} <ArrowRightIcon size={18} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Brand logos ---------------- */}
      <section className="brand-marquee" aria-label={t('home.brandsLabel')}>
        <div className="brand-marquee__track">
          {[0, 1].flatMap((set) =>
            BRAND_LOGOS.map((logo) => (
              <div key={`${logo.alt}-${set}`} className="brand-marquee__item">
                <img
                  src={logo.src}
                  alt={set === 0 ? logo.alt : ''}
                  loading="lazy"
                  aria-hidden={set === 1 ? true : undefined}
                />
              </div>
            )),
          )}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="cta">
        <Reveal className="container cta__inner">
          <div>
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaText')}</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            {t('home.ctaButton')} <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default HomePage
