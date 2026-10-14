import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, FlagIcon, GearIcon, GlobeIcon, CheckIcon, TargetIcon } from '../components/Icons'
import { COMPANY } from '../constants/company'
import { IMAGES } from '../constants/images'
import './AboutUs.css'

const FOCUS_AREAS = ['CNC Machines', 'Maintenance', 'Repair', 'Spare Parts', 'Engineering Support']

const CAPABILITIES = ['Spindles', 'Ball screws', 'Linear guides', 'Servo motors', 'Drives', 'Tool changers', 'Control boards']

const EXPERIENCE_STATS = [
  { icon: GearIcon, value: `${COMPANY.yearsExperience}+`, label: 'Years of Industry Experience' },
  { icon: GlobeIcon, value: 'Multi-Market', label: 'Service & Support' },
  { icon: CheckIcon, value: 'One-Stop', label: 'CNC Solutions' },
]

function AboutUs() {
  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.industrial})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">02 &nbsp;|&nbsp; About Us</span>
          <h1>About Able Engineering</h1>
          <p>Professional CNC solutions, maintenance &amp; engineering support.</p>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section className="section">
        <div className="container split">
          <Reveal className="split__content">
            <span className="eyebrow">Who We Are</span>
            <h2 className="section-title">
              Your CNC Partner for
              <br />
              Reliable Engineering Support
            </h2>
            <p>
              Able Engineering is a professional engineering service company specializing in CNC
              machinery, with a strong focus on Brother CNC machining centres.
            </p>
            <p>
              We provide comprehensive support covering CNC machine sales, maintenance and repair,
              spare parts supply, machine overhaul, automation upgrades and technical support.
            </p>
            <p>
              Backed by extensive industry experience and technical expertise, we are committed to
              helping our customers maintain machine reliability, reduce downtime and improve overall
              production efficiency.
            </p>
            <ul className="chips">
              {FOCUS_AREAS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="split__image">
            <img src={IMAGES.factory} alt="Automated CNC manufacturing facility" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Vision & Mission ---------------- */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Vision &amp; Mission</span>
            <h2 className="section-title">Building a Stronger Tomorrow Together</h2>
          </Reveal>

          <div className="vm">
            <Reveal className="vm__image">
              <img src={IMAGES.machinery} alt="Engineers working with CNC machinery" loading="lazy" />
              <div className="vm__caption">
                <span>Reliable solutions for a more productive tomorrow</span>
              </div>
            </Reveal>

            <div className="vm__cards">
              <Reveal delay={100} className="vm-card">
                <span className="vm-card__icon">
                  <FlagIcon size={30} />
                </span>
                <h3>Our Vision</h3>
                <p>To be a trusted CNC engineering partner.</p>
              </Reveal>
              <Reveal delay={220} className="vm-card">
                <span className="vm-card__icon">
                  <TargetIcon size={30} />
                </span>
                <h3>Our Mission</h3>
                <p>To keep our customers moving forward.</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Experience ---------------- */}
      <section className="section">
        <div className="container split split--reverse">
          <Reveal className="split__image">
            <img src={IMAGES.technician} alt="Technician inspecting a CNC machine component" loading="lazy" />
          </Reveal>

          <Reveal delay={120} className="split__content">
            <span className="eyebrow">Our Experience</span>
            <h2 className="section-title">
              Built on Experience.
              <br />
              Driven by Technical Expertise.
            </h2>
            <p>
              Able Engineering has developed extensive experience in CNC machine maintenance and
              engineering applications, supporting customers with practical solutions throughout the
              machine lifecycle.
            </p>
            <p>
              Our technical capabilities cover major CNC machine components including:
            </p>
            <ul className="chips">
              {CAPABILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              With technical knowledge, spare parts support and dedicated testing capabilities, we
              respond efficiently to machine issues and help customers restore operations with
              confidence.
            </p>
          </Reveal>
        </div>

        <div className="container stats">
          {EXPERIENCE_STATS.map(({ icon: StatIcon, value, label }, i) => (
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

      {/* ---------------- Regional support ---------------- */}
      <section className="region">
        <Reveal className="container region__inner">
          <div>
            <span className="eyebrow">Our Journey</span>
            <h2>Expanding Our Regional Support</h2>
            <p>Continuing to support customers across {COMPANY.regions}.</p>
          </div>
          <Link to="/" className="btn btn--primary">
            Back to Home <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default AboutUs
