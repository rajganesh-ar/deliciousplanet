'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: 'Scroll-Driven Animation',
    description: 'GSAP ScrollTrigger powers these reveal animations as you scroll down the page.',
    icon: '🎬',
  },
  {
    title: 'Smooth Tweens',
    description: 'GSAP provides buttery-smooth, high-performance animations at 60fps.',
    icon: '✨',
  },
  {
    title: 'Timeline Control',
    description: 'Complex sequenced animations orchestrated with GSAP Timeline.',
    icon: '⏱️',
  },
  {
    title: 'Stagger Effects',
    description: 'Elements animate in with precise stagger delays for visual impact.',
    icon: '🌊',
  },
]

export default function GsapSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // Horizontal line animation
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        scaleX: 0,
        duration: 1.2,
        ease: 'power2.out',
      })

      // Cards stagger animation
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold text-white text-center mb-4"
        >
          GSAP Animations
        </h2>
        <p className="text-gray-500 text-center mb-12 text-lg">
          Scroll down to see elements animate into view
        </p>

        <div
          ref={lineRef}
          className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mb-16 origin-center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-colors duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
