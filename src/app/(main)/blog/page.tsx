import { getPublishedPosts, getAuthors, getBlogCategories } from '@/app/actions/blog'
import Link from 'next/link'
import { Calendar, Eye, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'The Journal | Events District',
  description: 'Insights on luxury design, craftsmanship, and the art of celebration',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const authors = await getAuthors()
  const categories = await getBlogCategories()
  
  // Create author map for quick lookup
  const authorMap: Record<string, any> = {}
  authors.forEach(author => {
    authorMap[author.name] = author
  })

  // Calculate read time helper
  const getReadTime = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const words = plainText.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif italic text-foreground mb-6">
            The Journal
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-light">
            Stories on design philosophy, craftsmanship, material stories, 
            and the art of creating unforgettable moments.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">No blog posts yet.</p>
            <p className="text-foreground/40 text-sm mt-2">Check back soon for inspiring stories.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const author = authorMap[post.author]
              const readTime = post.read_time || getReadTime(post.content)
              
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-black border border-foreground/10 rounded-lg overflow-hidden hover:border-foreground/30 transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category */}
                      <span className="text-[10px] uppercase tracking-wider text-foreground/40 mb-3">
                        {post.category}
                      </span>
                      
                      {/* Title */}
                      <h2 className="text-xl font-serif italic text-foreground mb-3 group-hover:text-foreground/70 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="text-sm text-foreground/50 font-light mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                        <div className="flex items-center gap-3">
                          {author?.avatar_url && (
                            <img
                              src={author.avatar_url}
                              alt={post.author}
                              className="w-8 h-8 rounded-full object-cover grayscale"
                            />
                          )}
                          <div>
                            <p className="text-xs text-foreground/60">{post.author}</p>
                            <div className="flex items-center gap-3 text-[10px] text-foreground/40 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {post.published_at 
                                  ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : 'Just now'}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen size={10} />
                                {readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={10} />
                                {post.views}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}