import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDestinations } from '../api'
import { destinations as staticDestinations } from '../data/destinations'

export default function MapPage() {
  const [activePin, setActivePin] = useState(null)
  const [destinations, setDestinations] = useState(staticDestinations)

  useEffect(() => {
    getDestinations()
      .then((data) => {
        const mapped = data.map((d) => ({ ...d, id: d.destinationId || d.id || d._id }))
        if (mapped.length > 0) setDestinations(mapped)
      })
      .catch(() => {})
  }, [])

  // Approximate positions on Kerala map (percentage based)
  const defaultPositions = {
    alleppey: { x: 38, y: 68 },
    munnar: { x: 52, y: 55 },
    varkala: { x: 32, y: 82 },
    wayanad: { x: 48, y: 18 },
    kovalam: { x: 30, y: 88 },
    thekkady: { x: 55, y: 60 },
    'fort-kochi': { x: 35, y: 52 },
    kumarakom: { x: 42, y: 62 },
    bekal: { x: 42, y: 5 },
    athirappilly: { x: 45, y: 42 },
  }

  const pinPositions = destinations.map((dest) => ({
    id: dest.id,
    x: defaultPositions[dest.id]?.x || 40,
    y: defaultPositions[dest.id]?.y || 50,
    dest,
  }))

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Explore
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-kerala-white mb-4">
            Kerala <span className="bg-gradient-to-r from-kerala-teal to-kerala-teal-light bg-clip-text text-transparent">Map</span>
          </h1>
          <p className="text-kerala-white/50 text-lg">Click on a pin to explore the destination</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative glass-light rounded-3xl overflow-hidden" style={{ paddingBottom: '120%' }}>
              {/* Kerala outline (simplified SVG) */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg viewBox="0 0 100 130" className="w-full h-full max-w-md opacity-20">
                  <path
                    d="M 45 5 C 40 8, 38 15, 42 20 C 45 25, 48 22, 50 28 C 52 32, 48 35, 45 38 C 42 42, 40 45, 38 50 C 36 55, 38 58, 40 62 C 42 66, 38 70, 35 75 C 32 80, 30 85, 28 90 C 26 95, 28 100, 30 105 C 32 108, 35 112, 33 118 C 32 122, 30 125, 32 128 C 38 126, 42 120, 45 115 C 48 110, 50 105, 52 100 C 54 95, 56 90, 55 85 C 54 80, 56 75, 58 70 C 60 65, 58 60, 56 55 C 54 50, 56 45, 55 40 C 54 35, 52 30, 50 25 C 48 18, 50 12, 48 8 Z"
                    fill="none"
                    stroke="#1D9E75"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(#1D9E75 1px, transparent 1px), linear-gradient(90deg, #1D9E75 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />

              {/* Pins */}
              {pinPositions.map((pin) => (
                <button
                  key={pin.id}
                  id={`map-pin-${pin.id}`}
                  className={`absolute z-10 group cursor-pointer transition-all duration-300 ${activePin === pin.id ? 'scale-125' : 'hover:scale-110'}`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}
                  onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                >
                  {/* Pin */}
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activePin === pin.id
                        ? 'bg-kerala-teal shadow-lg shadow-kerala-teal/40'
                        : 'bg-kerala-green group-hover:bg-kerala-teal'
                    }`}>
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${
                      activePin === pin.id ? 'border-t-kerala-teal' : 'border-t-kerala-green group-hover:border-t-kerala-teal'
                    }`} />
                  </div>

                  {/* Label */}
                  <div className={`absolute left-1/2 -translate-x-1/2 -top-8 px-3 py-1 rounded-lg glass whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                    activePin === pin.id ? 'text-kerala-teal opacity-100' : 'text-kerala-white/60 opacity-0 group-hover:opacity-100'
                  }`}>
                    {pin.dest.name}
                  </div>

                  {/* Pulse ring */}
                  {activePin === pin.id && (
                    <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-kerala-teal/20 animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {activePin ? (
              <DestinationPreview dest={pinPositions.find(p => p.id === activePin)?.dest} />
            ) : (
              <div className="glass-light rounded-2xl p-8 text-center">
                <p className="text-4xl mb-4">📍</p>
                <p className="text-kerala-white/60 text-sm">Select a pin on the map to see destination details</p>
              </div>
            )}

            {/* All destinations list */}
            <div className="mt-6 space-y-3">
              {destinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setActivePin(dest.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    activePin === dest.id
                      ? 'glass border-kerala-teal/30'
                      : 'glass-light hover:border-white/15'
                  }`}
                >
                  <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="text-left">
                    <p className="text-kerala-white text-sm font-medium">{dest.name}</p>
                    <p className="text-kerala-white/40 text-xs">{dest.category}</p>
                  </div>
                  <span className="ml-auto text-kerala-gold text-xs">★ {dest.rating}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DestinationPreview({ dest }) {
  if (!dest) return null

  return (
    <div className="glass-light rounded-2xl overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute bottom-4 left-4">
          <span className="px-2 py-1 rounded-full glass text-xs text-kerala-teal">{dest.category}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-semibold text-kerala-white mb-1">{dest.name}</h3>
        <p className="text-kerala-white/40 text-sm mb-3">{dest.subtitle}</p>
        <p className="text-kerala-white/50 text-sm leading-relaxed mb-4">{dest.description.substring(0, 120)}...</p>
        <Link
          to={`/destinations/${dest.id}`}
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-kerala-green/30 hover:scale-105"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
