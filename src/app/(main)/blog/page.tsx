import { getPublishedPosts, getAuthors, getBlogCategories } from '@/app/actions/blog'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Eye } from 'lucide-react'

export const metadata = {
  title: 'Journal | Events District',
  description: 'Curated perspectives on luxury design, craftsmanship, and the art of celebration',
}

interface ExtendedBlogPost {
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
  const postsData = await getPublishedPosts()
  const authorsData = await getAuthors()
  const categoriesData = await getBlogCategories()

  const posts: ExtendedBlogPost[] = postsData.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featured_image_url: post.featured_image_url,
    author: post.author,
    published_at: post.published_at,
    category: post.category,
    category_slug: post.category_slug || post.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized',
    views: post.views || 0,
    gradient: post.gradient,
  }))

  const authors = authorsData as Author[]
  const categories = categoriesData as Category[]

  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : null

  const filteredPosts = activeCategory
    ? posts.filter(post => post.category_slug === activeCategory)
    : posts

  const authorMap: Record<string, Author> = {}
  authors.forEach(author => {
    authorMap[author.id] = author
    authorMap[author.name] = author
  })

  const getReadTime = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const words = plainText.split(/\s+/).length
    return `${Math.ceil(words / 200)} min`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    })
  }

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)
  const trendingPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4)

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ─── Ambient background ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_calc(100%-1px),rgba(128,128,128,0.03)_calc(100%-1px))] bg-[length:25%_100%]" />
      </div>

      {/* ─── Hero ─── */}
      <section className="pt-20 pb-12 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="mb-14">
          <span className="text-[10px] uppercase tracking-[0.8em] text-foreground/40 font-bold block mb-5">
            The Journal
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-foreground leading-none tracking-tight">
              Stories &amp; <br className="hidden md:block" />
              <span className="text-foreground/30 font-light">Perspectives</span>
            </h1>
            <p className="text-sm text-foreground/50 font-light max-w-xs leading-relaxed">
              Curated insights on luxury design, craftsmanship, and the art of celebration.
            </p>
          </div>
          <div className="h-px w-full bg-foreground/10 mt-10" />
        </div>

        {/* ─── Featured post ─── */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20">
            <div className="grid lg:grid-cols-2 gap-0 border border-foreground/10">
              {/* Image */}
              <div className="relative overflow-hidden bg-neutral-900 aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
                <img
                  src={featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9?w=1200&q=80'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.03]"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${featuredPost.gradient || 'from-amber-900/10 via-transparent to-transparent'} from-black/30 via-black/10 to-transparent`} />
                <div className="absolute top-6 left-6">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/60 bg-black/30 backdrop-blur-sm px-3 py-1.5">
                    Featured
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="p-10 md:p-14 flex flex-col justify-between border-l border-foreground/10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-foreground/50">
                      {featuredPost.category}
                    </span>
                    <span className="w-1 h-1 bg-foreground/20 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40">
                      {getReadTime(featuredPost.content)} read
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic leading-tight mb-6 text-foreground group-hover:text-foreground/80 transition-colors [text-wrap:balance]">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-foreground/60 font-light leading-relaxed line-clamp-3 mb-10">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {authorMap[featuredPost.author]?.avatar_url && (
                      <img
                        src={authorMap[featuredPost.author].avatar_url}
                        alt={featuredPost.author}
                        className="w-10 h-10 rounded-full object-cover grayscale"
                      />
                    )}
                    <div>
                      <p className="text-sm font-serif italic text-foreground">{featuredPost.author}</p>
                      {authorMap[featuredPost.author]?.role && (
                        <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-0.5">
                          {authorMap[featuredPost.author].role}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40">
                      {formatDate(featuredPost.published_at)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60 group-hover:text-foreground transition-colors flex items-center gap-2 font-bold">
                      Read Story <span className="text-base">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* ─── Category tabs — ServicesAtelier style ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex gap-7 md:gap-10 overflow-x-auto scrollbar-hide py-4">
            <Link
              href="/blog"
              className="relative shrink-0 group"
            >
              <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                !activeCategory ? 'text-foreground' : 'text-foreground/35 hover:text-foreground/60'
              }`}>
                All
              </span>
              <span className={`absolute -bottom-4 left-0 h-[1px] bg-foreground transition-all duration-500 ${!activeCategory ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className="relative shrink-0 group"
              >
                <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  activeCategory === category.slug ? 'text-foreground' : 'text-foreground/35 hover:text-foreground/60'
                }`}>
                  {category.name}
                </span>
                <span className={`absolute -bottom-4 left-0 h-[1px] bg-foreground transition-all duration-500 ${
                  activeCategory === category.slug ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main grid ─── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

          {/* Left — posts */}
          <div className="lg:col-span-8">

            {/* Section label */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-foreground/10">
              <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50 font-bold">
                {activeCategory
                  ? categories.find(c => c.slug === activeCategory)?.name
                  : 'All Stories'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
              </span>
            </div>

            {remainingPosts.length === 0 && !featuredPost ? (
              <div className="text-center py-24 border border-foreground/10">
                <p className="font-serif italic text-2xl text-foreground/40 mb-6">No stories found.</p>
                <Link
                  href="/blog"
                  className="text-[10px] uppercase tracking-[0.4em] text-foreground/50 hover:text-foreground transition-colors font-bold flex items-center gap-2 justify-center"
                >
                  View all stories <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {remainingPosts.map((post, idx) => {
                  const author = authorMap[post.author]
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block border-b border-foreground/10 last:border-b-0"
                    >
                      <article className="grid md:grid-cols-[1fr_auto] gap-0 py-10">
                        {/* Text */}
                        <div className="flex flex-col justify-between pr-0 md:pr-10">
                          <div>
                            <div className="flex items-center gap-4 mb-4">
                              <span className="text-[9px] uppercase tracking-[0.4em] text-foreground/40">
                                {post.category}
                              </span>
                              <span className="w-1 h-1 bg-foreground/20 rounded-full" />
                              <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">
                                {getReadTime(post.content)} read
                              </span>
                              {(post.views || 0) > 1000 && (
                                <>
                                  <span className="w-1 h-1 bg-foreground/20 rounded-full" />
                                  <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" />
                                    Trending
                                  </span>
                                </>
                              )}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-serif italic leading-tight mb-4 text-foreground group-hover:text-foreground/70 transition-colors [text-wrap:balance]">
                              {post.title}
                            </h3>

                            <p className="text-sm text-foreground/55 font-light leading-relaxed line-clamp-2 mb-6">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {author?.avatar_url && (
                                <img
                                  src={author.avatar_url}
                                  alt={post.author}
                                  className="w-8 h-8 rounded-full object-cover grayscale"
                                />
                              )}
                              <div>
                                <p className="text-xs font-serif italic text-foreground">{post.author}</p>
                                <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 mt-0.5">
                                  {formatShortDate(post.published_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/30">
                              <Eye className="w-3 h-3" />
                              <span className="text-[9px] uppercase tracking-wider">{(post.views || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative overflow-hidden bg-neutral-900 w-full md:w-48 lg:w-56 aspect-[4/3] md:aspect-auto mt-6 md:mt-0 flex-shrink-0">
                          <img
                            src={post.featured_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80'}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <aside className="lg:col-span-4 space-y-14">

            {/* Trending */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50 font-bold">
                  Trending
                </span>
              </div>
              <div className="space-y-6">
                {trendingPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-5 items-start"
                  >
                    <span className="text-2xl font-serif italic text-foreground/15 group-hover:text-foreground/30 transition-colors leading-none pt-1 flex-shrink-0 w-8">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/35 mb-2">
                        {post.category}
                      </p>
                      <h4 className="text-sm font-serif italic text-foreground group-hover:text-foreground/60 transition-colors leading-snug line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-foreground/30">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{(post.views || 0).toLocaleString()} reads</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            {/* Newsletter */}
            <div>
              <div className="mb-6 pb-4 border-b border-foreground/10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50 font-bold">
                  The Digest
                </span>
              </div>
              <h3 className="text-2xl font-serif italic text-foreground mb-3 leading-tight">
                Join The<br />Inner Circle
              </h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed mb-8">
                Weekly insights on luxury design, delivered with intention. No noise, only inspiration.
              </p>
              <form className="space-y-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/30 text-foreground"
                />
                <button
                  type="submit"
                  className="mt-6 w-full py-3 border border-foreground text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            {/* Contributors */}
            <div>
              <div className="mb-6 pb-4 border-b border-foreground/10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50 font-bold">
                  Contributors
                </span>
              </div>
              <div className="space-y-5">
                {authors.slice(0, 4).map((author) => (
                  <div key={author.id} className="flex items-center gap-4 group">
                    <img
                      src={author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div>
                      <p className="text-sm font-serif italic text-foreground group-hover:text-foreground/70 transition-colors">
                        {author.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 mt-0.5">
                        {author.role || 'Contributor'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <div className="mb-6 pb-4 border-b border-foreground/10">
                <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50 font-bold">
                  Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                    className={`text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 ${
                      activeCategory === cat.slug
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </section>

      {/* ─── Pull quote ─── */}
      <section className="border-t border-b border-foreground/10 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="h-px w-12 bg-foreground/20 mx-auto mb-10" />
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-foreground leading-tight mb-8 [text-wrap:balance]">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>
          <cite className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 not-italic">
            — Steve Jobs
          </cite>
          <div className="h-px w-12 bg-foreground/20 mx-auto mt-10" />
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="relative overflow-hidden border border-foreground/10">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
              alt=""
              className="w-full h-full object-cover grayscale-[60%] opacity-20"
            />
            <div className="absolute inset-0 bg-background/80" />
          </div>
          <div className="grid md:grid-cols-2 gap-0 items-center">
            <div className="p-12 md:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-foreground/10">
              <span className="text-[10px] uppercase tracking-[0.6em] text-foreground/40 block mb-5">
                Our Work
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-foreground leading-tight mb-6">
                The Art of<br />
                <span className="text-foreground/40 font-light">Celebration</span>
              </h2>
              <p className="text-sm text-foreground/55 font-light leading-relaxed max-w-sm">
                Behind every story in this journal is an event crafted with intention.
                Explore our portfolio.
              </p>
            </div>
            <div className="p-12 md:p-16 lg:p-20 flex flex-col gap-6 justify-center">
              <Link
                href="/portfolio"
                className="group flex items-center justify-between py-5 border-b border-foreground/15 hover:border-foreground/40 transition-colors"
              >
                <span className="text-sm font-serif italic text-foreground">View the Portfolio</span>
                <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center justify-between py-5 border-b border-foreground/15 hover:border-foreground/40 transition-colors"
              >
                <span className="text-sm font-serif italic text-foreground">Start a Project</span>
                <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#journal"
                className="group flex items-center justify-between py-5"
              >
                <span className="text-sm font-serif italic text-foreground">Back to Top</span>
                <span className="text-foreground/40 group-hover:text-foreground transition-colors text-sm">↑</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-serif italic text-2xl text-foreground mb-4">Events District</h3>
              <p className="text-sm text-foreground/40 font-light max-w-xs leading-relaxed">
                Curating exceptional events and experiences with precision and creativity.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/40 mb-5 font-bold">Explore</p>
              <ul className="space-y-3 text-sm text-foreground/50">
                <li><Link href="/blog" className="hover:text-foreground transition-colors font-light">Journal</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors font-light">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors font-light">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/40 mb-5 font-bold">Connect</p>
              <ul className="space-y-3 text-sm text-foreground/50">
                <li><a href="#" className="hover:text-foreground transition-colors font-light">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors font-light">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors font-light">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">
              © 2025 Events District
            </p>
            <div className="h-px w-16 bg-foreground/10" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/30">
              All rights reserved
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
