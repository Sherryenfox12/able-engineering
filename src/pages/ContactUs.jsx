import Reveal from '../components/Reveal'
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons'
import { BRANCHES } from '../constants/company'
import { IMAGES } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import './ContactUs.css'

const mapSrc = (address) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

function ContactUs() {
  const { t } = useLanguage()

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.machineParts})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">{t('contact.eyebrow')}</span>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.lead')}</p>
        </div>
        <svg className="page-banner__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- Branches ---------------- */}
      <section className="section section--ice">
        <div className="container">
          {BRANCHES.map((branch) => {
            const branchName = t(`contact.branches.${branch.name}`) || branch.name

            return (
              <div key={branch.name} className="branch">
                <Reveal className="branch__card">
                  <span className="eyebrow">{t('contact.location')}</span>
                  <h2 className="section-title">{branchName}</h2>

                  <ul className="contact-list">
                    <li>
                      <span className="contact-list__icon">
                        <MailIcon size={22} />
                      </span>
                      <div>
                        <span className="contact-list__label">{t('contact.email')}</span>
                        <span className="contact-list__value">{branch.email}</span>
                      </div>
                    </li>

                    <li>
                      <span className="contact-list__icon contact-list__icon--whatsapp">
                        <WhatsAppIcon size={22} />
                      </span>
                      <div>
                        <span className="contact-list__label">{t('contact.whatsapp')}</span>
                        <a
                          className="contact-list__value"
                          href={branch.whatsapp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {branch.whatsapp.display}
                        </a>
                      </div>
                    </li>

                    <li>
                      <span className="contact-list__icon">
                        <PhoneIcon size={22} />
                      </span>
                      <div>
                        <span className="contact-list__label">{t('contact.phone')}</span>
                        <a className="contact-list__value" href={`tel:${branch.phone.tel}`}>
                          {branch.phone.display}
                        </a>
                      </div>
                    </li>

                    <li>
                      <span className="contact-list__icon">
                        <MapPinIcon size={22} />
                      </span>
                      <div>
                        <span className="contact-list__label">{t('contact.warehouse')}</span>
                        <span className="contact-list__value">{branch.warehouse}</span>
                      </div>
                    </li>
                  </ul>

                  <a
                    className="btn btn--primary btn--whatsapp"
                    href={branch.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={20} /> {t('contact.chatWhatsApp')}
                  </a>
                </Reveal>

                <Reveal delay={120} className="branch__map">
                  <iframe
                    title={t('contact.mapTitle', { name: branchName })}
                    src={mapSrc(branch.warehouse)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </Reveal>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default ContactUs
