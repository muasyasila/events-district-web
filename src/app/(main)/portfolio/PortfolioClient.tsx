"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Calculator
} from 'lucide-react'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

const unsplashLoader = ({ src, width, quality }: { src: string; width?: number; quality?: number }) =>
  `${src}&w=${width}&q=${quality || 75}`

interface PortfolioItem {
  id: number
  title: string
  category: 'wedding' | 'corporate' | 'social' | 'culinary'
  clientName: string
  eventDate: string
  location: string
  description: string
  story: string
  images: string[]
  quote: string
  mood: string
  quoteHref: string
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: 'Garden Estate',
    category: 'wedding',
    clientName: 'Sarah & Michael',
    eventDate: 'March 2025',
    location: 'Nairobi',
    description: 'Where wildflowers met crystal.',
    story: "They wanted the feeling of stumbling upon a secret garden. We used 4,000 hand-foraged blooms, suspended crystal droplets that caught the afternoon light, and a ceremony arch that seemed to grow from the earth itself. As Sarah walked down the aisle, the wind moved through the florals — exactly as we had planned.",
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=2000&h=1333&fit=crop',
    ],
    quote: "It felt like walking into a dream we didn't know we had",
    mood: 'Ethereal',
    quoteHref: '/quote?type=wedding',
  },
  {
    id: 2,
    title: 'Midnight Gala',
    category: 'corporate',
    clientName: 'Tech Summit',
    eventDate: 'February 2025',
    location: 'Nairobi',
    description: 'Black tie under starlight.',
    story: "The brief was simple: make technology feel human. We transformed a concrete warehouse into a constellation — 2,000 fibre-optic points embedded in the ceiling, responding to the music's rhythm. When the CEO spoke, the lights dimmed to a single spotlight. The silence in that room was the loudest thing I have ever heard.",
    images: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=2000&h=1333&fit=crop',
    ],
    quote: "They didn't just light the room, they lit the mood",
    mood: 'Dramatic',
    quoteHref: '/contact?type=corporate',
  },
  {
    id: 3,
    title: 'Rose Gold',
    category: 'social',
    clientName: "Amanda's 30th",
    eventDate: 'January 2025',
    location: 'Nairobi',
    description: 'Metallic surfaces catching candlelight.',
    story: "Amanda wanted to feel like she was inside a jewellery box. We mirrored the walls, installed a ceiling of hanging brass discs, and placed candles at every height. At midnight, we released 500 rose petals from above. Guests touched the walls to confirm they were real.",
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2000&h=1333&fit=crop',
    ],
    quote: "Every corner had its own secret",
    mood: 'Glamorous',
    quoteHref: '/contact?type=birthday',
  },
  {
    id: 4,
    title: 'Heritage',
    category: 'wedding',
    clientName: 'James & Grace',
    eventDate: 'December 2024',
    location: 'Nairobi',
    description: 'Ancient patterns reimagined.',
    story: "Two families, two traditions. We studied patterns from both cultures for months, then wove them into every surface — etched into glass, embroidered on linen, projected onto walls. The ceremony began with silence: 300 guests, no music, just the sound of a single gong. Then the colours exploded.",
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&h=1333&fit=crop',
    ],
    quote: "Tradition never looked so alive",
    mood: 'Vibrant',
    quoteHref: '/quote?type=wedding',
  },
  {
    id: 5,
    title: 'Product Immersion',
    category: 'corporate',
    clientName: 'Luxury Brand',
    eventDate: 'November 2024',
    location: 'Nairobi',
    description: 'Guests entered a world.',
    story: "No presentations. No speeches. Just rooms that breathed the brand's essence. In the first room, the temperature dropped — sensory shock. By the third room, they were converts. The product sold out in 48 hours.",
    images: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=2000&h=1333&fit=crop',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=2000&h=1333&fit=crop',
    ],
    quote: "We forgot we were at a launch",
    mood: 'Immersive',
    quoteHref: '/contact?type=corporate',
  },
]

