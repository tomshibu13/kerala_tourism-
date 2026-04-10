import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import DestinationCard from '../components/destination/DestinationCard'
import CountUp from '../components/animations/CountUp'
import RoutePathAnimation from '../components/animations/RoutePathAnimation'
import { useInView } from '../hooks/useThreeScene'
import { getDestinations, getStats } from '../api'
import { destinations as staticDestinations, categories as staticCategories, stats as staticStats } from '../data/destinations'

// Lazy load Three.js components
const ParticleField = lazy(() => import('../components/three/ParticleField'))
const CategoryBubbles = lazy(() => import('../components/three/CategoryBubbles'))

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const [destinations, setDestinations] = useState(staticDestinations)
  const [stats, setStats] = useState(staticStats)
  const [categories, setCategories] = useState(staticCategories)

  useEffect(() => {
    // Fetch from API, fallback to static data
    getDestinations()
      .then((data) => {
        const mapped = data.map((d) => ({ ...d, id: d.destinationId || d.id || d._id }))
        if (mapped.length > 0) setDestinations(mapped)
      })
      .catch(() => {})

    getStats()
      .then((data) => {
        if (data.stats) setStats(data.stats)
        if (data.categories) setCategories(data.categories)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="relative">
      <HeroSection />
      <FeaturedDestinations destinations={destinations} />
      <WhyKerala stats={stats} />
      <CategoriesSection categories={categories} />
      <TripPlannerTeaser />
    </div>
  )
}

/* ──────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────── */
function HeroSection() {
  const heroRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ken Burns — slow cinematic zoom on the hero photo
      gsap.to('.hero-photo', {
        scale: 1.2,
        duration: 25,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      // Parallax on the hero background
      gsap.to('.hero-bg', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Text reveal
      gsap.from('.hero-title-line', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.3,
      })

      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.9,
      })

      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Photo Background with Ken Burns + Parallax */}
      <div className="hero-bg absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-bg.png"
          alt="Kerala backwaters at golden hour"
          className="hero-photo absolute inset-0 w-full h-full object-cover scale-110"
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(180deg, rgba(10,22,40,0.45) 0%, rgba(15,110,86,0.12) 40%, rgba(26,26,24,0.5) 70%, rgba(26,26,24,0.95) 100%)'
      }} />
      <div className="absolute inset-0 z-10" style={{
        background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(26,26,24,0.5) 100%)'
      }} />
      {/* Subtle vignette */}
      <div className="absolute inset-0 z-10" style={{
        boxShadow: 'inset 0 0 150px 60px rgba(26,26,24,0.5)'
      }} />

      {/* Text Content */}
      <div ref={textRef} className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <div className="overflow-hidden mb-2">
          <p className="hero-title-line text-kerala-teal text-sm font-medium tracking-[0.3em] uppercase mb-4">
            God's Own Country
          </p>
        </div>

        <div className="overflow-hidden">
          <h1 className="hero-title-line font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-kerala-white leading-[1.1] mb-2">
            Explore
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-title-line font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-kerala-green via-kerala-teal to-kerala-teal-light bg-clip-text text-transparent">
              Kerala
            </span>
          </h1>
        </div>

        <p className="hero-subtitle text-kerala-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Immerse yourself in lush backwaters, misty hill stations, pristine beaches, and ancient temples. Your journey through paradise begins here.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#featured"
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold text-base transition-all duration-500 hover:shadow-2xl hover:shadow-kerala-green/30 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 bg-gradient-to-r from-kerala-teal to-kerala-teal-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
          <Link
            to="/planner"
            className="px-8 py-4 rounded-2xl border border-kerala-white/10 text-kerala-white/70 font-medium text-base transition-all duration-300 hover:border-kerala-teal/40 hover:text-kerala-white hover:bg-white/5"
          >
            Plan Your Trip
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-kerala-white/40 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-kerala-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-kerala-teal animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 2 — Featured Destinations
   ────────────────────────────────────────── */
