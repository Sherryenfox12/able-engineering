// Central place for company details used across Header / Footer / pages.
export const COMPANY = {
  name: 'Able Engineering',
  tagline: 'Professional CNC Solutions, Maintenance & Engineering Support',
  yearsExperience: 20,
  regions: 'Malaysia, Thailand and beyond',
}

// Add more branches here later - the Contact page renders one card per branch.
export const BRANCHES = [
  {
    name: 'Penang Branch',
    email: 'ableengineering.jeswin@gmail.com',
    whatsapp: {
      display: '+60 11-5894 9811',
      url: 'https://api.whatsapp.com/send/?phone=601158949811&text&type=phone_number&app_absent=0',
    },
    phone: { display: '+604-358 0571', tel: '+6043580571' },
    warehouse: 'No.3, Lorong Industri Sungai Lokan 2A, Taman Industri Sungai Lokan, 13800 Butterworth, Malaysia.',
  },
]

export const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'About Us', to: '/about' },
]

// Shown as the highlighted button in the header and as a link in the footer.
export const CONTACT_LINK = { label: 'Contact Us', to: '/contact' }
