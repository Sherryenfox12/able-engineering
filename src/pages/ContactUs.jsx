import Reveal from '../components/Reveal'
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons'
import { BRANCHES } from '../constants/company'
import { IMAGES } from '../constants/images'
import './ContactUs.css'

const mapSrc = (address) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

function ContactUs() {
  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.machineParts})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Looking for a CNC machine, spare parts or maintenance support? Talk to our team.</p>
        </div>
      </section>

      {/* ---------------- Branches ---------------- */}
      <section className="section">
        <div className="container">
          {BRANCHES.map((branch) => (
            <div key={branch.name} className="branch">
              <Reveal className="branch__card">
                <span className="eyebrow">Our Location</span>
                <h2 className="section-title">{branch.name}</h2>

                <ul className="contact-list">
                  <li>
                    <span className="contact-list__icon">
                      <MailIcon size={22} />
                    </span>
                    <div>
                      <span className="contact-list__label">Email</span>
                      <span className="contact-list__value">{branch.email}</span>
                    </div>
                  </li>

                  <li>
                    <span className="contact-list__icon contact-list__icon--whatsapp">
                      <WhatsAppIcon size={22} />
                    </span>
                    <div>
                      <span className="contact-list__label">WhatsApp</span>
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
                      <span className="contact-list__label">Phone</span>
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
                      <span className="contact-list__label">Warehouse</span>
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
                  <WhatsAppIcon size={20} /> Chat on WhatsApp
                </a>
              </Reveal>

              <Reveal delay={120} className="branch__map">
                <iframe
                  title={`${branch.name} location map`}
                  src={mapSrc(branch.warehouse)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ContactUs
