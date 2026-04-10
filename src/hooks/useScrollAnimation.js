import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP ScrollTrigger setup hook
 * @param {Function} animationFn - receives (element, gsap, ScrollTrigger) args
 * @param {Array} deps - dependency array
 */
export function useScrollAnimation(animationFn, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      animationFn(el, gsap, ScrollTrigger)
    }, el)

    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/**
 * Simple fade-in-up on scroll
 */
export function useFadeInUp(options = {}) {
  const { delay = 0, duration = 0.8, y = 40 } = options
  return useScrollAnimation((el, gsap) => {
    gsap.from(el, {
      y,
      opacity: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  })
}

/**
 * Stagger children on scroll
 */
export function useStaggerIn(options = {}) {
  const { stagger = 0.12, y = 30, duration = 0.6, childSelector = '.stagger-item' } = options
  return useScrollAnimation((el, gsap) => {
    gsap.from(el.querySelectorAll(childSelector), {
      y,
      opacity: 0,
      duration,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  })
}
