import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAdminLoggedIn, loginAdmin } from '../auth/adminAuth'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(username, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__panel">
        <p className="admin-login__eyebrow">Able Engineer</p>
        <h1>Admin Login</h1>
        <p className="admin-login__lead">Sign in to manage the dashboard.</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-login__field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label className="admin-login__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          {error ? <p className="admin-login__error">{error}</p> : null}

          <button className="btn btn--primary admin-login__submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
