"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getPublishedPosts, getAuthors, getBlogCategories } from '@/app/actions/blog'

// Types for blog data from database
interface BlogPostFromDB {
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
}

interface Author {
  name: string
  bio: string
  avatar_url: string
  role: string
}

export default function BlogCarousel() {
  const [blogPosts, setBlogPosts] = useState<BlogPostFromDB[]>([])
  const [authors, setAuthors] = useState<Record<string, Author>>({})
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  
  const [selectedPost, setSelectedPost] = useState<BlogPostFromDB | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [claps, setClaps] = useState<Record<string, number>>({})
  const [readingProgress, setReadingProgress] = useState(0)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const AUTO_PLAY_DURATION = 5000
  const minSwipeDistance = 50
  // Adjust this based on your navbar height (typically 64-80px)
  const NAVBAR_HEIGHT = 80

  // Fetch blog posts from database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const posts = await getPublishedPosts()
        setBlogPosts(posts)
        
        // Fetch authors
        const authorsData = await getAuthors()
        const authorsMap: Record<string, Author> = {}
        authorsData.forEach(author => {
          authorsMap[author.name] = {
            name: author.name,
            bio: author.bio,
            avatar_url: author.avatar_url,
            role: author.role
          }
        })
        setAuthors(authorsMap)
        
        // Fetch categories
        const categoriesData = await getBlogCategories()
        const categoryNames = ['All', ...categoriesData.map(c => c.name)]
        setCategories(categoryNames)
        
        // Set initial active index to middle of carousel
        if (posts.length > 0) {
          setActiveIndex(Math.floor(posts.length / 2))
        }
      } catch (error) {
        console.error('Error fetching blog data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Load saved posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('blogSavedPosts')
    if (saved) setSavedPosts(JSON.parse(saved))
    const savedClaps = localStorage.getItem('blogClaps')
    if (savedClaps) setClaps(JSON.parse(savedClaps))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('blogSavedPosts', JSON.stringify(savedPosts))
  }, [savedPosts])
  
  useEffect(() => {
    localStorage.setItem('blogClaps', JSON.stringify(claps))
  }, [claps])

  // Dynamic Reading Time Estimator
  const [actualReadTime, setActualReadTime] = useState<string>("")
  
  useEffect(() => {
    if (selectedPost) {
      const words = selectedPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length
      const minutes = Math.ceil(words / 200)
      setActualReadTime(`${minutes} min read`)
    }
  }, [selectedPost])

  // Text-to-Speech / Listen Mode - Now reads title + excerpt + content
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const speak = useCallback(() => {
    if ('speechSynthesis' in window && selectedPost) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        // Create comprehensive speech content: Title + Excerpt + Content
        const titleText = selectedPost.title
        const excerptText = selectedPost.excerpt
        const plainContent = selectedPost.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        
        const fullText = `${titleText}. ${excerptText}. ${plainContent}`
        
        const utterance = new SpeechSynthesisUtterance(fullText)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
      }
    }
  }, [isSpeaking, selectedPost])

  // Cleanup speech synthesis when modal closes
  useEffect(() => {
    if (!selectedPost && isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [selectedPost, isSpeaking])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isSwiping) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && filteredPosts.length > 2) {
      handleNext()
    }
    if (isRightSwipe && filteredPosts.length > 2) {
      handlePrev()
    }
    
    setIsSwiping(false)
    setTouchStart(null)
    setTouchEnd(null)
  }

  const getCarouselConfig = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200
    const height = typeof window !== 'undefined' ? window.innerHeight : 800
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024
    
    // Card sizes - EXACTLY as in your original code
    const cardWidth = isMobile ? 240 : 300
    const cardHeight = isMobile ? 320 : 400
    
    // Dynamic radius based on screen size for optimal visible cards
    // Mobile: 3 visible cards, Tablet: 5 visible cards, Desktop: 7 visible cards
    let radiusX, radiusY, angleSpacing
    
    if (isDesktop) {
      // Desktop - 7 visible cards
      radiusX = Math.min(width * 0.4, 520)
      radiusY = 40
      angleSpacing = Math.PI / 5.2 // About 34.6-degree spacing
    } else if (isTablet) {
      // Tablet - 5 visible cards
      radiusX = Math.min(width * 0.38, 380)
      radiusY = 35
      angleSpacing = Math.PI / 6.5 // About 27.7-degree spacing
    } else {
      // Mobile - 3 visible cards
      radiusX = width * 0.45
      radiusY = 20
      angleSpacing = Math.PI / 8 // About 22.5-degree spacing
    }
    
    // Add padding to prevent cards from touching screen edges
    const horizontalPadding = isMobile ? 20 : isTablet ? 40 : 60
    
    return {
      radiusX,
      radiusY,
      cardWidth,
      cardHeight,
      angleSpacing,
      horizontalPadding,
      isMobile,
      isTablet,
      isDesktop
    }
  }

  const [config, setConfig] = useState(getCarouselConfig())

  useEffect(() => {
    const handleResize = () => setConfig(getCarouselConfig())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filter and search posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate layout based on filtered posts count
  const getFilteredCardStyle = (index: number, totalFiltered: number, currentActiveIndex: number) => {
    const { radiusX, radiusY, cardWidth, angleSpacing, isMobile } = config
    
    if (totalFiltered === 0) return { x: 0, z: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, isActive: true }
    
    if (totalFiltered === 1) {
      return { x: 0, z: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, isActive: true }
    }
    
    if (totalFiltered === 2) {
      const offset = index === 0 ? -1 : 1
      const x = offset * (cardWidth * 0.7)
      return { 
        x, 
        z: 0, 
        scale: 0.9, 
        rotateY: offset * -5, 
        opacity: 1, 
        zIndex: 10, 
        isActive: true 
      }
    }
    
    let offset = index - currentActiveIndex
    
    // Handle wrapping for infinite carousel feel
    if (offset > totalFiltered / 2) offset -= totalFiltered
    if (offset < -totalFiltered / 2) offset += totalFiltered
    
    const angle = offset * angleSpacing
    const x = Math.sin(angle) * radiusX
    const z = Math.cos(angle) * radiusY - radiusY
    const scale = 0.75 + (0.25 * ((z + radiusY) / radiusY))
    const rotateY = -offset * (isMobile ? 8 : 12)
    const opacity = 0.3 + (0.7 * ((z + radiusY) / radiusY))
    const zIndex = Math.round((z + radiusY) * 10)
    
    return { x, z, scale, rotateY, opacity, zIndex, isActive: offset === 0 }
  }

  const handleNext = useCallback(() => {
    if (filteredPosts.length <= 2) return
    setActiveIndex((prev) => (prev + 1) % filteredPosts.length)
  }, [filteredPosts.length])

  const handlePrev = useCallback(() => {
    if (filteredPosts.length <= 2) return
    setActiveIndex((prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length)
  }, [filteredPosts.length])

  useEffect(() => {
    if (!isAutoPlaying || searchQuery || selectedCategory !== "All" || filteredPosts.length <= 2) return
    const timer = setInterval(handleNext, AUTO_PLAY_DURATION)
    return () => clearInterval(timer)
  }, [isAutoPlaying, handleNext, searchQuery, selectedCategory, filteredPosts.length])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPost) {
        if (e.key === 'Escape') {
          setSelectedPost(null)
          // Return to blog section
          setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
        return
      }
      if (filteredPosts.length > 2) {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, selectedPost, filteredPosts.length])

  // Reading progress and time left for modal
  useEffect(() => {
    if (!selectedPost) {
      setReadingProgress(0)
      return
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [selectedPost])

  const toggleSave = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleClap = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setClaps(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }))
  }

  const sharePost = async (post: BlogPostFromDB, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard')
    }
  }

  const getRelatedPosts = (currentPost: BlogPostFromDB) => {
    return blogPosts
      .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
      .slice(0, 2)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  // Click any card to bring to center and open
  const handleCardClick = (post: BlogPostFromDB, isActive: boolean, index: number) => {
    if (isActive) {
      setSelectedPost(post)
    } else {
      setActiveIndex(index)
      setTimeout(() => setSelectedPost(post), 400)
    }
  }

  // Close modal and return to blog section
  const handleCloseModal = () => {
    setSelectedPost(null)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Function to get key insights
  const getKeyInsights = (post: BlogPostFromDB): string[] => {
    if (post.insights && post.insights.length > 0) {
      return post.insights;
    }
    
    const plainText = post.content.replace(/<[^>]*>/g, '');
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 40 && s.trim().length < 200);
    
    if (sentences.length >= 3) {
      return sentences.slice(0, 3).map(s => s.trim());
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
    };
    
    return fallbackInsights[post.category] || [
      `Understanding the philosophy behind ${post.category.toLowerCase()}`,
      "Practical applications for your own spaces",
      "Expert perspectives from industry leaders"
    ];
  };

  const currentPost = filteredPosts[activeIndex]
  const isSaved = currentPost ? savedPosts.includes(currentPost.id) : false
  const currentClaps = currentPost ? claps[currentPost.id] || 0 : 0

  // Calculate visible count for progress bars
  const getVisibleCount = () => {
    if (config.isDesktop) return 7
    if (config.isTablet) return 5
    return 3
  }

  if (loading) {
    return (
      <section ref={sectionRef} id="journal" className="relative w-full bg-background overflow-hidden flex items-center justify-center" style={{ height: `calc(100svh - ${NAVBAR_HEIGHT}px)` }}>
        <div className="text-foreground/40 animate-pulse">Loading stories...</div>
      </section>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <section ref={sectionRef} id="journal" className="relative w-full bg-background overflow-hidden flex items-center justify-center" style={{ height: `calc(100svh - ${NAVBAR_HEIGHT}px)` }}>
        <div className="text-center">
          <p className="text-foreground/60">No blog posts yet.</p>
          <p className="text-foreground/40 text-sm mt-2">Check back soon for inspiring stories.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Reading Progress Bar for Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-[2px] bg-foreground z-[60]"
            style={{ width: `${readingProgress}%` }}
          />
        )}
      </AnimatePresence>

      <section 
        ref={sectionRef} 
        id="journal" 
        className="relative w-full bg-background overflow-hidden flex flex-col items-center justify-center"
        style={{ 
          minHeight: `calc(100svh - ${NAVBAR_HEIGHT}px)`,
          height: `calc(100svh - ${NAVBAR_HEIGHT}px)`
        }}
      >
        {/* Cinematic Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-foreground/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-foreground/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center px-4 sm:px-6 lg:px-8 h-full justify-center">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-4 md:mb-6 flex-shrink-0"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-foreground tracking-tight">
              The <span className="text-foreground/40 font-light">Journal</span>
            </h2>
            <div className="h-px w-12 bg-foreground/20 mx-auto mt-3" />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 w-full max-w-md px-4 flex-shrink-0"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/20 py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
              />
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap justify-center gap-2 px-4 max-w-4xl overflow-x-auto scrollbar-hide flex-shrink-0"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setActiveIndex(0)
                }}
                className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* 3D Carousel Viewport */}
          <div 
            ref={containerRef}
            className="relative w-full flex items-center justify-center flex-1 min-h-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ 
              perspective: '1400px',
              paddingLeft: `${config.horizontalPadding}px`,
              paddingRight: `${config.horizontalPadding}px`,
            }}
          >
            {filteredPosts.length > 0 ? filteredPosts.map((post, index) => {
              const style = getFilteredCardStyle(index, filteredPosts.length, activeIndex)
              const postClaps = claps[post.id] || 0
              const isPostSaved = savedPosts.includes(post.id)
              const author = authors[post.author]
              
              return (
                <motion.article
                  key={post.id}
                  onClick={() => handleCardClick(post, style.isActive, index)}
                  className="absolute cursor-pointer group select-none"
                  style={{
                    width: config.cardWidth,
                    height: config.cardHeight,
                    zIndex: style.zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    x: style.x,
                    z: style.z,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    opacity: style.opacity,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  {/* ORIGINAL CARD STYLE PRESERVED - bg-neutral-900, rounded-sm, shadow */}
                  <div className="relative w-full h-full bg-neutral-900 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <motion.div 
                      className="absolute inset-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={post.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
                        draggable={false}
                      />
                      {/* ORIGINAL GRADIENT STYLE */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${post.gradient} from-black/80 via-black/20 to-transparent`} />
                    </motion.div>

                    {/* Save Button */}
                    {style.isActive && (
                      <button
                        onClick={(e) => toggleSave(post.id, e)}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
                      >
                        <svg 
                          className={`w-4 h-4 transition-colors ${isPostSaved ? 'text-red-400 fill-current' : 'text-white/70'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}

                    {/* ORIGINAL TEXT STYLING */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white pb-10">
                      <motion.div
                        animate={{ y: style.isActive ? 0 : 20 }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] tracking-[0.3em] uppercase text-white/50 font-medium">
                            {post.category}
                          </span>
                          {style.isActive && (
                            <span className="text-[9px] text-white/40 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg md:text-2xl font-serif italic mb-3 leading-tight [text-wrap:balance]">
                          {post.title}
                        </h3>
                        
                        <p className="text-[11px] text-white/70 line-clamp-2 font-light leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-[9px] tracking-widest uppercase text-white/40">{post.read_time || '5 min read'}</span>
                          <div className="flex items-center gap-3">
                            {style.isActive && postClaps > 0 && (
                              <span className="text-[9px] text-white/60 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {postClaps}
                              </span>
                            )}
                            <span className="text-[9px] tracking-widest uppercase text-white/40 group-hover:text-white transition-colors flex items-center gap-2">
                              {style.isActive ? 'Read Story' : 'View'} <span className="text-sm">→</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* ORIGINAL AUTHOR INFO POSITION */}
                  {style.isActive && filteredPosts.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-0 right-0 text-center"
                    >
                      <p className="text-foreground font-serif italic text-sm">{post.author}</p>
                      <p className="text-foreground/40 text-[10px] uppercase tracking-widest mt-1">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </p>
                    </motion.div>
                  )}
                </motion.article>
              )
            }) : (
              <div className="text-center text-foreground/40 text-sm font-light">
                No stories found matching your criteria
              </div>
            )}
          </div>

          {/* Swipe hint for mobile */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-foreground/30 uppercase tracking-widest mt-2 md:hidden flex-shrink-0"
          >
            Swipe to navigate
          </motion.p>

          {/* Integrated Navigation Footer - Compact */}
          <div className="mt-4 md:mt-6 flex flex-col items-center gap-4 md:gap-6 flex-shrink-0 pb-4">
            <div className="flex items-center gap-6 md:gap-10">
              <button 
                onClick={handlePrev} 
                disabled={filteredPosts.length <= 2}
                className={`group p-2 ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* PROGRESS BAR NAVIGATION - Limited to visible count */}
              <div className="flex gap-4 items-center">
                {(() => {
                  const visibleCount = getVisibleCount()
                  const halfVisible = Math.floor(visibleCount / 2)
                  
                  // Generate array of visible indices centered around active
                  const visibleIndices = []
                  for (let i = -halfVisible; i <= halfVisible; i++) {
                    let idx = activeIndex + i
                    // Handle wrapping
                    if (idx < 0) idx += filteredPosts.length
                    if (idx >= filteredPosts.length) idx -= filteredPosts.length
                    visibleIndices.push(idx)
                  }
                  
                  return visibleIndices.map((index) => {
                    const isActive = index === activeIndex;
                    return (
                      <div 
                        key={index}
                        onClick={() => filteredPosts.length > 2 && setActiveIndex(index)}
                        className={`relative h-[2px] overflow-hidden bg-foreground/10 transition-all duration-500 ${filteredPosts.length > 2 ? 'cursor-pointer' : ''}`}
                        style={{ width: isActive ? '60px' : '6px' }}
                      >
                        {isActive && filteredPosts.length > 2 && (
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                            transition={{ 
                              duration: isAutoPlaying ? AUTO_PLAY_DURATION / 1000 : 0, 
                              ease: "linear" 
                            }}
                            key={activeIndex}
                            className="absolute inset-0 bg-foreground"
                          />
                        )}
                        {isActive && filteredPosts.length <= 2 && (
                          <div className="absolute inset-0 bg-foreground" />
                        )}
                      </div>
                    );
                  })
                })()}
              </div>

              <button 
                onClick={handleNext} 
                disabled={filteredPosts.length <= 2}
                className={`group p-2 ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link href="/blog" className="group flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 group-hover:text-foreground transition-all font-bold">
                View All Stories
              </span>
              <motion.div className="h-px bg-foreground/20 w-16 group-hover:w-24 transition-all duration-500" />
            </Link>
          </div>

        </div>

        {/* Modal Overlay - FULL SECTION */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-background"
            >
              {/* FIXED: Floating Action Bar with margin-top to avoid navbar overlap */}
              <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="fixed left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-2 py-2 bg-background/80 backdrop-blur-xl rounded-full border border-foreground/10 shadow-2xl"
                style={{ top: `${NAVBAR_HEIGHT + 16}px` }} // 16px gap below navbar
              >
                {/* Back Button */}
                <button 
                  onClick={handleCloseModal}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all active:scale-95 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>

                <div className="w-px h-6 bg-foreground/10" />

                {/* Modern Audio Player Button */}
                <button
                  onClick={speak}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
                    isSpeaking 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      {/* Animated sound waves */}
                      <div className="flex items-center gap-0.5">
                        <motion.span 
                          animate={{ height: [4, 12, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="w-0.5 bg-current rounded-full"
                          style={{ height: 4 }}
                        />
                        <motion.span 
                          animate={{ height: [4, 16, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                          className="w-0.5 bg-current rounded-full"
                          style={{ height: 4 }}
                        />
                        <motion.span 
                          animate={{ height: [4, 10, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                          className="w-0.5 bg-current rounded-full"
                          style={{ height: 4 }}
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Listening</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <span className="text-[10px] uppercase tracking-wider font-medium">Listen</span>
                    </>
                  )}
                </button>

                <div className="w-px h-6 bg-foreground/10" />

                {/* Share & Save */}
                <button 
                  onClick={() => toggleSave(selectedPost.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 ${
                    savedPosts.includes(selectedPost.id) 
                      ? 'bg-red-500/10 text-red-500' 
                      : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <svg 
                    className={`w-4 h-4 ${savedPosts.includes(selectedPost.id) ? 'fill-current' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <button 
                  onClick={() => sharePost(selectedPost)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </motion.div>

              {/* Hero Section - Adjusted margin-top to account for floating bar */}
              <div className="relative h-[60vh] md:h-[70vh] w-full mt-24">
                <img 
                  src={selectedPost.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
                  <div className="max-w-4xl mx-auto">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60 mb-4 block">
                      {selectedPost.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif italic text-foreground mb-4 leading-tight">
                      {selectedPost.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] uppercase tracking-widest text-foreground/50">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {actualReadTime || selectedPost.read_time || '5 min read'}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {selectedPost.views} reads
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {selectedPost.published_at ? new Date(selectedPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-12 md:space-y-16"
                >
                  {/* Quote Section */}
                  <div className="border-l-2 border-foreground/20 pl-6 md:pl-8 py-4">
                    <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-foreground/80 leading-relaxed">
                      "{selectedPost.excerpt}"
                    </p>
                  </div>

                  {/* Main Content - Render HTML properly */}
                  <div className="text-base md:text-lg text-foreground/70 leading-relaxed font-light">
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                      className="prose prose-invert max-w-none [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:italic [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:italic [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-foreground/70 [&_a]:underline [&_a]:hover:text-foreground [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
                    />
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-foreground/[0.02] border border-foreground/10 p-6 md:p-8 rounded-lg">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">Key Insights</h4>
                    <ul className="space-y-4">
                      {getKeyInsights(selectedPost).map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-foreground/70 font-light">
                          <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full mt-2.5 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clap Section */}
                  <div className="text-center py-12 border-y border-foreground/10">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
                      Did this resonate with you?
                    </p>
                    <motion.button 
                      onClick={() => handleClap(selectedPost.id)}
                      whileTap={{ scale: 1.1 }}
                      className="group inline-flex flex-col items-center gap-3"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-foreground/20 flex items-center justify-center group-hover:border-foreground/40 group-hover:bg-foreground/5 transition-all">
                        <svg className="w-10 h-10 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-3xl font-serif italic text-foreground">{claps[selectedPost.id] || 0}</span>
                      <span className="text-[10px] uppercase tracking-widest text-foreground/40">Appreciations</span>
                    </motion.button>
                  </div>

                  {/* Author Section */}
                  {authors[selectedPost.author] && (
                    <div className="flex items-start gap-4 md:gap-6 py-8">
                      <img 
                        src={authors[selectedPost.author].avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'} 
                        alt={selectedPost.author}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale"
                      />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-1">Written by</p>
                        <h4 className="text-lg md:text-xl font-serif italic text-foreground mb-1">{selectedPost.author}</h4>
                        <p className="text-sm text-foreground/60 mb-3">{authors[selectedPost.author]?.role}</p>
                        <p className="text-sm text-foreground/50 font-light leading-relaxed">
                          {authors[selectedPost.author]?.bio}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Related Posts */}
                  {getRelatedPosts(selectedPost).length > 0 && (
                    <div className="pt-8">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-8">Continue Reading</p>
                      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {getRelatedPosts(selectedPost).map(related => (
                          <button
                            key={related.id}
                            onClick={() => {
                              setSelectedPost(related)
                              window.scrollTo(0, 0)
                            }}
                            className="group text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                              <img src={related.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'} alt={related.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-foreground/40">{related.category}</span>
                            <h4 className="font-serif italic text-lg md:text-xl mt-2 group-hover:text-foreground/70 transition-colors">{related.title}</h4>
                            <p className="text-sm text-foreground/50 mt-2 line-clamp-2 font-light">{related.excerpt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Newsletter Signup */}
                <div className="mt-16 md:mt-20 mb-12 p-8 md:p-12 bg-foreground/[0.02] border border-foreground/10 text-center rounded-lg">
                  <h3 className="text-2xl md:text-3xl font-serif italic mb-4 text-foreground">Join The Inner Circle</h3>
                  <p className="text-foreground/60 mb-8 font-light max-w-md mx-auto text-sm md:text-base">
                    Weekly insights on luxury design, delivered with intention. No spam, only inspiration.
                  </p>
                  {subscribed ? (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-foreground font-serif italic text-lg"
                    >
                      Welcome to the circle. Check your inbox.
                    </motion.p>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <input 
                        type="email" 
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground text-center sm:text-left"
                      />
                      <button 
                        type="submit"
                        className="px-8 py-3 border border-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all rounded-sm"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>

                {/* Bottom Back Button - Returns to blog section */}
                <div className="text-center pb-12 md:pb-16">
                  <button 
                    onClick={handleCloseModal}
                    className="inline-flex items-center gap-3 text-foreground/50 hover:text-foreground transition-all group px-6 py-3 rounded-full border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Back to Journal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}