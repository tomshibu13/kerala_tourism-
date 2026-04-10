import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getDestination, getReviews, postReview } from '../api'
import { destinations as staticDestinations } from '../data/destinations'
import { isGoodTimeToVisit, getCurrentSeason } from '../utils/seasonHelper'

gsap.registerPlugin(ScrollTrigger)

export default function DestinationDetailPage() {
  const { id } = useParams()
  const [destination, setDestination] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const heroRef = useRef(null)
  const weatherRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Fetch destination and reviews from API
  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDestination(id).catch(() => null),
      getReviews(id).catch(() => []),
    ])
      .then(([dest, revs]) => {
        if (dest) {
          setDestination({ ...dest, id: dest.destinationId || dest.id || dest._id })
        } else {
          // Fallback to static data
          const fallback = staticDestinations.find((d) => d.id === id)
          setDestination(fallback || null)
        }
        setReviews(revs.length > 0 ? revs : [
          { name: 'Arjun M.', rating: 5, text: `Amazing experience at this destination! A must-visit place in Kerala.`, date: '2 weeks ago' },
          { name: 'Sarah K.', rating: 4, text: `Had a wonderful time here. The scenery was spectacular.`, date: '1 month ago' },
        ])
      })
      .finally(() => setLoading(false))
  }, [id])

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.name || !reviewForm.text) return
    setSubmitting(true)
    try {
      const newReview = await postReview({ destinationId: id, ...reviewForm })
      setReviews((prev) => [newReview, ...prev])
      setReviewForm({ name: '', rating: 5, text: '' })
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!destination) return
    const ctx = gsap.context(() => {
      // Ken Burns effect on hero
      gsap.to('.detail-hero-img', {
        scale: 1.15,
        x: 20,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      // Weather widget slide in
      gsap.from(weatherRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out',
      })

      // Map fade in with pin drop
      gsap.from(mapRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Review cards stagger
      gsap.from('.review-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.reviews-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Highlights stagger
      gsap.from('.highlight-item', {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.highlights-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [destination])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-kerala-teal/30 border-t-kerala-teal rounded-full animate-spin mb-4" />
          <p className="text-kerala-white/50">Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏝️</p>
          <h2 className="font-heading text-2xl text-kerala-white mb-2">Destination not found</h2>
          <Link to="/destinations" className="text-kerala-teal hover:underline">← Back to destinations</Link>
        </div>
      </div>
    )
  }

  const season = getCurrentSeason()
  const isGoodTime = isGoodTimeToVisit(destination.bestSeason)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="detail-hero-img w-full h-full object-cover scale-100"
          />
          <div className="gradient-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-kerala-charcoal via-transparent to-transparent" />
        </div>

        {/* Weather Widget */}
        <div ref={weatherRef} className="absolute top-28 right-6 md:right-12 z-20">
          <div className="glass rounded-2xl p-5 min-w-[180px]">
            <p className="text-kerala-white/40 text-xs font-medium mb-2">Current Weather</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{destination.weatherCondition === 'Sunny' ? '☀️' : destination.weatherCondition === 'Misty' ? '🌫️' : destination.weatherCondition === 'Cool' ? '🌤️' : '⛅'}</span>
              <span className="text-2xl font-bold text-kerala-white">{destination.weatherTemp}</span>
            </div>
            <p className="text-kerala-white/50 text-xs">{destination.weatherCondition}</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-kerala-white/50 text-sm mb-4 hover:text-kerala-teal transition-colors">
              ← Back to destinations
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full glass text-xs font-medium text-kerala-teal">{destination.category}</span>
              <span className="flex items-center gap-1 text-sm">
                <span className="text-kerala-gold">★</span>
                <span className="text-kerala-white font-medium">{destination.rating}</span>
              </span>
              {isGoodTime && (
                <span className="px-3 py-1 rounded-full bg-kerala-green/20 border border-kerala-green/30 text-xs font-medium text-kerala-teal-light">
                  ✓ Great time to visit!
                </span>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-kerala-white mb-2">
              {destination.name}
            </h1>
            <p className="text-kerala-white/60 text-lg md:text-xl font-light">
              {destination.subtitle} — {destination.district}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="font-heading text-2xl font-semibold text-kerala-white mb-4">About {destination.name}</h2>
              <p className="text-kerala-white/60 leading-relaxed text-lg">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="highlights-section">
              <h2 className="font-heading text-2xl font-semibold text-kerala-white mb-6">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="highlight-item flex items-center gap-4 p-4 rounded-xl glass-light group hover:border-kerala-teal/30 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kerala-green/20 to-kerala-teal/20 flex items-center justify-center text-kerala-teal font-bold text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-kerala-white/70 text-sm font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div ref={mapRef} className="relative rounded-2xl overflow-hidden">
              <div className="h-[300px] bg-kerala-charcoal-light border border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Map pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(circle, #1D9E75 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }} />
                {/* Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-kerala-teal flex items-center justify-center mb-1 animate-bounce">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-kerala-teal/40" />
                  <p className="mt-3 text-kerala-white/50 text-sm">{destination.name}, {destination.district}</p>
                  <p className="text-kerala-white/30 text-xs mt-1">Interactive map coming soon</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <h2 className="font-heading text-2xl font-semibold text-kerala-white mb-6">Reviews</h2>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="glass-light rounded-2xl p-6 mb-6">
                <h3 className="text-kerala-white font-medium mb-4">Write a Review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    id="review-name"
                    type="text"
                    placeholder="Your name"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-kerala-white text-sm placeholder:text-kerala-white/30 focus:outline-none focus:border-kerala-teal/50 transition-colors"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-kerala-white/50 text-sm">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                        className={`text-lg transition-colors ${star <= reviewForm.rating ? 'text-kerala-gold' : 'text-kerala-white/20'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  id="review-text"
                  placeholder="Share your experience..."
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-kerala-white text-sm placeholder:text-kerala-white/30 focus:outline-none focus:border-kerala-teal/50 transition-colors resize-none mb-4"
                />
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !reviewForm.name || !reviewForm.text}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-kerala-green/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {submitSuccess && (
                    <span className="text-kerala-teal text-sm animate-pulse">✓ Review submitted!</span>
                  )}
                </div>
              </form>

              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="review-card p-6 rounded-2xl glass-light hover:border-kerala-teal/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kerala-green to-kerala-teal flex items-center justify-center text-white font-semibold text-sm">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="text-kerala-white font-medium text-sm">{review.name}</p>
                          <p className="text-kerala-white/30 text-xs">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <span key={j} className="text-kerala-gold text-sm">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-kerala-white/50 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Season Info */}
            <div className="glass-light rounded-2xl p-6">
              <h3 className="font-heading text-lg font-semibold text-kerala-white mb-4">Best Time to Visit</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{season.icon}</span>
                <div>
                  <p className="text-kerala-white font-medium text-sm">{season.name} — {season.quality}</p>
                  <p className="text-kerala-teal text-xs">{destination.bestSeason}</p>
                </div>
              </div>
              <p className="text-kerala-white/40 text-xs leading-relaxed">{season.description}</p>
            </div>

            {/* Quick Info */}
            <div className="glass-light rounded-2xl p-6">
              <h3 className="font-heading text-lg font-semibold text-kerala-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'District', value: destination.district },
                  { label: 'Category', value: destination.category },
                  { label: 'Rating', value: `${destination.rating} / 5` },
                  { label: 'Best Season', value: destination.bestSeason },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-kerala-white/40 text-sm">{item.label}</span>
                    <span className="text-kerala-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/planner"
              className="block w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-kerala-green/30 hover:scale-[1.02]"
            >
              Add to Trip Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
