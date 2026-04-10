import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination, index = 0 }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -15, y: x * 15 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="stagger-item block"
    >
      <div
        ref={cardRef}
        className="card-3d relative group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'translateY(-12px) scale(1.02)' : ''}`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl bg-kerala-charcoal-light border border-white/5 transition-all duration-500 group-hover:border-kerala-teal/30 group-hover:shadow-xl group-hover:shadow-kerala-green/10">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="gradient-overlay absolute inset-0" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-kerala-teal">
              {destination.category}
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full glass flex items-center gap-1">
              <span className="text-kerala-gold text-xs">★</span>
              <span className="text-kerala-white text-xs font-medium">{destination.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-heading text-lg font-semibold text-kerala-white mb-1">
              {destination.name}
            </h3>
            <p className="text-kerala-white/50 text-sm mb-3">
              {destination.subtitle}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-kerala-teal text-xs font-medium">
                Best: {destination.bestSeason}
              </span>
              <span className="text-kerala-white/30 text-xs group-hover:text-kerala-teal transition-colors duration-300">
                Explore →
              </span>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${(tilt.y / 15 + 0.5) * 100}% ${(tilt.x / -15 + 0.5) * 100}%, rgba(29, 158, 117, 0.08) 0%, transparent 60%)`,
            }}
          />
        </div>
      </div>
    </Link>
  )
}
