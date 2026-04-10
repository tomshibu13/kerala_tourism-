import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/districts', label: 'Districts' },
    { to: '/map', label: 'Map' },
    { to: '/planner', label: 'Trip Planner' },
  ]

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kerala-green to-kerala-teal flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110">
            K
          </div>
          <span className="font-heading text-xl font-semibold text-kerala-white tracking-tight">
            Kerala<span className="text-kerala-teal">Tourism</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.to
                  ? 'text-kerala-teal bg-kerala-teal/10'
                  : 'text-kerala-white/70 hover:text-kerala-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/planner"
            className="ml-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-kerala-green/30 hover:scale-105"
          >
            Plan Your Trip
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-6 h-0.5 bg-kerala-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-kerala-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-kerala-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 glass mt-2 mx-4 rounded-2xl flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === link.to
                  ? 'text-kerala-teal bg-kerala-teal/10'
                  : 'text-kerala-white/70 hover:text-kerala-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