// ─── Image experience modal ───────────────────────────────────────────────────
function ProjectExperience({ project, onClose }: { project: PortfolioItem; onClose: () => void }) {
  const [idx, setIdx]           = useState(0)
  const [playing, setPlaying]   = useState(true)
  const [controls, setControls] = useState(true)
  const timerRef                = useRef<NodeJS.Timeout>()

  const resetTimer = () => {
    setControls(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setControls(false), 3000)
  }

  useEffect(() => { resetTimer(); return () => clearTimeout(timerRef.current) }, [idx])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setIdx(p => (p + 1) % project.images.length), 5000)
    return () => clearInterval(t)
  }, [playing, project.images.length])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       onClose()
      if (e.key === 'ArrowRight')   setIdx(p => (p + 1) % project.images.length)
      if (e.key === 'ArrowLeft')    setIdx(p => (p - 1 + project.images.length) % project.images.length)
      if (e.key === ' ')            { e.preventDefault(); setPlaying(p => !p) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, project.images.length])

  const next = () => setIdx(p => (p + 1) % project.images.length)
  const prev = () => setIdx(p => (p - 1 + project.images.length) % project.images.length)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseMove={resetTimer}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <motion.div
          className="h-full"
          style={{ background: gold.metallic }}
          initial={{ width: '0%' }}
          animate={{ width: `${((idx + 1) / project.images.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
      >
        <X size={14} />
      </button>

      {/* Controls */}
      <AnimatePresence>
        {controls && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 z-50 flex items-end justify-between pointer-events-none"
          >
            <div className="pointer-events-auto">
              <p className="text-white text-2xl md:text-4xl font-light mb-2">{project.title}</p>
              <p className="text-white/50 text-sm">{idx + 1} / {project.images.length} · {project.mood}</p>
            </div>
            <div className="flex gap-2 pointer-events-auto">
              <button onClick={() => setPlaying(p => !p)} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={prev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote on first image */}
      <AnimatePresence>
        {idx === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center px-8 pointer-events-none"
          >
            <div className="max-w-2xl text-center">
              <p className="text-white/90 text-2xl md:text-4xl font-light italic leading-relaxed mb-4">"{project.quote}"</p>
              <p className="text-white/50 text-xs uppercase tracking-wider">— {project.clientName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image src={project.images[idx]} alt={project.title} fill loader={unsplashLoader} className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* Click zones */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-w-resize" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-1/3 z-30 cursor-e-resize" onClick={next} />
    </motion.div>
  )
}

// ─── Project story section ─────────────────────────────────────────────────────
function ProjectStory({ project, index, onOpen }: { project: PortfolioItem; index: number; onOpen: (p: PortfolioItem) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], [80, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const isEven  = index % 2 === 0

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative min-h-screen flex items-center py-20 px-6 md:px-12 overflow-hidden"
    >
      {/* Large number bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[28vw] font-light text-foreground/[0.025] leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center`}>

          {/* Image */}
          <motion.div style={{ y }} className={isEven ? 'lg:order-1' : 'lg:order-2'}>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer border transition-all duration-500 group-hover:border-amber-500/30"
              style={{ borderColor: gold.border }}
              onClick={() => onOpen(project)}
            >
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                loader={unsplashLoader}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />

              {/* View overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black"
                  style={{ background: gold.metallic }}
                >
                  View Gallery
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span
                  className="text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                  style={{ background: gold.metallic, color: 'black' }}
                >
                  {project.category}
                </span>
              </div>

              {/* Image strip on hover */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-10 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2 justify-center">
                  {project.images.slice(0, 4).map((img, i) => (
                    <div key={i} className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ${i === 0 ? 'ring-1' : 'opacity-70'}`} style={{ ringColor: gold.light }}>
                      <Image src={img} alt="" fill loader={unsplashLoader} className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-center text-white/50 text-[9px] uppercase tracking-wider mt-2">
                  {project.images.length} images
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className={`space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
            <motion.div
              initial={{ opacity: 0, x: isEven ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>
                  Chapter {String(index + 1).padStart(2, '0')} · {project.mood}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] mb-3 text-foreground">
                {project.title}
              </h2>
              <p className="text-lg md:text-xl text-foreground/50 font-light italic">
                "{project.description}"
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-sm md:text-base text-foreground/65 font-light leading-relaxed"
            >
              {project.story}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => onOpen(project)}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black"
                style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
              >
                View Gallery
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link
                href={project.quoteHref}
                className="inline-flex items-center gap-2 text-xs font-medium group/ql"
                style={{ color: gold.light }}
              >
                <span className="underline underline-offset-4 group-hover/ql:no-underline transition-all">
                  Plan something similar
                </span>
                <ArrowRight size={10} />
              </Link>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="border-l-2 pl-5 py-2"
              style={{ borderColor: gold.light }}
            >
              <p className="text-sm text-foreground/50 italic">"{project.quote}"</p>
              <p className="text-[9px] uppercase tracking-wider text-foreground/30 mt-1">— {project.clientName} · {project.eventDate}</p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null)
  const { scrollYProgress }               = useScroll()
  const smooth                            = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeProject])

  return (
    <main className="bg-background text-foreground relative">

      {/* Gold top rule */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-px w-full" style={{ background: gold.metallic }} />
        {/* Scroll progress under the gold rule */}
        <div className="h-px bg-foreground/5">
          <motion.div className="h-full" style={{ background: gold.metallic, scaleX: smooth, transformOrigin: 'left' }} />
        </div>
      </div>

      {/* Hero */}
      <section className="min-h-[80vh] flex items-center pt-28 pb-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80"
            alt="" fill loader={unsplashLoader}
            className="object-cover opacity-8"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${gold.glow} 0%, transparent 70%)` }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ background: gold.metallic }} />
              <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: gold.light }}>A Portfolio in Five Acts</span>
              <div className="w-8 h-px" style={{ background: gold.metallic }} />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.93] mb-8 text-foreground">
              Every Event<br />
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                is a Story
              </span>
            </h1>
            <p className="text-foreground/50 font-light text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Not just photographs. Five moments where space became emotion and guests became participants.
            </p>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-foreground/30 text-[9px] uppercase tracking-widest">
              Scroll to begin
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chapter nav — sticky */}
      <div
        className="sticky top-2 z-40 bg-background/90 backdrop-blur-md border-y py-3 px-6 md:px-12"
        style={{ borderColor: gold.border }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/35 flex-shrink-0">Jump to:</span>
          <div className="flex items-center gap-5 flex-shrink-0">
            {portfolioData.map((p, i) => (
              <button
                key={p.id}
                onClick={() => document.getElementById(`chapter-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-[9px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors whitespace-nowrap"
              >
                {String(i + 1).padStart(2, '0')}. {p.title}
              </button>
            ))}
          </div>
          <div className="ml-auto flex-shrink-0">
            <Link
              href="/quote"
              className="hidden md:inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full text-black"
              style={{ background: gold.metallic }}
            >
              <Calculator size={10} /> Get Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Chapters */}
      {portfolioData.map((project, i) => (
        <div key={project.id} id={`chapter-${project.id}`}>
          <ProjectStory project={project} index={i} onOpen={setActiveProject} />
          {i < portfolioData.length - 1 && (
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <div className="h-px" style={{ background: gold.border }} />
            </div>
          )}
        </div>
      ))}

      {/* Epilogue */}
      <section className="min-h-[55vh] flex items-center justify-center px-6 md:px-12 py-20 border-t" style={{ borderColor: gold.border }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl space-y-7"
        >
          <div className="w-px h-16 mx-auto" style={{ background: gold.border }} />
          <p className="text-foreground/45 font-light text-lg italic">
            "The best events don't end when the lights come up. They live on in the stories guests tell for years."
          </p>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-black"
              style={{ background: gold.metallic, boxShadow: `0 6px 24px ${gold.shadow}` }}
            >
              Write Your Chapter
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-widest text-foreground border transition-all hover:border-amber-500/40"
              style={{ borderColor: gold.border }}
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && <ProjectExperience project={activeProject} onClose={() => setActiveProject(null)} />}
      </AnimatePresence>
    </main>
  )
}