function FeaturedDestinations({ destinations }) {
  const sectionRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      gsap.from('.featured-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Cards fan out from center
      const cards = carouselRef.current?.querySelectorAll('.dest-card-wrapper')
      if (cards) {
        cards.forEach((card, i) => {
          const offset = i - (cards.length - 1) / 2
          gsap.from(card, {
            rotateY: offset * 15,
            x: offset * -40,
            z: -200,
            opacity: 0,
            duration: 0.9,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: carouselRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          })
        })
      }
    })

    return () => ctx.revert()
  }, [destinations])

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="relative py-32 px-6"
    >
      {/* Section header */}
      <div className="featured-title max-w-7xl mx-auto mb-16 text-center">
        <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
          Curated Destinations
        </p>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-kerala-white mb-6">
          Places That <span className="bg-gradient-to-r from-kerala-teal to-kerala-teal-light bg-clip-text text-transparent">Inspire</span>
        </h2>
        <p className="text-kerala-white/50 text-lg max-w-xl mx-auto">
          From tranquil backwaters to misty peaks, discover Kerala's most breathtaking destinations.
        </p>
      </div>

      {/* 3D Carousel Grid */}
      <div
        ref={carouselRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        style={{ perspective: '1200px' }}
      >
        {destinations.map((dest, i) => (
          <div key={dest.id} className="dest-card-wrapper" style={{ transformStyle: 'preserve-3d' }}>
            <DestinationCard destination={dest} index={i} />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-12">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-kerala-white/10 text-kerala-white/60 text-sm font-medium transition-all duration-300 hover:border-kerala-teal/40 hover:text-kerala-teal hover:bg-kerala-teal/5"
        >
          View All Destinations
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 3 — Why Kerala (Stats + Particles)
   ────────────────────────────────────────── */
function WhyKerala({ stats }) {
  const sectionRef = useRef(null)
  const [particleRef, particleInView] = useInView()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('.stat-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-kerala"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* 3D Particle Field Background */}
      <div ref={particleRef} className="absolute inset-0 z-0 opacity-40">
        {particleInView && (
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
              <ParticleField count={250} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="why-title text-center mb-20">
          <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Why Kerala
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-kerala-white mb-6">
            God's Own <span className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light bg-clip-text text-transparent">Country</span>
          </h2>
          <p className="text-kerala-white/50 text-lg max-w-xl mx-auto">
            A land blessed with unmatched natural beauty, rich heritage, and warm hospitality.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card glass-light rounded-2xl p-8 text-center group hover:border-kerala-teal/30 transition-all duration-500"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-kerala-teal to-kerala-teal-light bg-clip-text text-transparent mb-3">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-kerala-white/50 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 4 — Categories (Floating Bubbles)
   ────────────────────────────────────────── */
function CategoriesSection({ categories }) {
  const sectionRef = useRef(null)
  const [bubbleRef, bubbleInView] = useInView()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cat-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Bubbles fly in from different directions
      const bubbles = sectionRef.current?.querySelectorAll('.category-bubble')
      if (bubbles) {
        const directions = [
          { x: -200, y: -100 },
          { x: 200, y: -80 },
          { x: -150, y: 100 },
          { x: 180, y: 60 },
          { x: 0, y: 150 },
        ]
        bubbles.forEach((bubble, i) => {
          gsap.from(bubble, {
            x: directions[i % directions.length].x,
            y: directions[i % directions.length].y,
            opacity: 0,
            scale: 0.3,
            rotation: (i % 2 === 0 ? 1 : -1) * 30,
            duration: 1,
            delay: i * 0.12,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="categories-section"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* 3D Background */}
      <div ref={bubbleRef} className="absolute inset-0 z-0 opacity-30">
        {bubbleInView && (
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]}>
              <CategoryBubbles categories={categories} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="cat-title text-center mb-20">
          <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Discover By Category
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-kerala-white mb-6">
            What Excites <span className="bg-gradient-to-r from-kerala-teal to-kerala-green bg-clip-text text-transparent">You?</span>
          </h2>
        </div>

        {/* Category Bubbles */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/destinations?category=${cat.id}`}
              className="category-bubble bubble group"
            >
              <div
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center glass-light transition-all duration-500 group-hover:shadow-xl"
                style={{
                  boxShadow: `0 0 0 1px ${cat.color}15`,
                }}
              >
                {/* Glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 30px ${cat.color}30, inset 0 0 20px ${cat.color}10`,
                  }}
                />

                <span className="text-3xl md:text-4xl mb-2 transition-transform duration-300 group-hover:scale-125">
                  {cat.icon}
                </span>
                <span
                  className="text-xs md:text-sm font-medium transition-colors duration-300"
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 5 — Trip Planner Teaser
   ────────────────────────────────────────── */
function TripPlannerTeaser() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.planner-content', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="trip-planner-teaser"
      className="relative py-32 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Route Path SVG */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Decorative background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-kerala-green/10 blur-3xl" />
            </div>
            <div className="relative w-full max-w-xs">
              <RoutePathAnimation />
            </div>
          </div>

          {/* Right: Copy + CTA */}
          <div className="planner-content">
            <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Plan Your Journey
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-kerala-white mb-6 leading-tight">
              Craft Your <br />
              <span className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light bg-clip-text text-transparent">
                Perfect Itinerary
              </span>
            </h2>
            <p className="text-kerala-white/50 text-lg leading-relaxed mb-8">
              Select your favorite destinations, set your travel dates, and let us build a personalized route through Kerala. From day-by-day schedules to local tips — we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/planner"
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold text-base transition-all duration-500 hover:shadow-2xl hover:shadow-kerala-green/30 hover:scale-105 overflow-hidden text-center"
              >
                <span className="relative z-10">Open Trip Planner</span>
                <div className="absolute inset-0 bg-gradient-to-r from-kerala-teal to-kerala-teal-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                to="/destinations"
                className="px-8 py-4 rounded-2xl border border-kerala-white/10 text-kerala-white/60 font-medium text-base transition-all duration-300 hover:border-kerala-teal/40 hover:text-kerala-white hover:bg-white/5 text-center"
              >
                Browse Destinations
              </Link>
            </div>

            {/* Feature bullets */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: '📍', text: 'Custom Routes' },
                { icon: '📅', text: 'Day Planning' },
                { icon: '🌤️', text: 'Season Advice' },
                { icon: '💰', text: 'Budget Tools' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-kerala-white/50 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
