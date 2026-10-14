import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, CheckIcon, FactoryIcon, GearIcon, GlobeIcon, PackageIcon, WrenchIcon } from '../components/Icons'
import { COMPANY } from '../constants/company'
import { IMAGES } from '../constants/images'
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

const SERVICES = [
  {
    icon: FactoryIcon,
    title: 'Used CNC Machines',
    tag: 'Looking for a machine?',
    text: 'Quality pre-owned CNC machines, with a strong focus on Brother CNC machining centres.',
    points: ['Brother machining centres', 'Inspected & ready for production', 'Sourcing on request'],
    image: IMAGES.factory,
    cta: 'View Available Machines',
    href: '#new-arrival',
  },
  {
    icon: PackageIcon,
    title: 'CNC Spare Parts',
    tag: 'Need a part?',
    text: 'Genuine and compatible CNC parts supplied with confidence.',
    points: ['Spindles, ball screws & linear guides', 'Servo motors & drives', 'Tool changers & control boards'],
    image: IMAGES.machineParts,
    cta: 'Enquire About Parts',
    to: '/contact',
  },
  {
    icon: WrenchIcon,
    title: 'Maintenance & Repair',
    tag: 'Machine down?',
    text: 'On-site support to reduce downtime and improve efficiency.',
    points: ['Preventive maintenance', 'Repair & machine overhaul', 'Automation upgrades'],
    image: IMAGES.technician,
    cta: 'Request Service Support',
    to: '/contact',
  },
]

const HIGHLIGHTS = [
  { icon: GearIcon, value: `${COMPANY.yearsExperience}+`, label: 'Years of industry experience' },
  { icon: GlobeIcon, value: 'Multi-Market', label: 'Service & support across the region' },
  { icon: CheckIcon, value: 'One-Stop', label: 'CNC solutions under one roof' },
]

const NEW_ARRIVALS = [
  {
    src: 'https://www.yamazen.com/Portals/0/brother-speedio-s1000x1-machine-min.png?ver=w70tM-wxC_xh6PXsLCr_mw%3D%3D?format=webp',
    name: 'Brother SPEEDIO S1000X1',
    text: 'A high-speed compact machining centre built for precision and productivity. Featuring a 21-tool turret and advanced digital control, this Brother SPEEDIO is ready to support demanding production work.',
  },
  {
    src: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310057709/BO/EC/FR/13595935/114-500x500.jpg',
    name: 'Brother TC-31B',
    text: 'A reliable Brother vertical machining centre with a clear work view, practical control panel and proven build quality — a solid choice for shops looking for dependable CNC capacity.',
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
            <span className="hero__eyebrow">Professional CNC Solutions</span>
            <h1 id="hero-title">
              Your CNC Partner for <span>Reliable Engineering</span> Support
            </h1>
            <p>
              Used CNC machines, spare parts, maintenance and overhaul. Able Engineering keeps your
              production moving with practical solutions backed by {COMPANY.yearsExperience} years of
              experience.
            </p>
            <div className="hero__actions">
              <a href="#what-we-do" className="btn btn--primary">
                Explore What We Do <ArrowRightIcon size={18} />
              </a>
              <Link to="/about" className="btn btn--ghost">
                About Us
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
                Years of
                <br />
                Industry Experience
              </span>
            </div>
          </div>
        </div>

        <svg className="hero__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,80 1440,0 1440,80" fill="#ffffff" />
        </svg>
      </section>

      {/* ---------------- What we do ---------------- */}
      <section className="section" id="what-we-do">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2 className="section-title">Machines, Parts &amp; Maintenance in One Place</h2>
            <p className="section-lead">
              Choose what you need below. Each service has its own details and a direct way to get
              in touch.
            </p>
          </Reveal>

          <div className="services">
            {SERVICES.map(({ icon: ServiceIcon, title, tag, text, points, image, cta, to, href }, i) => (
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
                    {points.map((point) => (
                      <li key={point}>
                        <CheckIcon size={16} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {to ? (
                    <Link to={to} className="btn btn--outline service-card__cta">
                      {cta} <ArrowRightIcon size={18} />
                    </Link>
                  ) : (
                    <a href={href} className="btn btn--outline service-card__cta">
                      {cta} <ArrowRightIcon size={18} />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Highlights ---------------- */}
      <section className="highlights" aria-label="Company highlights">
        <div className="container highlights__grid">
          {HIGHLIGHTS.map(({ icon: HighlightIcon, value, label }, i) => (
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
      <section className="section">
        <div className="container teaser">
          <Reveal className="teaser__image">
            <img src={IMAGES.machinery} alt="CNC machinery at work" loading="lazy" />
          </Reveal>
          <Reveal delay={120} className="teaser__content">
            <span className="eyebrow">About Able Engineering</span>
            <h2 className="section-title">Built on Experience. Driven by Technical Expertise.</h2>
            <p>
              We are a professional engineering service company specializing in CNC machinery,
              helping customers maintain machine reliability, reduce downtime and improve overall
              production efficiency.
            </p>
            <Link to="/about" className="btn btn--outline">
              Learn More About Us <ArrowRightIcon size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- New arrivals ---------------- */}
      <section className="section section--tight" id="new-arrival" aria-labelledby="new-arrival-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="new-arrival-title" className="section-title">
              New Arrival
            </h2>
          </Reveal>

          <div className="new-arrivals">
            {NEW_ARRIVALS.map(({ src, name, text }, i) => (
              <Reveal key={name} delay={i * 120} className="new-arrival">
                <div className="new-arrival__image">
                  <img src={src} alt={name} loading="lazy" />
                </div>
                <div className="new-arrival__content">
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <button type="button" className="btn btn--outline">
                    See More Details <ArrowRightIcon size={18} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Brand logos ---------------- */}
      <section className="brand-marquee" aria-label="Product brands we support">
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
            <h2>Need a machine, a part or a maintenance partner?</h2>
            <p>Talk to our team and keep your production moving forward.</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            Contact Us <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default HomePage
