"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amara & Kofi Mensah',
    role: 'Bride & Groom',
    event: 'Garden Wedding · Nairobi',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    quote: "Events District didn't just decorate our venue — they translated our entire love story into a physical space. Every single guest spent the evening asking who designed it.",
    keyWord: 'Love story made physical',
    category: 'Wedding',
  },
  {
    id: 2,
    name: 'James Waweru',
    role: 'Head of Marketing',
    event: 'Annual Corporate Gala · Radisson Blu',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    quote: "The most seamless gala we've ever hosted. The branding integration was so precise our CEO said it looked like a Cannes production. Our team is still talking about it six months on.",
    keyWord: 'Cannes-level production',
    category: 'Corporate',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Private Client',
    event: 'Birthday Extravaganza · Mombasa',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    quote: "I gave them three words: gold, intimate, unforgettable. They came back with a concept that made me cry at the reveal. Worth every shilling, and then some.",
    keyWord: 'Three words. One revelation.',
    category: 'Celebration',
  },
  {
    id: 4,
    name: 'The Harrington Family',
    role: 'Family',
    event: '25th Anniversary · Karen Country Club',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    rating: 5,
    quote: "We wanted to recreate the feeling of our original wedding but with 25 years of added meaning. What they designed felt like walking into a memory that had become more beautiful with time.",
    keyWord: 'A memory made more beautiful',
    category: 'Celebration',
  },
]

const TRUST_METRICS = [
  { value: '500+', label: 'Events delivered', sub: 'across Kenya & beyond' },
  { value: '4.9★', label: 'Average rating', sub: 'from 150+ reviews' },
  { value: '10+', label: 'Years expertise', sub: 'in luxury décor' },
  { value: '100%', label: 'Satisfaction rate', sub: 'or we make it right' },
]

function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px flex-shrink-0 ${className}`} style={{ background: gold.metallic }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <GoldRule className="w-8" />
      <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>{children}</span>
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const metricsInView = useInView(metricsRef, { once: true, margin: '-10%' })

  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setDir(1)
      setActive(p => (p + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(t)
  }, [paused, active])

  const navigate = (d: number) => {
    setDir(d)
    setActive(p => (p + d + TESTIMONIALS.length) % TESTIMONIALS.length)
    setPaused(true)
    setTimeout(() => setPaused(false), 8000)
  }

  const t = TESTIMONIALS[active]

  return (
    <section
      ref={ref}
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient orb */}
      <div
        className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
        style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12 md:mb-16"
        >
          <div>
            <SectionLabel>Client stories</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mt-3">
              What clients say{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                after.
              </span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-foreground/35 font-mono">
              {String(active + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:bg-foreground/5"
              style={{ borderColor: gold.border }}
            >
              <ChevronLeft size={14} className="text-foreground/50" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:bg-foreground/5"
              style={{ borderColor: gold.border }}
            >
              <ChevronRight size={14} className="text-foreground/50" />
            </button>
          </div>
        </motion.div>

        {/* Main testimonial layout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start"
        >
          {/* Left: large quote */}
          <div>
            {/* Opening quote mark */}
            <div
              className="font-serif leading-none mb-3 -ml-1 select-none"
              style={{ fontSize: 'clamp(64px, 8vw, 96px)', color: gold.light, opacity: 0.2, lineHeight: 1 }}
            >
              "
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                initial={{ opacity: 0, y: dir * 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -16 }}
                transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* Keyword pull-quote */}
                <div className="mb-4">
                  <span
                    className="text-[9px] uppercase tracking-[0.35em] font-medium"
                    style={{ color: gold.light }}
                  >
                    ✦ {t.keyWord}
                  </span>
                </div>

                <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-foreground leading-relaxed mb-8">
                  {t.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    style={{ border: `2px solid ${gold.light}` }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-[11px] text-foreground/45 mt-0.5">{t.event}</p>
                  </div>
                  <div className="flex items-center gap-0.5 ml-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={11} fill={gold.light} color={gold.light} />
                    ))}
                  </div>
                </div>

                {/* Category tag */}
                <div className="mt-5">
                  <span
                    className="text-[9px] px-3 py-1 rounded-full border uppercase tracking-wider"
                    style={{ borderColor: gold.border, color: gold.light }}
                  >
                    {t.category}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i); setPaused(true) }}
                >
                  <motion.div
                    animate={{
                      width: i === active ? 20 : 5,
                      backgroundColor: i === active ? gold.light : 'rgba(212,175,55,0.25)',
                    }}
                    className="h-1 rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: trust panel + CTA */}
          <div className="space-y-4">
            {/* Rating summary */}
            <div
              className="rounded-2xl p-6 border"
              style={{ borderColor: gold.border, background: gold.glow }}
            >
              <div
                className="text-5xl font-light mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                4.9
              </div>
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={gold.light} color={gold.light} />
                ))}
              </div>
              <p className="text-xs text-foreground/45">Based on 150+ verified reviews</p>

              <GoldRule className="my-4" />

              {/* All testimonial names as scrollable list */}
              <div className="space-y-3">
                {TESTIMONIALS.map((test, i) => (
                  <button
                    key={test.id}
                    onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 text-left ${
                      i === active ? 'bg-foreground/5' : 'hover:bg-foreground/3'
                    }`}
                    style={{ border: i === active ? `1px solid ${gold.border}` : '1px solid transparent' }}
                  >
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      style={{ border: i === active ? `1.5px solid ${gold.light}` : '1.5px solid transparent' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${i === active ? 'text-foreground' : 'text-foreground/55'}`}>
                        {test.name}
                      </p>
                      <p className="text-[9px] text-foreground/35 truncate">{test.event}</p>
                    </div>
                    {i === active && (
                      <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold.light }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-5 border"
              style={{ borderColor: gold.border, background: gold.glow }}
            >
              <p className="text-xs text-foreground/45 mb-3 leading-relaxed">
                Ready to become our next success story?
              </p>
              <Link
                href="/quote"
                className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
              >
                Get Your Free Quote
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trust metrics strip */}
        <div
          ref={metricsRef}
          className="mt-14 md:mt-20 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4"
          style={{ borderColor: gold.border }}
        >
          {TRUST_METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={metricsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-2xl md:text-3xl font-light mb-1 bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                {m.value}
              </div>
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              <p className="text-[10px] text-foreground/40 mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
