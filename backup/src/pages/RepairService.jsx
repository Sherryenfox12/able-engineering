import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import {
  ArrowRightIcon,
  CheckIcon,
  GearIcon,
  PackageIcon,
  WrenchIcon,
} from '../components/Icons'
import { COMPANY } from '../constants/company'
import { IMAGES } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import './RepairService.css'

const SERVICE_DEFS = [
  { icon: WrenchIcon, key: 'preventive' },
  { icon: GearIcon, key: 'repair' },
  { icon: PackageIcon, key: 'overhaul' },
]

const PROCESS_STEPS = ['01', '02', '03']

function RepairService() {
  const { t } = useLanguage()
  const coverage = t('repair.coverage')
  const whyPoints = t('repair.why', { regions: t('company.regions') })

  const services = SERVICE_DEFS.map(({ icon, key }) => ({
    icon,
    title: t(`repair.services.${key}.title`),
    text: t(`repair.services.${key}.text`),
  }))

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.technician})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">{t('repair.eyebrow')}</span>
          <h1>{t('repair.title')}</h1>
          <p>{t('repair.lead')}</p>
        </div>
        <svg className="page-banner__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- Intro ---------------- */}
      <section className="section section--ice">
        <div className="container rs-split">
          <Reveal className="rs-split__content">
            <span className="eyebrow">{t('repair.support')}</span>
            <h2 className="section-title">
              {t('repair.introTitle')}
              <br />
              {t('repair.introTitleLine2')}
            </h2>
            <p>{t('repair.introP1')}</p>
            <p>{t('repair.introP2', { years: COMPANY.yearsExperience })}</p>
            <ul className="rs-chips">
              {(Array.isArray(coverage) ? coverage : []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="rs-split__image">
            <img src={IMAGES.engineer} alt={t('repair.techAlt')} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ---------------- What we offer ---------------- */}
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('repair.offerEyebrow')}</span>
            <h2 className="section-title">{t('repair.offerTitle')}</h2>
            <p className="section-lead">{t('repair.offerLead')}</p>
          </Reveal>

          <div className="rs-offers">
            {services.map(({ icon: ServiceIcon, title, text }, i) => (
              <Reveal key={title} delay={i * 100} className="rs-offer">
                <span className="rs-offer__icon">
                  <ServiceIcon size={28} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="section section--ice">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('repair.howEyebrow')}</span>
            <h2 className="section-title">{t('repair.howTitle')}</h2>
          </Reveal>

          <div className="rs-process">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step} delay={i * 100} className="rs-process__item">
                <span className="rs-process__step">{step}</span>
                <h3>{t(`repair.process.${step}.title`)}</h3>
                <p>{t(`repair.process.${step}.text`)}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="rs-points">
            <h3>{t('repair.whyTitle')}</h3>
            <ul>
              {(Array.isArray(whyPoints) ? whyPoints : []).map((point) => (
                <li key={point}>
                  <CheckIcon size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="cta">
        <Reveal className="container cta__inner">
          <div>
            <h2>{t('repair.ctaTitle')}</h2>
            <p>{t('repair.ctaText')}</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            {t('repair.ctaButton')} <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default RepairService
