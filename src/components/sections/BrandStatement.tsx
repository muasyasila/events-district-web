"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

// ─── Gold palette (matches Hero + Nav) ───────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.06)',
  border:   'rgba(212, 175, 55, 0.22)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  {
    tag: '01',
    category: 'Romance',
    title: 'Weddings & Ceremonies',
    description: 'Where two souls become one story. We design the backdrop to your most important chapter — from ceremony arches to reception tablescapes that leave guests speechless.',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800&h=600',
    tags: ['Ceremony Arches', 'Aisle Styling', 'Reception Décor'],
    href: '/quote',
    cta: 'Get Wedding Quote',
    available: true,
  },
  {
    tag: '02',
    category: 'Celebrations',
    title: 'Birthdays & Milestones',
    description: 'Turning points deserve monuments. We transform ordinary venues into immersive worlds that mark the moments worth remembering for a lifetime.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=600',
    tags: ['Milestone Birthdays', 'Themed Parties', 'Surprise Events'],
    href: '/contact',
    cta: 'Enquire Now',
    available: false,
  },
  {
    tag: '03',
    category: 'Corporate',
    title: 'Galas & Brand Events',
    description: 'Your brand is a living entity. We give it physical form — staging environments that communicate authority, elegance, and intent to every guest in the room.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800&h=600',
    tags: ['Gala Dinners', 'Product Launches', 'Award Ceremonies'],
    href: '/contact',
    cta: 'Enquire Now',
    available: false,
  },
]

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description: 'A 30-minute discovery call where we understand your vision, budget, and non-negotiables.',
    duration: '30 min',
  },
  {
    number: '02',
    title: 'Concept Design',
    description: 'We present a tailored moodboard and itemised proposal within 48 hours.',
    duration: '48 hrs',
  },
  {
    number: '03',
    title: 'Execution',
    description: 'Our team arrives early, sets up flawlessly, and stays until the last detail is perfect.',
    duration: 'Day-of',
  },
  {
    number: '04',
    title: 'You Celebrate',
    description: 'Walk into your event and feel exactly how you imagined — with nothing left to worry about.',
    duration: 'Your moment',
  },
]

