import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Toaster } from 'react-hot-toast'

// Consumer
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import MapPage from './pages/MapPage'
import TripPlannerPage from './pages/TripPlannerPage'
import DistrictsPage from './pages/DistrictsPage'

// Admin
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPlaces from './pages/admin/AdminPlaces'
import AdminActivities from './pages/admin/AdminActivities'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReviews from './pages/admin/AdminReviews'
import AdminLayout from './components/admin/AdminLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { AuthProvider } from './context/AuthContext'

function ConsumerAnimatedRoutes() {
  const location = useLocation()
  const pageRef = useRef(null)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
  }, [location.pathname])

  return (
    <div ref={pageRef} key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/districts" element={<DistrictsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/planner" element={<TripPlannerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

function ConsumerApp() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-kerala-charcoal text-kerala-white">
        <Navbar />
        <main>
          <ConsumerAnimatedRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="places" element={<AdminPlaces />} />
                  <Route path="activities" element={<AdminActivities />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />
        <Route path="/*" element={<ConsumerApp />} />
      </Routes>
    </>
  )
}
