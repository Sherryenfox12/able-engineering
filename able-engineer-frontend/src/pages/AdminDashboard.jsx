import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminSession, logoutAdmin } from '../auth/adminAuth'
import AdminProducts from './admin/AdminProducts'
import AdminEvents from './admin/AdminEvents'
import './AdminDashboard.css'

const SECTIONS = [
  { id: 'products', label: 'Products' },
  { id: 'event', label: 'Event' },
]

function AdminDashboard() {
  const navigate = useNavigate()
  const session = getAdminSession()
  const [section, setSection] = useState('products')

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">Able Engineer</p>
          <h1>Admin Dashboard</h1>
          {session?.username ? (
            <p className="admin-dashboard__user">Signed in as {session.username}</p>
          ) : null}
        </div>

        <button className="btn btn--outline" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="admin-dashboard__body">
        <aside className="admin-dashboard__sidebar">
          <p className="admin-dashboard__sidebar-label">Sections</p>
          <nav className="admin-dashboard__nav">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-dashboard__nav-btn${section === item.id ? ' is-active' : ''}`}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-dashboard__main">
          {section === 'products' ? <AdminProducts /> : null}
          {section === 'event' ? <AdminEvents /> : null}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