const TESTIMONIALS = [
  {
    quote: "Events District didn't just decorate our venue — they translated our entire love story into a physical space. Every single guest asked who designed it.",
    name: 'Amara & Kofi Mensah',
    event: 'Garden Wedding · Nairobi',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    quote: "The most seamless corporate gala we've ever hosted. The branding integration was so precise that our CEO said it looked like a Cannes event. Absolutely premium.",
    name: 'James Waweru',
    event: 'Annual Gala · Radisson Blu',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    quote: "I gave them three words: gold, intimate, unforgettable. They came back with a concept that made me cry. Worth every shilling.",
    name: 'Priya Patel',
    event: 'Birthday Extravaganza · Mombasa',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
]

// ─── Utility ──────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  const isDecimal = target % 1 !== 0
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((eased * target).toFixed(isDecimal ? 1 : 0)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration, isDecimal])
  return isDecimal ? count.toFixed(1) : Math.floor(count)
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px ${className}`} style={{ background: gold.metallic }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <GoldRule className="w-8 flex-shrink-0" />
      <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>
        {children}
      </span>
    </div>
  )
}

// ─── BLOCK 2 · Event type showcase ────────────────────────────────────────────

function EventShowcase() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <div ref={ref} className="container mx-auto px-4 md:px-6 py-20 md:py-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="mb-12 md:mb-16"
      >
        <SectionLabel>What we do</SectionLabel>
        <div className="grid md:grid-cols-2 gap-6 items-end">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.08] text-foreground">
            Every event has a{' '}
            <span
              className="italic font-normal bg-clip-text text-transparent"
              style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
            >
              soul.
            </span>
            <br />We give it form.
          </h2>
          <p className="text-foreground/55 text-base md:text-lg leading-relaxed max-w-md">
            From intimate proposals to 1,000-guest galas — we curate spaces that feel
            inevitable. Like they could only ever have existed exactly this way.
          </p>
        </div>
      </motion.div>

      {/* Mobile: pill tabs */}
      <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {EVENT_TYPES.map((e, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex-none px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
            style={{
              background: active === i ? gold.metallic : 'transparent',
              borderColor: active === i ? gold.light : gold.border,
              color: active === i ? 'black' : undefined,
            }}
          >
            {e.category}
          </button>
        ))}
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:grid grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr] gap-10 lg:gap-16 items-start">
        {/* Left tabs */}
        <div className="sticky top-24 space-y-1">
          {EVENT_TYPES.map((e, i) => (
            <button key={i} onClick={() => setActive(i)} className="w-full text-left group">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  active === i ? 'bg-foreground/5' : 'hover:bg-foreground/3'
                }`}
              >
                <span
                  className="text-[10px] font-mono flex-shrink-0 transition-colors"
                  style={{ color: active === i ? gold.light : undefined }}
                >
                  {e.tag}
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    active === i ? 'text-foreground' : 'text-foreground/45 group-hover:text-foreground/75'
                  }`}
                >
                  {e.category}
                </span>
                {active === i && (
                  <motion.div
                    layoutId="tab-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: gold.light }}
                  />
                )}
              </div>
            </button>
          ))}
          <div className="pt-5 px-4">
            <GoldRule className="mb-4" />
            <p className="text-[10px] text-foreground/35 leading-relaxed">
              Wedding décor comes with instant online quote. All other services by custom consultation.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-2 gap-6 lg:gap-10 items-center"
          >
            <div className="relative overflow-hidden rounded-lg aspect-[4/3] group">
              <img
                src={EVENT_TYPES[active].img}
                alt={EVENT_TYPES[active].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div
                className="absolute top-4 left-4 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                style={{ background: gold.metallic, color: 'black' }}
              >
                {EVENT_TYPES[active].category}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-mono mb-3 block" style={{ color: gold.light }}>
                {EVENT_TYPES[active].tag}
              </span>
              <h3 className="text-2xl lg:text-3xl font-light text-foreground mb-4 leading-tight">
                {EVENT_TYPES[active].title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                {EVENT_TYPES[active].description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {EVENT_TYPES[active].tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 rounded-full border"
                    style={{ borderColor: gold.border, color: gold.light }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={EVENT_TYPES[active].href}
                className="inline-flex items-center gap-2 group/cta w-fit"
              >
                <span
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-black transition-shadow duration-300"
                  style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                >
                  {EVENT_TYPES[active].cta}
                </span>
                <ArrowRight size={13} className="text-foreground/40 group-hover/cta:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile card */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-5">
              <img src={EVENT_TYPES[active].img} alt={EVENT_TYPES[active].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <h3 className="text-2xl font-light text-foreground mb-3">{EVENT_TYPES[active].title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed mb-4">{EVENT_TYPES[active].description}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {EVENT_TYPES[active].tags.map(tag => (
                <span key={tag} className="text-[10px] px-3 py-1 rounded-full border" style={{ borderColor: gold.border, color: gold.light }}>
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={EVENT_TYPES[active].href}
              className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest rounded-full text-black"
              style={{ background: gold.metallic }}
            >
              {EVENT_TYPES[active].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── BLOCK 3 · Process strip ──────────────────────────────────────────────────

function ProcessStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <div
      ref={ref}
      className="py-16 md:py-20 border-y"
      style={{ borderColor: gold.border, background: gold.glow }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-12"
        >
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-light text-foreground">
            From first call to first dance —{' '}
            <span className="italic" style={{ color: gold.light }}>four steps.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
          {/* Connecting line desktop */}
          <div
            className="absolute top-[22px] left-[12.5%] right-[12.5%] h-px hidden md:block"
            style={{ background: gold.border }}
          />

          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-black text-xs font-bold relative z-10 flex-shrink-0"
                  style={{ background: gold.metallic, boxShadow: `0 0 20px ${gold.shadow}` }}
                >
                  {step.number}
                </div>
                <span className="text-[10px] uppercase tracking-wider hidden md:block" style={{ color: gold.light }}>
                  {step.duration}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1.5">{step.title}</h4>
              <p className="text-xs text-foreground/55 leading-relaxed">{step.description}</p>
              <div className="mt-2.5 text-[10px] uppercase tracking-wider md:hidden" style={{ color: gold.light }}>
                {step.duration}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black"
            style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
          >
            Start with a free consultation
            <ArrowRight size={12} />
          </Link>
          <p className="text-xs text-foreground/40">No obligation · Response within 24 hours</p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── BLOCK 4 · Testimonial carousel ──────────────────────────────────────────

function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  const navigate = (d: number) => {
    setDir(d)
    setActive(prev => (prev + d + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const t = TESTIMONIALS[active]

  return (
    <div ref={ref} className="container mx-auto px-4 md:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <SectionLabel>Client stories</SectionLabel>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_420px] gap-10 md:gap-16 items-center">
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div
            className="font-serif leading-none mb-2 -ml-1 md:-ml-2 select-none"
            style={{ fontSize: 'clamp(60px, 10vw, 110px)', color: gold.light, opacity: 0.25, lineHeight: 1 }}
          >
            "
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              initial={{ opacity: 0, y: dir * 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -18 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-foreground mb-7">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  style={{ border: `2px solid ${gold.light}` }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-[11px] text-foreground/45">{t.event}</p>
                </div>
                <div className="flex items-center gap-0.5 ml-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={11} fill={gold.light} color={gold.light} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav controls */}
          <div className="flex items-center gap-3 mt-8">
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
            <div className="flex gap-1.5 ml-1">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
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
        </motion.div>

        {/* Trust panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.22 }}
          className="rounded-2xl p-6 md:p-8 border space-y-6"
          style={{ borderColor: gold.border, background: gold.glow }}
        >
          <div>
            <div
              className="text-5xl font-light mb-1.5 bg-clip-text text-transparent"
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
          </div>

          <GoldRule />

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: gold.light }}>
              Why they chose us
            </p>
            {[
              'Same-day quote for weddings',
              'Dedicated event manager',
              'Full setup & breakdown included',
              'Flexible payment plans',
              'Portfolio of 500+ real events',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-3 last:mb-0">
                <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: gold.light }} />
                <span className="text-sm text-foreground/70">{point}</span>
              </div>
            ))}
          </div>

          <GoldRule />

          <div>
            <p className="text-xs text-foreground/45 mb-3">Ready to be our next success story?</p>
            <Link
              href="/quote"
              className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
              style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
            >
              Get Your Free Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── BLOCK 5 · Editorial CTA closer ──────────────────────────────────────────

function CloserCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40])
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32 border-t"
      style={{ borderColor: gold.border }}
    >
      {/* Parallax orbs */}
      <motion.div
        style={{ y: y1, background: 'radial-gradient(circle, rgba(212,175,55,0.11) 0%, transparent 70%)' }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: y2, background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl"
        >
          <SectionLabel>Ready to begin?</SectionLabel>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.05] text-foreground mb-8">
            Your event deserves{' '}
            <span
              className="italic bg-clip-text text-transparent"
              style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
            >
              more than décor.
            </span>
            <br />
            It deserves a{' '}
            <span className="italic text-foreground/45">feeling.</span>
          </h2>

          <p className="text-base md:text-lg text-foreground/55 leading-relaxed mb-10 max-w-xl">
            Tell us about your event. We'll respond within 24 hours with a tailored concept
            and transparent pricing — no vague quotes, no surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-black"
                style={{ background: gold.metallic, boxShadow: `0 6px 28px ${gold.shadow}` }}
              >
                Get Instant Wedding Quote
                <ArrowRight size={13} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-widest text-foreground border transition-all duration-300 hover:border-amber-500/40"
                style={{ borderColor: gold.border }}
              >
                Book Free Consultation
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-5 mt-8 flex-wrap">
            {['✦ No commitment required', '✦ Reply within 24 hrs', '✦ 500+ events delivered'].map(line => (
              <span key={line} className="text-[11px] text-foreground/30 uppercase tracking-wider">
                {line}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Story() {
  return (
    <section className="bg-background w-full overflow-hidden">
      <EventShowcase />
      <ProcessStrip />
      <TestimonialCarousel />
      <CloserCTA />
    </section>
  )
}