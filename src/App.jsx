import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import MapPage from './pages/MapPage'
import TripPlannerPage from './pages/TripPlannerPage'
import DistrictsPage from './pages/DistrictsPage'

function AnimatedRoutes() {
  const location = useLocation()
  const pageRef = useRef(null)

  useEffect(() => {
    // Page transition: fade + slide up
    const el = pageRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
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
      </Routes>
    </div>
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
    <div className="min-h-screen bg-kerala-charcoal text-kerala-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}
