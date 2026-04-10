import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SVG path that draws itself as user scrolls
 */
export default function RoutePathAnimation() {
  const svgRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = length
    path.style.strokeDashoffset = length

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      })

      // Animate dots along the path
      const dots = svgRef.current.querySelectorAll('.route-dot')
      dots.forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: svgRef.current,
            start: `top ${70 - i * 10}%`,
            toggleActions: 'play none none reverse',
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 400"
      className="w-full h-full"
      fill="none"
    >
      {/* Main route path */}
      <path
        ref={pathRef}
        d="M 50 20 C 80 60, 120 40, 150 80 S 200 120, 180 160 C 160 200, 100 190, 120 230 S 200 270, 160 310 C 140 340, 80 320, 100 360 S 180 390, 200 380"
        stroke="url(#routeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1D9E75" />
          <stop offset="50%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#D4A843" />
        </linearGradient>
      </defs>

      {/* Route stops */}
      {[
        { cx: 50, cy: 20, label: 'Start' },
        { cx: 150, cy: 80, label: 'Alleppey' },
        { cx: 180, cy: 160, label: 'Munnar' },
        { cx: 120, cy: 230, label: 'Thekkady' },
        { cx: 160, cy: 310, label: 'Kovalam' },
        { cx: 200, cy: 380, label: 'End' },
      ].map((stop, i) => (
        <g key={i} className="route-dot">
          <circle
            cx={stop.cx}
            cy={stop.cy}
            r="8"
            fill="#1a1a18"
            stroke="#1D9E75"
            strokeWidth="2"
          />
          <circle
            cx={stop.cx}
            cy={stop.cy}
            r="4"
            fill="#1D9E75"
          />
          <text
            x={stop.cx + 15}
            y={stop.cy + 5}
            fill="#FAFAF8"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            opacity="0.7"
          >
            {stop.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
