import React from 'react'
import { getPublishedPosts, getAuthors, getBlogCategories } from '@/app/actions/blog'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Eye, Clock, Calculator } from 'lucide-react'

export const metadata = {
  title: 'Journal | Events District',
  description: 'Expert insights on luxury event design, wedding planning, and the art of celebration — from a team with 500+ events of experience.',
}

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
  content: string
  excerpt: string
  featured_image_url: string | null
  author: string
  published_at: string | null
  category: string
  category_slug: string
  views: number
  gradient?: string
  read_time?: string | null
}

interface Author {
  id: string
  name: string
  bio: string
  avatar_url: string
  role: string
}

interface Category {
  name: string
  slug: string
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const postsData   = await getPublishedPosts()
  const authorsData = await getAuthors()
  const catsData    = await getBlogCategories()

  const posts: BlogPost[] = postsData.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    featured_image_url: p.featured_image_url,
    author: p.author,
    published_at: p.published_at,
    category: p.category,
    category_slug: p.category_slug || p.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized',
    views: p.views || 0,
    gradient: p.gradient,
    read_time: p.read_time,
  }))

  const authors   = authorsData as Author[]
  const categories = catsData as Category[]

  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : null
  const filteredPosts  = activeCategory ? posts.filter(p => p.category_slug === activeCategory) : posts

  const authorMap: Record<string, Author> = {}
  authors.forEach(a => { authorMap[a.id] = a; authorMap[a.name] = a })

  const getReadTime = (content: string, stored?: string | null) => {
    if (stored) return stored
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return `${Math.ceil(words / 200)} min`
  }

  const fmt      = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  const fmtShort = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : ''

  const featured       = filteredPosts[0]
  const remaining      = filteredPosts.slice(1)
  const trending       = [...posts].sort((a, b) => b.views - a.views).slice(0, 4)

  const fallbackImg    = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px]" style={{ background: gold.glow }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px]" style={{ background: gold.glow }} />
      </div>

      {/* ── Gold top rule ── */}
      <div className="h-px w-full" style={{ background: gold.metallic }} />

      {/* ── Hero ── */}
      <section className="pt-20 pb-12 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px" style={{ background: gold.metallic }} />
            <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>The Journal</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.0]">
              Stories &amp;{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                Perspectives
              </span>
            </h1>
            <p className="text-sm text-foreground/50 font-light max-w-xs leading-relaxed">
              Expert insights from a team with 500+ luxury events across Kenya and beyond.
            </p>
          </div>
          <div className="h-px w-full mt-10" style={{ background: gold.border }} />
        </div>

        {/* ── Featured post ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-16">
            <div
              className="grid lg:grid-cols-2 rounded-2xl overflow-hidden border transition-all duration-500 group-hover:border-amber-500/30"
              style={{ borderColor: gold.border }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden bg-neutral-900">
                <img
                  src={featured.featured_image_url || fallbackImg}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/15" />
                <div className="absolute top-5 left-5">
                  <span className="text-[8px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider" style={{ background: gold.metallic, color: 'black' }}>
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-between border-t lg:border-t-0 lg:border-l" style={{ borderColor: gold.border, background: gold.glow }}>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>{featured.category}</span>
                    <span className="w-1 h-1 rounded-full" style={{ background: gold.border }} />
                    <span className="text-[9px] uppercase tracking-wider text-foreground/40 flex items-center gap-1">
                      <Clock size={9} />{getReadTime(featured.content, featured.read_time)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-snug mb-4 group-hover:text-foreground/80 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-foreground/55 font-light leading-relaxed line-clamp-4">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  {authorMap[featured.author] && (
                    <div className="flex items-center gap-3">
                      {authorMap[featured.author].avatar_url && (
                        <img src={authorMap[featured.author].avatar_url} alt={featured.author} className="w-9 h-9 rounded-full object-cover" style={{ border: `1.5px solid ${gold.light}` }} />
                      )}
                      <div>
                        <p className="text-sm text-foreground font-medium">{featured.author}</p>
                        <p className="text-[9px] uppercase tracking-wider text-foreground/40">{authorMap[featured.author].role}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: gold.border }}>
                    <span className="text-[9px] uppercase tracking-wider text-foreground/35">{fmt(featured.published_at)}</span>
                    <span className="text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5 group-hover:gap-3 transition-all" style={{ color: gold.light }}>
                      Read article <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* ── Category tabs ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b" style={{ borderColor: gold.border }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex gap-6 md:gap-10 overflow-x-auto py-4" style={{ scrollbarWidth: 'none' }}>
            <Link
              href="/blog"
              className="relative shrink-0 group"
            >
              <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${!activeCategory ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}>
                All
              </span>
              <span className={`absolute -bottom-4 left-0 h-px transition-all duration-500 ${!activeCategory ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ background: gold.metallic }} />
            </Link>
            {categories.map(cat => (
              <Link key={cat.name} href={`/blog?category=${encodeURIComponent(cat.slug)}`} className="relative shrink-0 group">
                <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${activeCategory === cat.slug ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}>
                  {cat.name}
                </span>
                <span className={`absolute -bottom-4 left-0 h-px transition-all duration-500 ${activeCategory === cat.slug ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ background: gold.metallic }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left — articles */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: gold.border }}>
              <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/40">
                {activeCategory ? categories.find(c => c.slug === activeCategory)?.name : 'All Stories'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
              </span>
            </div>

            {remaining.length === 0 && !featured ? (
              <div className="text-center py-20 rounded-2xl border" style={{ borderColor: gold.border }}>
                <p className="text-foreground/40 italic text-lg mb-4">No stories found.</p>
                <Link href="/blog" className="text-xs uppercase tracking-wider flex items-center gap-2 justify-center" style={{ color: gold.light }}>
                  View all <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {remaining.map((post, idx) => {
                  const author = authorMap[post.author]
                  return (
                    <>
                      <Link href={`/blog/${post.slug}`} className="group block border-b py-8 last:border-b-0" style={{ borderColor: gold.border }}>
                        <article className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10">
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>{post.category}</span>
                                <span className="w-1 h-1 rounded-full" style={{ background: gold.border }} />
                                <span className="text-[9px] uppercase tracking-wider text-foreground/35 flex items-center gap-1">
                                  <Clock size={8} />{getReadTime(post.content, post.read_time)}
                                </span>
                                {post.views > 1000 && (
                                  <>
                                    <span className="w-1 h-1 rounded-full" style={{ background: gold.border }} />
                                    <span className="text-[9px] uppercase tracking-wider text-foreground/35 flex items-center gap-1">
                                      <TrendingUp size={8} />Trending
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 className="text-xl md:text-2xl font-light text-foreground leading-snug mb-3 group-hover:text-foreground/70 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-sm text-foreground/50 font-light leading-relaxed line-clamp-2">
                                {post.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                {author?.avatar_url && (
                                  <img src={author.avatar_url} alt={post.author} className="w-7 h-7 rounded-full object-cover" style={{ border: `1.5px solid ${gold.light}` }} />
                                )}
                                <div>
                                  <p className="text-xs text-foreground font-medium">{post.author}</p>
                                  <p className="text-[9px] uppercase tracking-wider text-foreground/35">{fmtShort(post.published_at)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-foreground/30 text-[9px] uppercase tracking-wider">
                                <Eye size={9} />{post.views.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="relative overflow-hidden rounded-xl w-full md:w-44 lg:w-52 aspect-[4/3] md:aspect-auto flex-shrink-0">
                            <img
                              src={post.featured_image_url || fallbackImg}
                              alt={post.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
                            />
                          </div>
                        </article>
                      </Link>

                      {/* Mid-list CTA — appears after 3rd article */}
                      {idx === 2 && (
                        <div
                          className="my-2 px-6 py-5 rounded-2xl border"
                          style={{ borderColor: gold.border, background: gold.glow }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: gold.light }}>✦ Planning an event?</p>
                              <p className="text-sm text-foreground/60 leading-snug">
                                Get an instant quote for your wedding décor — live pricing, no vague estimates.
                              </p>
                            </div>
                            <Link
                              href="/quote"
                              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                              style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                            >
                              <Calculator size={11} /> Get Quote
                            </Link>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <aside className="lg:col-span-4 space-y-10">

            {/* Quote CTA card */}
            <div className="rounded-2xl p-6 border" style={{ borderColor: gold.border, background: gold.glow }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-4" style={{ background: gold.metallic }}>
                <Calculator size={14} style={{ color: '#1a1400' }} />
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: gold.light }}>Instant Pricing</p>
              <h4 className="text-base font-light text-foreground mb-2">Wedding Quote Engine</h4>
              <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                Live pricing based on your guest count. No guesswork, no waiting.
              </p>
              <Link
                href="/quote"
                className="block w-full py-2.5 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                style={{ background: gold.metallic }}
              >
                Get Instant Quote
              </Link>
            </div>

            {/* Trending */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b" style={{ borderColor: gold.border }}>
                <div className="w-6 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Trending</span>
              </div>
              <div className="space-y-5">
                {trending.map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
                    <span className="text-xl font-light text-foreground/12 group-hover:text-foreground/25 transition-colors leading-none pt-0.5 flex-shrink-0 w-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: gold.light }}>{post.category}</p>
                      <h5 className="text-sm text-foreground group-hover:text-foreground/65 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: gold.border }} />

            {/* Newsletter */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>The Digest</span>
              </div>
              <h4 className="text-lg font-light text-foreground mb-2">Join the Inner Circle</h4>
              <p className="text-xs text-foreground/50 leading-relaxed mb-5">
                Monthly planning tips and event inspiration. No spam, ever.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-foreground/20 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                  style={{ background: gold.metallic }}
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="h-px" style={{ background: gold.border }} />

            {/* Topics */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                    className="text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      borderColor: activeCategory === cat.slug ? gold.light : gold.border,
                      background: activeCategory === cat.slug ? gold.metallic : 'transparent',
                      color: activeCategory === cat.slug ? 'black' : undefined,
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pb-20">
        <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: gold.border }}>
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-background/85" />
          </div>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r" style={{ borderColor: gold.border }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Our Work</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-foreground leading-snug mb-4">
                Behind every article<br />
                <span className="italic" style={{ color: gold.light }}>is a real event.</span>
              </h2>
              <p className="text-sm text-foreground/50 leading-relaxed">
                Our portfolio shows the work that inspired these stories.
              </p>
            </div>
            <div className="p-10 md:p-14 flex flex-col gap-4 justify-center">
              {[
                { label: 'View the Portfolio', href: '/portfolio' },
                { label: 'Start a Project', href: '/contact' },
                { label: 'Get Instant Quote', href: '/quote' },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between py-4 border-b transition-colors hover:border-amber-500/30"
                  style={{ borderColor: gold.border }}
                >
                  <span className="text-sm text-foreground group-hover:text-foreground/70 transition-colors">{item.label}</span>
                  <ArrowRight size={14} className="text-foreground/30 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}