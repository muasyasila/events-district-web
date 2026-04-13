"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, Clock, Eye, BookOpen, X } from 'lucide-react'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

const POSTS = [
  {
    id: 1,
    category: 'Wedding Planning',
    tag: 'Most Read',
    title: 'The 12 Things Every Couple Forgets When Planning Their Wedding Décor',
    excerpt: 'After 500+ weddings, here are the details that consistently get overlooked — and the ones that guests remember years later.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900&h=600',
    author: 'Events District Team',
    date: 'Mar 15, 2024',
    readTime: '8 min',
    views: '4.2k',
    featured: true,
  },
  {
    id: 2,
    category: 'Event Design',
    tag: 'Trending',
    title: 'Why Negative Space Is the Most Underused Luxury Tool in Event Décor',
    excerpt: 'The Hermès principle applied to events: what you leave empty says more than what you fill.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9?auto=format&fit=crop&q=80&w=900&h=600',
    author: 'Events District Team',
    date: 'Mar 10, 2024',
    readTime: '6 min',
    views: '2.8k',
    featured: false,
  },
  {
    id: 3,
    category: 'Corporate Events',
    tag: 'New',
    title: 'How Branded Environments Drive ROI at Product Launches',
    excerpt: 'A breakdown of how immersive event design directly affects press coverage, social sharing, and brand recall.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=900&h=600',
    author: 'Events District Team',
    date: 'Mar 5, 2024',
    readTime: '10 min',
    views: '1.9k',
    featured: false,
  },
  {
    id: 4,
    category: 'Lighting Design',
    tag: null,
    title: 'Painting With Light: The Art of Ambient Emotion',
    excerpt: 'Lighting is responsible for 60% of how a guest feels in a space. Here is exactly how we use it.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=900&h=600',
    author: 'Events District Team',
    date: 'Feb 28, 2024',
    readTime: '7 min',
    views: '3.1k',
    featured: false,
  },
  {
    id: 5,
    category: 'Budgeting',
    tag: null,
    title: 'How to Allocate Your Event Décor Budget for Maximum Visual Impact',
    excerpt: 'The rule we follow internally: 40% on the entrance, 35% on the centrepieces, 25% on everything else.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=900&h=600',
    author: 'Events District Team',
    date: 'Feb 20, 2024',
    readTime: '5 min',
    views: '5.4k',
    featured: false,
  },
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

// ─── Article modal ─────────────────────────────────────────────────────────────
function ArticleModal({ post, onClose }: { post: typeof POSTS[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] overflow-y-auto bg-background"
    >
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-10" style={{ background: gold.border }}>
        <motion.div
          className="h-full"
          style={{ background: gold.metallic }}
          initial={{ width: '0%' }}
          animate={{ width: '65%' }}
          transition={{ duration: 8, ease: 'linear' }}
        />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b" style={{ borderColor: gold.border }}>
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoldRule className="w-5" />
            <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>{post.category}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-foreground/5"
            style={{ borderColor: gold.border }}
          >
            <X size={13} className="text-foreground/50" />
          </button>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex items-center gap-4 mb-5 text-[10px] uppercase tracking-wider text-foreground/40">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-foreground/20" />
            <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-foreground/20" />
            <span className="flex items-center gap-1"><Eye size={10} />{post.views}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">{post.title}</h1>

          <div
            className="border-l-2 pl-5 mb-8 italic text-lg md:text-xl text-foreground/65 leading-relaxed"
            style={{ borderColor: gold.light }}
          >
            {post.excerpt}
          </div>

          <div className="space-y-5 text-base text-foreground/65 leading-relaxed font-light">
            <p>Planning a luxury event involves dozens of decisions, but the ones that create the most lasting impression are rarely the biggest budget items. After designing over 500 events across Kenya and beyond, our team has identified the patterns that separate memorable experiences from forgettable ones.</p>
            <p>The most consistent finding? Guests remember how a space made them feel in the first thirty seconds. The entrance experience — what they see, smell, and hear before they've even greeted the host — determines their emotional baseline for the entire event.</p>
            <p>This is why our internal budget allocation rule (40% on the entrance, 35% on centrepieces, 25% on everything else) consistently outperforms the instinct to spread budget evenly across all elements.</p>
            <p>The second most impactful decision is lighting temperature. Warm amber light at 2700–3000K creates intimacy; cooler tones at 4000K+ create energy and clarity. Most venues default to something in between that achieves neither effect.</p>
          </div>

          {/* CTA inside article */}
          <div
            className="mt-10 p-6 rounded-2xl border"
            style={{ borderColor: gold.border, background: gold.glow }}
          >
            <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: gold.light }}>Ready to apply this?</p>
            <p className="text-sm text-foreground/60 mb-4 leading-relaxed">
              Book a free 30-minute consultation and we'll walk through exactly how these principles apply to your specific event.
            </p>
            <div className="flex gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                style={{ background: gold.metallic }}
              >
                Book Consultation <ArrowRight size={11} />
              </a>
              <a
                href="/quote"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-medium text-foreground border transition-all"
                style={{ borderColor: gold.border }}
              >
                Get Quote
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function BlogJournal() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const featured = POSTS[0]
  const rest = POSTS.slice(1)

  const categories = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))]
  const filtered = activeCategory === 'All' ? rest : rest.filter(p => p.category === activeCategory)

  return (
    <section
      ref={ref}
      id="journal"
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none opacity-60"
        style={{ background: `radial-gradient(ellipse, ${gold.glow} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14"
        >
          <SectionLabel>The Journal</SectionLabel>
          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mt-2">
              Ideas that make{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                events better.
              </span>
            </h2>
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-medium group/va flex-shrink-0"
              style={{ color: gold.light }}
            >
              <span className="underline underline-offset-4 group-hover/va:no-underline transition-all">
                View all articles
              </span>
              <ArrowRight size={11} className="group-hover/va:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Featured article */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 md:mb-12"
        >
          <button
            onClick={() => setSelectedPost(featured)}
            className="w-full group text-left"
          >
            <div
              className="grid md:grid-cols-2 rounded-2xl overflow-hidden border transition-all duration-300 group-hover:border-amber-500/30"
              style={{ borderColor: gold.border }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[300px] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 hidden md:block" />
                {featured.tag && (
                  <div
                    className="absolute top-4 left-4 text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                    style={{ background: gold.metallic, color: 'black' }}
                  >
                    {featured.tag}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className="p-6 md:p-10 flex flex-col justify-between"
                style={{ background: gold.glow }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>{featured.category}</span>
                    <span className="w-1 h-1 rounded-full" style={{ background: gold.border }} />
                    <span className="text-[9px] text-foreground/40 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={9} /> Featured
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-foreground leading-tight mb-4 group-hover:text-foreground/80 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-foreground/55 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] text-foreground/35 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock size={10} />{featured.readTime}</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{featured.views} reads</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium group-hover:gap-2.5 transition-all"
                    style={{ color: gold.light }}
                  >
                    Read article <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-7"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200"
              style={{
                borderColor: activeCategory === cat ? gold.light : gold.border,
                background: activeCategory === cat ? gold.metallic : 'transparent',
                color: activeCategory === cat ? 'black' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
            >
              <button
                onClick={() => setSelectedPost(post)}
                className="w-full text-left group h-full"
              >
                <div className="flex flex-col h-full rounded-xl overflow-hidden border transition-all duration-300 group-hover:border-amber-500/30" style={{ borderColor: gold.border }}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.tag && (
                      <div
                        className="absolute top-3 left-3 text-[7px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{ background: gold.metallic, color: 'black' }}
                      >
                        {post.tag}
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col flex-1 p-4">
                    <span className="text-[9px] uppercase tracking-[0.25em] mb-2 block" style={{ color: gold.light }}>
                      {post.category}
                    </span>
                    <h4 className="text-sm font-medium text-foreground leading-snug mb-2 group-hover:text-foreground/75 transition-colors line-clamp-3 flex-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: gold.border }}>
                      <span className="text-[9px] text-foreground/35 flex items-center gap-1">
                        <Clock size={9} />{post.readTime}
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-wider font-medium group-hover:gap-1.5 flex items-center gap-1 transition-all"
                        style={{ color: gold.light }}
                      >
                        Read <ArrowRight size={8} />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderColor: gold.border }}
        >
          <div>
            <p className="text-sm font-light text-foreground/55 text-center sm:text-left">
              Every article is written from real experience — 500+ events, 10+ years.
            </p>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-black flex-shrink-0"
            style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
          >
            Read All Articles <ArrowRight size={11} />
          </a>
        </motion.div>
      </div>

      {/* Article modal */}
      <AnimatePresence>
        {selectedPost && (
          <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
