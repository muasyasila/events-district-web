"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPostFromDB[]>([])
  const [authors, setAuthors] = useState<Record<string, Author>>({})
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [claps, setClaps] = useState<Record<string, number>>({})
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const AUTO_PLAY_DURATION = 5000
  const minSwipeDistance = 50
  // Dynamic navbar height state
  const [navbarHeight, setNavbarHeight] = useState(80) // Default fallback

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
  
  // Dynamic navbar height detection
  useEffect(() => {
    const updateNavbarHeight = () => {
      // Try to find navbar by common selectors
      const navbar = document.querySelector('header, nav, [class*="navbar"], [class*="Navbar"]')
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height)
      } else {
        // Fallback to 80px if no navbar found
        setNavbarHeight(80)
      }
    }
    
    // Initial update
    updateNavbarHeight()
    
    // Update on resize
    window.addEventListener('resize', updateNavbarHeight)
    
    // Also update after a short delay to ensure DOM is fully loaded
    setTimeout(updateNavbarHeight, 100)
    
    return () => window.removeEventListener('resize', updateNavbarHeight)
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
    
    // Card sizes - SMALLER for mobile devices
    const cardWidth = isMobile ? 200 : 300
    const cardHeight = isMobile ? 280 : 400
    
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
      if (filteredPosts.length > 2) {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, filteredPosts.length])

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  // Click any card to navigate to the blog post page
  const handleCardClick = (post: BlogPostFromDB, isActive: boolean, index: number) => {
    if (!isActive) {
      // If card is not active, bring it to center first
      setActiveIndex(index)
      setTimeout(() => {
        router.push(`/blog/${post.slug}`)
      }, 400)
    } else {
      // If card is already active, navigate directly
      router.push(`/blog/${post.slug}`)
    }
  }

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
      <section ref={sectionRef} id="journal" className="relative w-full bg-background overflow-hidden flex items-center justify-center" style={{ height: `calc(100svh - ${navbarHeight}px)` }}>
        <div className="text-foreground/40 animate-pulse">Loading stories...</div>
      </section>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <section ref={sectionRef} id="journal" className="relative w-full bg-background overflow-hidden flex items-center justify-center" style={{ height: `calc(100svh - ${navbarHeight}px)` }}>
        <div className="text-center">
          <p className="text-foreground/60">No blog posts yet.</p>
          <p className="text-foreground/40 text-sm mt-2">Check back soon for inspiring stories.</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef} 
      id="journal" 
      className="relative w-full bg-background overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        minHeight: `calc(100svh - ${navbarHeight - 20}px)`,
        height: `calc(100svh - ${navbarHeight - 20}px)`,
        marginBottom: '2rem'
      }}
    >
      {/* Cinematic Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-foreground/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-foreground/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center px-4 sm:px-6 lg:px-8 h-full justify-center">
        
        {/* Header Section - Reduced top padding */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-2 md:mb-4 flex-shrink-0"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-foreground tracking-tight">
            The <span className="text-foreground/40 font-light">Journal</span>
          </h2>
          <div className="h-px w-12 bg-foreground/20 mx-auto mt-2 md:mt-3" />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 w-full max-w-md px-4 flex-shrink-0"
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

        {/* Category Filter Tabs - SMALLER on mobile to fit 2 lines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex flex-wrap justify-center gap-1.5 md:gap-2 px-4 max-w-4xl overflow-x-auto scrollbar-hide flex-shrink-0"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setActiveIndex(0)
              }}
              className={`text-[8px] md:text-[10px] uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 border transition-all duration-300 whitespace-nowrap ${
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
                {/* CARD STYLE with thin black outline */}
                <div className="relative w-full h-full bg-neutral-900 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-black/20">
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
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white pb-8 md:pb-10">
                    <motion.div
                      animate={{ y: style.isActive ? 0 : 20 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-white/50 font-medium">
                          {post.category}
                        </span>
                        {style.isActive && (
                          <span className="text-[8px] md:text-[9px] text-white/40 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.views}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-base md:text-2xl font-serif italic mb-2 md:mb-3 leading-tight [text-wrap:balance] line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-[9px] md:text-[11px] text-white/70 line-clamp-2 font-light leading-relaxed mb-3 md:mb-4">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10">
                        <span className="text-[7px] md:text-[9px] tracking-widest uppercase text-white/40">{post.read_time || '5 min read'}</span>
                        <div className="flex items-center gap-3">
                          {style.isActive && postClaps > 0 && (
                            <span className="text-[7px] md:text-[9px] text-white/60 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {postClaps}
                            </span>
                          )}
                          <span className="text-[7px] md:text-[9px] tracking-widest uppercase text-white/40 group-hover:text-white transition-colors flex items-center gap-2">
                            {style.isActive ? 'Read Story' : 'View'} <span className="text-sm">→</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* AUTHOR INFO - Repositioned for mobile to not interfere with progress bar */}
                {style.isActive && filteredPosts.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-12 md:-bottom-16 left-0 right-0 text-center"
                  >
                    <p className="text-foreground font-serif italic text-xs md:text-sm">{post.author}</p>
                    <p className="text-foreground/40 text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5 md:mt-1">
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

        {/* Integrated Navigation Footer - with progress bar restored */}
        <div className="mt-6 md:mt-8 flex flex-col items-center gap-4 md:gap-6 flex-shrink-0 pb-4">
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

            {/* PROGRESS BAR NAVIGATION - RESTORED */}
            <div className="flex gap-3 md:gap-4 items-center">
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
                      style={{ width: isActive ? '40px md:60px' : '4px md:6px' }}
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
    </section>
  )
}