import { notFound } from 'next/navigation'
import { getPostBySlug, getAuthors, getRelatedPosts } from '@/app/actions/blog'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, BookOpen } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  featured_image_url: string | null
  author: string
  read_time: string | null
  views: number
  gradient: string
  status: string
  published_at: string | null
  tags: string[]
  insights?: string[]
  created_at: string
  updated_at: string
}

interface Author {
  name: string
  bio: string
  avatar_url: string
  role: string
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  const authors = await getAuthors()
  const author = authors.find((a: Author) => a.name === post.author)
  const relatedPosts = await getRelatedPosts(post.id, post.category)
  
  // Get key insights
  const getKeyInsights = (content: string, category: string): string[] => {
    if (post.insights && post.insights.length > 0) {
      return post.insights
    }
    
    const plainText = content.replace(/<[^>]*>/g, '')
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 40 && s.trim().length < 200)
    
    if (sentences.length >= 3) {
      return sentences.slice(0, 3).map(s => s.trim())
    }
    
    const fallbackInsights: Record<string, string[]> = {
      "Design Philosophy": [
        "Understanding the philosophy behind minimalist luxury",
        "How negative space creates more impact than clutter",
        "The psychology of intentional design choices"
      ],
      "Craftsmanship": [
        "The value of handmade over mass-produced",
        "Why craftsmanship takes time and patience",
        "How artisans preserve traditional techniques"
      ],
      "Material Stories": [
        "The history behind rare and precious materials",
        "How to select materials that tell a story",
        "Sustainable sourcing in luxury design"
      ],
      "Light & Space": [
        "The dramatic effect of strategic lighting",
        "How shadows create mood and atmosphere",
        "Working with natural light for optimal impact"
      ],
      "Sustainable Luxury": [
        "Eco-conscious choices that don't compromise elegance",
        "The future of sustainable luxury materials",
        "How to create beauty with environmental responsibility"
      ]
    }
    
    return fallbackInsights[category] || [
      `Understanding the philosophy behind ${category.toLowerCase()}`,
      "Practical applications for your own spaces",
      "Expert perspectives from industry leaders"
    ]
  }
  
  const insights = getKeyInsights(post.content, post.category)
  
  // Calculate read time
  const getReadTime = (content: string): string => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const words = plainText.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img
          src={post.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-foreground">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'Just now'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>{post.read_time || getReadTime(post.content)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Excerpt */}
        <div className="border-l-2 border-foreground/20 pl-8 py-4 mb-12">
          <p className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
            "{post.excerpt}"
          </p>
        </div>
        
        {/* Main Content */}
        <div className="text-lg text-foreground/70 leading-relaxed font-light">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose prose-invert max-w-none [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:italic [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:italic [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-foreground/70 [&_a]:underline [&_a]:hover:text-foreground [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
          />
        </div>
        
        {/* Key Insights */}
        <div className="bg-foreground/[0.02] border border-foreground/10 p-8 rounded-sm my-12">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">Key Insights</h4>
          <ul className="space-y-4">
            {insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 text-foreground/70 font-light">
                <span className="w-1 h-1 bg-foreground/40 rounded-full mt-2.5 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Author Section */}
        {author && (
          <div className="flex items-start gap-6 py-8 border-t border-foreground/10 mt-12">
            <img
              src={author.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover grayscale"
            />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-1">Written by</p>
              <h4 className="text-xl font-serif italic text-foreground mb-1">{author.name}</h4>
              <p className="text-sm text-foreground/60 mb-3">{author.role}</p>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">{author.bio}</p>
            </div>
          </div>
        )}
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 mt-12 border-t border-foreground/10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-8">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((related: BlogPost) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4">
                    <img
                      src={related.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
                      alt={related.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/40">{related.category}</span>
                  <h4 className="font-serif italic text-xl mt-2 group-hover:text-foreground/70 transition-colors">{related.title}</h4>
                  <p className="text-sm text-foreground/50 mt-2 line-clamp-2 font-light">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}