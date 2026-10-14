import { Link } from 'react-router-dom'
import { BRANCHES, COMPANY, CONTACT_LINK, NAV_LINKS } from '../constants/company'
import { GearIcon } from './Icons'
import './Footer.css'

const OFFERINGS = ['Used CNC Machines', 'CNC Spare Parts', 'Maintenance & Repair', 'Machine Overhaul']

const CURRENT_YEAR = new Date().getFullYear()

// The footer shows the main (first) branch; every branch is listed on the Contact page.
const MAIN_BRANCH = BRANCHES[0]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__about">
          <Link to="/" className="footer-brand">
            <span className="footer-brand__mark">
              <GearIcon size={20} />
            </span>
            <span>
              <strong>ABLE</strong> ENGINEERING
            </span>
          </Link>
          <p>{COMPANY.tagline}. Building a stronger tomorrow together.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul>
            {[...NAV_LINKS, CONTACT_LINK].map(({ label, to }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>What We Offer</h3>
          <ul>
            {OFFERINGS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{MAIN_BRANCH.name}</h3>
          <ul>
            <li>{MAIN_BRANCH.email}</li>
            <li>
              WhatsApp:{' '}
              <a href={MAIN_BRANCH.whatsapp.url} target="_blank" rel="noopener noreferrer">
                {MAIN_BRANCH.whatsapp.display}
              </a>
            </li>
            <li>
              Phone: <a href={`tel:${MAIN_BRANCH.phone.tel}`}>{MAIN_BRANCH.phone.display}</a>
            </li>
            <li>{MAIN_BRANCH.warehouse}</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <span>
            &copy; {CURRENT_YEAR} {COMPANY.name}. All rights reserved.
          </span>
          <span>{COMPANY.yearsExperience}+ years of industry experience</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
