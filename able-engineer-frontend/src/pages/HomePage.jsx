import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DetailDialog from '../components/DetailDialog'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, CheckIcon, FactoryIcon, GearIcon, GlobeIcon, PackageIcon, WrenchIcon } from '../components/Icons'
import { BRANCHES, COMPANY } from '../constants/company'
import { IMAGES } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import { getLatestEvent, pickText } from '../services/eventCatalog'
import { getLatestByCategoryName } from '../services/productCatalog'
import './HomePage.css'

const WHATSAPP_NUMBER = BRANCHES[0].whatsapp.display.replace(/\D/g, '')
const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

function conditionText(t, condition) {
  if (!condition) return ''
  const key = `products.condition.${condition}`
  const label = t(key)
  return label === key ? condition : label
}

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

const BRAND_LOGOS = [
  { src: '/product-branding-list/brother.jpg', alt: 'Brother' },
  { src: '/product-branding-list/Fanuc.png', alt: 'FANUC' },
  { src: '/product-branding-list/mitsubishi.png', alt: 'Mitsubishi Electric' },
  { src: '/product-branding-list/SMC.png', alt: 'SMC' },
  { src: '/product-branding-list/tosoku.png', alt: 'Tosoku' },
]

function HomePage() {
  const { t, lang } = useLanguage()
  const [arrivals, setArrivals] = useState([])
  const [machineCategory, setMachineCategory] = useState(null)
  const [latestEvent, setLatestEvent] = useState(null)
  const [openProduct, setOpenProduct] = useState(null)
  const [openEvent, setOpenEvent] = useState(null)

  useEffect(() => {
    let cancelled = false

    getLatestByCategoryName('machine', 3)
      .then(({ category, products }) => {
        if (cancelled) return
        setMachineCategory(category)
        setArrivals(products)
      })
      .catch((err) => console.error('Could not load new arrivals', err))

    getLatestEvent()
      .then((event) => {
        if (!cancelled) setLatestEvent(event)
      })
      .catch((err) => console.error('Could not load latest event', err))

    return () => {
      cancelled = true
    }
  }, [])

  const closeProduct = useCallback(() => setOpenProduct(null), [])
  const closeEvent = useCallback(() => setOpenEvent(null), [])

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

  const eventTitle = latestEvent ? pickText(latestEvent.title, lang) : ''
  const eventSummary = latestEvent ? pickText(latestEvent.summary, lang) : ''

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

      {/* ---------------- New arrivals (latest Machine products) ---------------- */}
      {arrivals.length > 0 ? (
        <section className="section section--ice section--tight" id="new-arrival" aria-labelledby="new-arrival-title">
          <div className="container">
            <Reveal className="section-head home-events__head">
              <div>
                <h2 id="new-arrival-title" className="section-title">
                  {t('home.newArrival')}
                </h2>
              </div>
              <Link
                to={machineCategory ? `/products?category=${machineCategory.id}` : '/products'}
                className="btn btn--outline"
              >
                {t('home.eventsViewAll')} <ArrowRightIcon size={18} />
              </Link>
            </Reveal>

            <div className={`new-arrivals${arrivals.length === 1 ? ' new-arrivals--single' : ''}`}>
              {arrivals.map((product, i) => {
                const cover = product.images[0]
                return (
                  <Reveal key={product.id} delay={i * 120} className="new-arrival">
                    <div className="new-arrival__image">
                      {cover ? (
                        <img src={cover.url} alt={product.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="new-arrival__placeholder" aria-hidden="true">
                          <GearIcon size={64} strokeWidth={1.1} />
                        </div>
                      )}
                    </div>
                    <div className="new-arrival__content">
                      <h3>{product.name}</h3>
                      {product.description ? <p>{product.description}</p> : null}
                      <button type="button" className="btn btn--outline" onClick={() => setOpenProduct(product)}>
                        {t('home.seeMore')} <ArrowRightIcon size={18} />
                      </button>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- Latest event ---------------- */}
      {latestEvent ? (
        <section className="section section--panel section--tight" id="home-events" aria-labelledby="home-events-title">
          <div className="container">
            <Reveal className="section-head home-events__head">
              <div>
                <h2 id="home-events-title" className="section-title">
                  {t('home.eventsTitle')}
                </h2>
                <p className="section-lead">{t('home.eventsLead')}</p>
              </div>
              <Link to="/event" className="btn btn--outline">
                {t('home.eventsViewAll')} <ArrowRightIcon size={18} />
              </Link>
            </Reveal>

            <Reveal delay={100} className="home-event">
              <button type="button" className="home-event__main" onClick={() => setOpenEvent(latestEvent)}>
                <div className="home-event__media">
                  {latestEvent.images[0] ? (
                    <img src={latestEvent.images[0].url} alt={eventTitle} loading="lazy" decoding="async" />
                  ) : (
                    <div className="home-event__placeholder" aria-hidden="true">
                      <GearIcon size={56} strokeWidth={1.1} />
                    </div>
                  )}
                </div>
                <div className="home-event__body">
                  <h3>{eventTitle}</h3>
                  {eventSummary ? <p>{eventSummary}</p> : null}
                  <span className="btn btn--outline btn--sm home-event__cta">
                    {t('products.viewDetails')} <ArrowRightIcon size={16} />
                  </span>
                </div>
              </button>
            </Reveal>
          </div>
        </section>
      ) : null}

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

      {openProduct ? (
        <DetailDialog
          title={openProduct.name}
          description={openProduct.description}
          images={openProduct.images}
          tags={[
            { label: machineCategory?.name },
            { label: conditionText(t, openProduct.condition), dark: true },
          ]}
          enquiryLink={whatsappLink(t('products.enquireMessage', { name: openProduct.name }))}
          onClose={closeProduct}
        />
      ) : null}

      {openEvent ? (
        <DetailDialog
          title={pickText(openEvent.title, lang)}
          summary={pickText(openEvent.summary, lang)}
          description={pickText(openEvent.description, lang)}
          images={openEvent.images}
          onClose={closeEvent}
        />
      ) : null}
    </>
  )
}

export default HomePage
