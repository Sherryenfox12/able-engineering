import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { COMPANY, CONTACT_LINK, NAV_LINKS } from '../constants/company'
import { CloseIcon, GearIcon, MenuIcon } from './Icons'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={closeMenu} aria-label={`${COMPANY.name} - Home`}>
          <span className="brand__mark">
            <GearIcon size={22} />
          </span>
          <span className="brand__text">
            <span className="brand__name">ABLE</span>
            <span className="brand__sub">ENGINEERING</span>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav id="main-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          <ul>
            {NAV_LINKS.map(({ label, to, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) => `main-nav__link ${isActive ? 'is-active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to={CONTACT_LINK.to} className="btn btn--primary btn--sm" onClick={closeMenu}>
                {CONTACT_LINK.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
