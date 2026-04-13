"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPublishedPosts, getAuthors, getBlogCategories } from '@/app/actions/blog'
import { ArrowRight, Clock, Eye, BookOpen } from 'lucide-react'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  featured_image_url: string | null
  author: string
  read_time: string | null
  views: number
  published_at: string | null
  tags: string[]
}

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

export default function BlogCarousel() {
  const router = useRouter()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getBlogCategories(),
        ])
        setPosts(postsData)
        setCategories(['All', ...categoriesData.map((c: any) => c.name)])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const featured = posts[0]
  const rest = posts.slice(1, 5) // show up to 4 grid cards

  const filteredRest = activeCategory === 'All'
    ? rest
    : rest.filter(p => p.category === activeCategory)

  const formatDate = (d: string | null) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <section
      ref={ref}
      id="journal"
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-48 pointer-events-none opacity-60"
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
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-medium group/va flex-shrink-0"
              style={{ color: gold.light }}
            >
              <span className="underline underline-offset-4 group-hover/va:no-underline transition-all">
                View all articles
              </span>
              <ArrowRight size={11} className="group-hover/va:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="h-72 rounded-2xl animate-pulse" style={{ background: gold.glow }} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: gold.glow }} />)}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground/40 text-sm">No articles published yet. Check back soon.</p>
          </div>
        )}

        {/* Featured article */}
        {!loading && featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 md:mb-10"
          >
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div
                className="grid md:grid-cols-2 rounded-2xl overflow-hidden border transition-all duration-300 group-hover:border-amber-500/30"
                style={{ borderColor: gold.border }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[300px] overflow-hidden">
                  <img
                    src={featured.featured_image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/15 hidden md:block" />
                  <div
                    className="absolute top-4 left-4 text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                    style={{ background: gold.metallic, color: 'black' }}
                  >
                    Featured
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 flex flex-col justify-between" style={{ background: gold.glow }}>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>
                        {featured.category}
                      </span>
                      <span className="w-1 h-1 rounded-full" style={{ background: gold.border }} />
                      <span className="text-[9px] text-foreground/40 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen size={9} /> {featured.read_time || '5 min'}
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
                      <span>{formatDate(featured.published_at)}</span>
                      <span className="flex items-center gap-1"><Eye size={10} />{featured.views}</span>
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
            </Link>
          </motion.div>
        )}

        {/* Category filter */}
        {!loading && posts.length > 1 && (
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
        )}

        {/* Grid */}
        {!loading && filteredRest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredRest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div
                    className="flex flex-col h-full rounded-xl overflow-hidden border transition-all duration-300 group-hover:border-amber-500/30"
                    style={{ borderColor: gold.border }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                      <img
                        src={post.featured_image_url || 'https://images.unsplash.com/photo-1619966927665-f7e7ee04c0e0?auto=format&fit=crop&q=80&w=600'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <span className="text-[9px] uppercase tracking-[0.25em] mb-2 block" style={{ color: gold.light }}>
                        {post.category}
                      </span>
                      <h4 className="text-sm font-medium text-foreground leading-snug mb-2 group-hover:text-foreground/75 transition-colors line-clamp-3 flex-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: gold.border }}>
                        <span className="text-[9px] text-foreground/35 flex items-center gap-1">
                          <Clock size={9} />{post.read_time || '5 min'}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-medium flex items-center gap-1 transition-all" style={{ color: gold.light }}>
                          Read <ArrowRight size={8} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ borderColor: gold.border }}
          >
            <p className="text-sm font-light text-foreground/50 text-center sm:text-left">
              Every article is written from real experience — 500+ events, 10+ years.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-black flex-shrink-0"
              style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
            >
              Read All Articles <ArrowRight size={11} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
