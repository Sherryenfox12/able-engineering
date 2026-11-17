import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RequireAdmin from './auth/RequireAdmin'
import Layout from './components/Layout'
import { LanguageProvider } from './locales/i18n'
import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import ProductsPage from './pages/ProductsPage'
import RepairService from './pages/RepairService'
import ContactUs from './pages/ContactUs'
import EventPage from './pages/EventPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />

            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/repair-service" element={<RepairService />} />
              <Route path="/contact" element={<ContactUs />} />
              {/* Not linked from the navigation - reached by typing /event */}
              <Route path="/event" element={<EventPage />} />

              {/* Old / unknown URLs fall back to the home page */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
