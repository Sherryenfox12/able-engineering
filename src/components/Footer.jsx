import { Link } from 'react-router-dom'
import { BRANCHES, COMPANY, CONTACT_LINK, NAV_LINKS } from '../constants/company'
import { useLanguage } from '../locales/i18n'
import { GearIcon } from './Icons'
import './Footer.css'

const OFFERING_KEYS = [
  'footer.offerings.machines',
  'footer.offerings.parts',
  'footer.offerings.maintenance',
  'footer.offerings.overhaul',
]

const CURRENT_YEAR = new Date().getFullYear()

// The footer shows the main (first) branch; every branch is listed on the Contact page.
const MAIN_BRANCH = BRANCHES[0]

function Footer() {
  const { t } = useLanguage()
  const branchName = t(`contact.branches.${MAIN_BRANCH.name}`) || MAIN_BRANCH.name

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
          <p>{t('footer.aboutLine', { tagline: t('company.tagline') })}</p>
        </div>

        <div>
          <h3>{t('footer.quickLinks')}</h3>
          <ul>
            {[...NAV_LINKS, CONTACT_LINK].map(({ labelKey, to }) => (
              <li key={to}>
                <Link to={to}>{t(labelKey)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{t('footer.whatWeOffer')}</h3>
          <ul>
            {OFFERING_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{branchName}</h3>
          <ul>
            <li>{MAIN_BRANCH.email}</li>
            <li>
              {t('footer.whatsapp')}:{' '}
              <a href={MAIN_BRANCH.whatsapp.url} target="_blank" rel="noopener noreferrer">
                {MAIN_BRANCH.whatsapp.display}
              </a>
            </li>
            <li>
              {t('footer.phone')}: <a href={`tel:${MAIN_BRANCH.phone.tel}`}>{MAIN_BRANCH.phone.display}</a>
            </li>
            <li>{MAIN_BRANCH.warehouse}</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <span>
            &copy; {CURRENT_YEAR} {COMPANY.name}. {t('footer.rights')}
          </span>
          <span>{t('footer.experience', { years: COMPANY.yearsExperience })}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
