import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, FlagIcon, GearIcon, GlobeIcon, CheckIcon, TargetIcon } from '../components/Icons'
import { COMPANY } from '../constants/company'
import { ABOUT_GALLERY, FACTORY } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import './AboutUs.css'

function AboutUs() {
  const { t } = useLanguage()
  const focusAreas = t('about.focus')
  const capabilities = t('about.capabilities')

  const experienceStats = [
    { icon: GearIcon, value: `${COMPANY.yearsExperience}+`, label: t('about.stats.years') },
    { icon: GlobeIcon, value: t('about.stats.market'), label: t('about.stats.marketLabel') },
    { icon: CheckIcon, value: t('about.stats.onestop'), label: t('about.stats.onestopLabel') },
  ]

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${FACTORY.outside})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">{t('about.eyebrow')}</span>
          <h1>{t('about.title')}</h1>
          <p>{t('about.lead')}</p>
        </div>
        <svg className="page-banner__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- About ---------------- */}
      <section className="section section--ice">
        <div className="container split">
          <Reveal className="split__content">
            <span className="eyebrow">{t('about.whoWeAre')}</span>
            <h2 className="section-title">
              {t('about.partnerTitle')}
              <br />
              {t('about.partnerTitleLine2')}
            </h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
            <ul className="chips">
              {(Array.isArray(focusAreas) ? focusAreas : []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="split__image">
            <img src={FACTORY.inside} alt={t('about.factoryAlt')} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Vision & Mission ---------------- */}
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('about.vmEyebrow')}</span>
            <h2 className="section-title">{t('about.vmTitle')}</h2>
          </Reveal>

          <div className="vm">
            <Reveal className="vm__image">
              <img src={FACTORY.machine} alt={t('about.engineersAlt')} loading="lazy" />
              <div className="vm__caption">
                <span>{t('about.vmCaption')}</span>
              </div>
            </Reveal>

            <div className="vm__cards">
              <Reveal delay={100} className="vm-card">
                <span className="vm-card__icon">
                  <FlagIcon size={30} />
                </span>
                <h3>{t('about.vision')}</h3>
                <p>{t('about.visionText')}</p>
              </Reveal>
              <Reveal delay={220} className="vm-card">
                <span className="vm-card__icon">
                  <TargetIcon size={30} />
                </span>
                <h3>{t('about.mission')}</h3>
                <p>{t('about.missionText')}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Experience ---------------- */}
      <section className="section section--ice">
        <div className="container split split--reverse">
          <Reveal className="split__image">
            <img src={FACTORY.worker} alt={t('about.techAlt')} loading="lazy" />
          </Reveal>

          <Reveal delay={120} className="split__content">
            <span className="eyebrow">{t('about.experience')}</span>
            <h2 className="section-title">
              {t('about.experienceTitle')}
              <br />
              {t('about.experienceTitleLine2')}
            </h2>
            <p>{t('about.experienceP1')}</p>
            <p>{t('about.experienceP2')}</p>
            <ul className="chips">
              {(Array.isArray(capabilities) ? capabilities : []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{t('about.experienceP3')}</p>
          </Reveal>
        </div>

        <div className="container stats">
          {experienceStats.map(({ icon: StatIcon, value, label }, i) => (
            <Reveal key={label} delay={i * 120} className="stat">
              <span className="stat__icon">
                <StatIcon size={28} />
              </span>
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Facility gallery ---------------- */}
      <section className="section section--panel" aria-labelledby="about-gallery-title">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('about.galleryEyebrow')}</span>
            <h2 id="about-gallery-title" className="section-title">
              {t('about.galleryTitle')}
            </h2>
            <p className="section-lead">{t('about.galleryLead')}</p>
          </Reveal>

          <div className="about-gallery">
            {ABOUT_GALLERY.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 80} className="about-gallery__item">
                <img src={src} alt={t('about.galleryAlt', { n: i + 1 })} loading="lazy" decoding="async" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Regional support ---------------- */}
      <section className="region">
        <Reveal className="container region__inner">
          <div>
            <span className="eyebrow">{t('about.journey')}</span>
            <h2>{t('about.regionTitle')}</h2>
            <p>{t('about.regionText', { regions: t('company.regions') })}</p>
          </div>
          <Link to="/" className="btn btn--primary">
            {t('about.backHome')} <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default AboutUs
