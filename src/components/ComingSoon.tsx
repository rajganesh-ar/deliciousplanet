'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'

const TARGET_DATE = new Date('2026-03-01T00:00:00').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = Date.now()
  const diff = Math.max(TARGET_DATE - now, 0)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-14 sm:w-14 sm:h-16 md:w-[72px] md:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-xl sm:text-2xl md:text-4xl font-semibold text-white tabular-nums"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 font-medium"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Olive leaf SVG paths for floating animation ──
const oliveLeaves = [
  // Large leaves
  { id: 1, size: 48, startX: 8, startY: -10, delay: 0, duration: 18, drift: 30, rotate: 360 },
  { id: 2, size: 40, startX: 85, startY: -8, delay: 2.5, duration: 22, drift: -25, rotate: -300 },
  { id: 3, size: 52, startX: 25, startY: -12, delay: 5, duration: 20, drift: 40, rotate: 280 },
  { id: 4, size: 36, startX: 70, startY: -6, delay: 8, duration: 19, drift: -35, rotate: -400 },
  // Medium leaves
  { id: 5, size: 28, startX: 45, startY: -8, delay: 3, duration: 16, drift: 20, rotate: 320 },
  { id: 6, size: 32, startX: 15, startY: -10, delay: 7, duration: 21, drift: -30, rotate: -260 },
  { id: 7, size: 30, startX: 60, startY: -6, delay: 1.5, duration: 17, drift: 35, rotate: 380 },
  { id: 8, size: 26, startX: 92, startY: -12, delay: 4.5, duration: 23, drift: -20, rotate: -340 },
  // Small leaves
  { id: 9, size: 20, startX: 35, startY: -5, delay: 6, duration: 15, drift: 15, rotate: 400 },
  { id: 10, size: 18, startX: 78, startY: -8, delay: 9, duration: 14, drift: -18, rotate: -280 },
  { id: 11, size: 22, startX: 50, startY: -10, delay: 11, duration: 20, drift: 25, rotate: 300 },
  { id: 12, size: 16, startX: 5, startY: -6, delay: 10, duration: 18, drift: -12, rotate: -360 },
]

function OliveLeaf({ leaf }: { leaf: (typeof oliveLeaves)[0] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set initial state
    gsap.set(el, { y: -60, opacity: 0, scale: 0.4, rotation: 0, x: 0 })

    const tl = gsap.timeline({ repeat: -1, delay: leaf.delay, repeatDelay: 1 })

    // Fall from top to bottom
    tl.to(el, {
      y: window.innerHeight + 100,
      rotation: leaf.rotate,
      scale: 1,
      duration: leaf.duration,
      ease: 'none',
    })

    // Sway left-right with a sine wave
    gsap.to(el, {
      x: leaf.drift * 2,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: leaf.delay,
    })

    // Fade in quickly
    tl.to(el, { opacity: 0.8, duration: 1.5, ease: 'power1.in' }, 0)
    // Stay visible for most of the fall
    // Fade out near the end
    tl.to(el, { opacity: 0, duration: 2, ease: 'power1.out' }, leaf.duration - 2)

    return () => {
      tl.kill()
      gsap.killTweensOf(el)
    }
  }, [leaf])

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: `${leaf.startX}%`,
        top: 0,
        width: leaf.size,
        height: leaf.size,
        opacity: 0,
      }}
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Olive leaf shape */}
        <path
          d="M30 4 C38 8, 50 18, 52 30 C54 42, 44 54, 30 56 C16 54, 6 42, 8 30 C10 18, 22 8, 30 4Z"
          fill="rgba(120, 160, 40, 0.6)"
          stroke="rgba(90, 130, 30, 0.8)"
          strokeWidth="1.5"
        />
        {/* Leaf vein - center */}
        <path
          d="M30 8 Q30 30, 30 54"
          stroke="rgba(90, 130, 30, 0.9)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Leaf veins - sides */}
        <path
          d="M30 16 Q22 22, 14 26"
          stroke="rgba(90, 130, 30, 0.6)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 16 Q38 22, 46 26"
          stroke="rgba(90, 130, 30, 0.6)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 28 Q20 34, 12 38"
          stroke="rgba(90, 130, 30, 0.5)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 28 Q40 34, 48 38"
          stroke="rgba(90, 130, 30, 0.5)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 40 Q22 44, 16 48"
          stroke="rgba(90, 130, 30, 0.4)"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M30 40 Q38 44, 44 48"
          stroke="rgba(90, 130, 30, 0.4)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const display = mounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black">
      {/* Video Background — fullscreen cover */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle vignette — keeps center clear for the product */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Top & bottom gradient strips for text readability */}
      <div className="absolute inset-x-0 top-0 h-36 sm:h-48 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 sm:h-64 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* Olive leaves floating animation layer */}
      <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
        {mounted && oliveLeaves.map((leaf) => <OliveLeaf key={leaf.id} leaf={leaf} />)}
      </div>

      {/* Content — split into top bar, center spacer (product area), and bottom section */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        {/* ── Top bar: Logo ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center px-4 sm:px-8 md:px-12 pt-5 sm:pt-7 md:pt-8"
        >
          <Image
            src="/logo.svg"
            alt="Delicious Planet"
            width={80}
            height={80}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] brightness-0 invert"
            priority
          />
        </motion.header>

        {/* ── Center spacer — lets the product in the video stay visible ── */}
        <div className="flex-1" />

        {/* ── Bottom section: Title, tagline, countdown ── */}
        <div className="px-4 sm:px-8 md:px-12 pb-6 sm:pb-8 md:pb-12">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-1 sm:mb-2 md:mb-3 tracking-tight leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Delicious Planet
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/50 mb-5 sm:mb-6 md:mb-8 tracking-wide"
            style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            Bite into the Wild
          </motion.p>

          {/* Countdown + launch date row */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6"
          >
            {/* Timer */}
            <div className="flex gap-2 sm:gap-3 md:gap-4">
              <CountdownUnit value={display.days} label="Days" />
              <span className="text-white/20 text-lg sm:text-xl md:text-2xl font-light self-start mt-3.5 sm:mt-4 md:mt-5">
                :
              </span>
              <CountdownUnit value={display.hours} label="Hours" />
              <span className="text-white/20 text-lg sm:text-xl md:text-2xl font-light self-start mt-3.5 sm:mt-4 md:mt-5">
                :
              </span>
              <CountdownUnit value={display.minutes} label="Min" />
              <span className="text-white/20 text-lg sm:text-xl md:text-2xl font-light self-start mt-3.5 sm:mt-4 md:mt-5">
                :
              </span>
              <CountdownUnit value={display.seconds} label="Sec" />
            </div>

            {/* Launch date badge */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] backdrop-blur-lg border border-white/[0.1] self-start sm:self-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-[9px] sm:text-[10px] md:text-xs text-white/50 uppercase tracking-[0.15em] font-medium"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                20 Feb 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
