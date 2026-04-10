import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DestinationCard from '../components/destination/DestinationCard'
import { getDestinations } from '../api'
import { categories } from '../data/destinations'

gsap.registerPlugin(ScrollTrigger)

export default function DestinationsPage() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch destinations from API
  useEffect(() => {
    setLoading(true)
    getDestinations(activeCategory, searchQuery)
      .then((data) => {
        // Map API data to match component expectations
        const mapped = data.map((d) => ({
          ...d,
          id: d.destinationId || d.id || d._id,
        }))
        setDestinations(mapped)
      })
      .catch((err) => {
        console.error('Failed to fetch destinations:', err)
        // Fallback to static data
        import('../data/destinations').then((mod) => setDestinations(mod.destinations))
      })
      .finally(() => setLoading(false))
  }, [activeCategory, searchQuery])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      {/* Header */}
      <div className="page-header max-w-7xl mx-auto mb-12 text-center">
        <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
          Discover
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-kerala-white mb-4">
          All <span className="bg-gradient-to-r from-kerala-teal to-kerala-teal-light bg-clip-text text-transparent">Destinations</span>
        </h1>
        <p className="text-kerala-white/50 text-lg max-w-xl mx-auto">
          Explore the finest places Kerala has to offer
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              id="destination-search"
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl glass border-white/5 text-kerala-white placeholder:text-kerala-white/30 text-sm focus:outline-none focus:border-kerala-teal/40 transition-colors"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kerala-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-kerala-teal/20 text-kerala-teal border border-kerala-teal/30'
                  : 'text-kerala-white/50 border border-white/5 hover:border-white/15 hover:text-kerala-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-kerala-teal/20 text-kerala-teal border border-kerala-teal/30'
                    : 'text-kerala-white/50 border border-white/5 hover:border-white/15 hover:text-kerala-white'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-kerala-teal/30 border-t-kerala-teal rounded-full animate-spin mb-4" />
            <p className="text-kerala-white/50 text-lg">Loading destinations...</p>
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-kerala-white/50 text-lg">No destinations found</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
              className="mt-4 px-6 py-2 rounded-xl text-sm text-kerala-teal border border-kerala-teal/30 hover:bg-kerala-teal/10 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
