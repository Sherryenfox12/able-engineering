import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// Shared page shell: Header + routed page + Footer.
function Layout() {
  const { pathname } = useLocation()

  // Start every page at the top when navigating between routes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
