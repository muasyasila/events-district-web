'use client'

import { getPostBySlug, getAuthors, getRelatedPosts } from '@/app/actions/blog'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, Eye, BookOpen, Twitter, Facebook, Linkedin, Link2, 
  Check, Bookmark, X, Heart, Share2, Printer, Clock, Award, Zap, 
  MessageCircle, Mail, TrendingUp, Quote, ChevronRight, ThumbsUp,
  Sparkles, Compass, Star, Users, Coffee, PenTool, Camera, Music,
  ChevronUp, Download, FileText, Copy, Send, Bell, ExternalLink,
  Moon, Sun, Volume2, VolumeX, Grid, List, Search
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
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

// Reading Progress Bar with Percentage
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 z-50 origin-left"
        style={{ scaleX: progress / 100 }}
      />
      <motion.div
        className="fixed bottom-6 left-6 z-50 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-mono text-white/70 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {Math.round(progress)}% read
      </motion.div>
    </>
  )
}

// Floating Share Bar
function FloatingShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="flex flex-col gap-4 bg-black/40 backdrop-blur-md rounded-full p-3 border border-white/10">
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} className="text-white/60 group-hover:text-white" />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} className="text-white/60 group-hover:text-white" />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} className="text-white/60 group-hover:text-white" />
        </button>
        <button
          onClick={() => handleShare('email')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group"
          aria-label="Share via Email"
        >
          <Mail size={18} className="text-white/60 group-hover:text-white" />
        </button>
        <div className="w-6 h-px bg-white/20 mx-auto" />
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          aria-label="Copy link"
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Link2 size={18} className="text-white/60 group-hover:text-white" />}
        </button>
      </div>
    </motion.div>
  )
}

// Table of Contents with Animation
function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    const headingElements = tempDiv.querySelectorAll('h2, h3')
    
    const extractedHeadings = Array.from(headingElements).map((el, index) => ({
      id: `heading-${index}`,
      text: el.textContent || '',
      level: parseInt(el.tagName[1])
    }))
    
    setHeadings(extractedHeadings)
    
    setTimeout(() => {
      const articleHeadings = document.querySelectorAll('.blog-content h2, .blog-content h3')
      articleHeadings.forEach((el, index) => {
        el.id = `heading-${index}`
      })
    }, 100)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66% 0px', threshold: 0 }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-30 w-56">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3 text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors"
      >
        <span>Table of Contents</span>
        <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="border-l border-foreground/20 pl-4 space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide"
          >
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-xs transition-all hover:text-foreground ${
                  activeId === heading.id
                    ? 'text-foreground font-medium border-l-2 border-foreground -ml-[1px] pl-3'
                    : 'text-foreground/40'
                }`}
                style={{ paddingLeft: heading.level === 3 ? '12px' : '0' }}
              >
                {heading.text}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Share Buttons
function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer')
    setShowMore(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider text-foreground/40">Share</span>
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Twitter size={14} />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Facebook size={14} />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Linkedin size={14} />
        </button>
        <button
          onClick={() => setShowMore(!showMore)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Share2 size={14} />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Link2 size={14} />}
        </button>
      </div>

      {/* More Share Options Popup */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 p-3 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl z-50 w-48"
          >
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleShare('pinterest')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">Pinterest</span>
              </button>
              <button onClick={() => handleShare('reddit')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">Reddit</span>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('telegram')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">Telegram</span>
              </button>
              <button onClick={() => handleShare('email')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">Email</span>
              </button>
              <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-center">
                <span className="text-xs block">Copy</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Bookmark Button
function BookmarkButton({ postId }: { postId: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('blogSavedPosts')
    if (saved) {
      const savedPosts = JSON.parse(saved)
      setIsSaved(savedPosts.includes(postId))
    }
  }, [postId])

  const toggleSave = () => {
    const saved = localStorage.getItem('blogSavedPosts')
    let savedPosts = saved ? JSON.parse(saved) : []
    
    if (isSaved) {
      savedPosts = savedPosts.filter((id: string) => id !== postId)
    } else {
      savedPosts.push(postId)
    }
    
    localStorage.setItem('blogSavedPosts', JSON.stringify(savedPosts))
    setIsSaved(!isSaved)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 1500)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleSave}
        className={`p-2 rounded-full transition-colors ${
          isSaved 
            ? 'bg-amber-500/20 text-amber-400' 
            : 'bg-white/5 hover:bg-white/10 text-foreground/60'
        }`}
      >
        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap"
          >
            {isSaved ? 'Saved to your library' : 'Removed from library'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reaction Buttons (Like, Love, Insightful)
function ReactionButtons({ postId }: { postId: string }) {
  const [reactions, setReactions] = useState({ like: 0, love: 0, insightful: 0 })
  const [userReaction, setUserReaction] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`reactions-${postId}`)
    if (saved) {
      const data = JSON.parse(saved)
      setReactions(data.counts || { like: 0, love: 0, insightful: 0 })
      setUserReaction(data.userReaction || null)
    } else {
      // Random initial counts for demo
      setReactions({ like: Math.floor(Math.random() * 50) + 10, love: Math.floor(Math.random() * 30) + 5, insightful: Math.floor(Math.random() * 20) + 3 })
    }
  }, [postId])

  const handleReaction = (type: string) => {
    const newReactions = { ...reactions }
    if (userReaction === type) {
      newReactions[type as keyof typeof reactions] -= 1
      setUserReaction(null)
    } else {
      if (userReaction) {
        newReactions[userReaction as keyof typeof reactions] -= 1
      }
      newReactions[type as keyof typeof reactions] += 1
      setUserReaction(type)
    }
    setReactions(newReactions)
    localStorage.setItem(`reactions-${postId}`, JSON.stringify({ counts: newReactions, userReaction: type === userReaction ? null : type }))
  }

  return (
    <div className="flex items-center gap-4 py-6 border-y border-foreground/10 my-8">
      <span className="text-[10px] uppercase tracking-wider text-foreground/40">Enjoyed this?</span>
      <button
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
          userReaction === 'like' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10 text-foreground/60'
        }`}
      >
        <ThumbsUp size={14} />
        <span className="text-xs">{reactions.like}</span>
      </button>
      <button
        onClick={() => handleReaction('love')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
          userReaction === 'love' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 text-foreground/60'
        }`}
      >
        <Heart size={14} />
        <span className="text-xs">{reactions.love}</span>
      </button>
      <button
        onClick={() => handleReaction('insightful')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
          userReaction === 'insightful' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 hover:bg-white/10 text-foreground/60'
        }`}
      >
        <Zap size={14} />
        <span className="text-xs">{reactions.insightful}</span>
      </button>
    </div>
  )
}

// Estimated Reading Time with Progress
function EstimatedReadingTime({ content }: { content: string }) {
  const [estimatedTime, setEstimatedTime] = useState('')
  const [actualTime, setActualTime] = useState<string | null>(null)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const words = plainText.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    setEstimatedTime(`${minutes} min read`)

    startTime.current = Date.now()

    return () => {
      if (startTime.current) {
        const elapsed = Math.ceil((Date.now() - startTime.current) / 60000)
        if (elapsed > 0) {
          setActualTime(`${elapsed} min read`)
        }
      }
    }
  }, [content])

  return (
    <div className="inline-flex items-center gap-2 text-sm text-foreground/50">
      <Clock size={14} />
      <span>{actualTime ? `Read in ${actualTime}` : estimatedTime}</span>
    </div>
  )
}

// Author Spotlight
function AuthorSpotlight({ author, postDate }: { author: Author; postDate: string }) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="bg-gradient-to-r from-foreground/[0.03] to-transparent border border-foreground/10 rounded-lg p-6 my-8">
      <div className="flex items-start gap-5">
        <img
          src={author.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-1">Written by</p>
              <h4 className="text-xl font-serif italic text-foreground">{author.name}</h4>
              <p className="text-sm text-foreground/60">{author.role}</p>
            </div>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                isFollowing 
                  ? 'bg-foreground/10 text-foreground/60' 
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          <p className="text-sm text-foreground/50 font-light leading-relaxed mt-3">{author.bio}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-foreground/40">
            <span>Published: {postDate}</span>
            <span>•</span>
            <span>12 articles</span>
            <span>•</span>
            <span>2.3k followers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Newsletter Signup with Animation
function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="relative overflow-hidden mt-16 p-8 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent border border-foreground/10 rounded-lg text-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
      
      <Sparkles size={24} className="text-amber-400 mx-auto mb-4" />
      <h3 className="text-2xl font-serif italic mb-3 text-foreground">Join The Inner Circle</h3>
      <p className="text-foreground/60 mb-6 font-light max-w-md mx-auto text-sm">
        Get exclusive insights, early access to new collections, and design inspiration delivered weekly.
      </p>
      
      {subscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 text-green-400"
        >
          <Check size={16} />
          <span>Thanks for subscribing! Check your inbox.</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <div className="relative flex-1">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your email address"
              required
              className="w-full bg-transparent border-b border-foreground/20 py-2 px-2 text-sm focus:outline-none transition-all placeholder:text-foreground/40 text-foreground text-center sm:text-left"
            />
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: isFocused ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-2 bg-foreground text-background text-[10px] uppercase tracking-widest font-bold hover:bg-foreground/90 transition-all rounded-sm"
          >
            Subscribe
          </button>
        </form>
      )}
      
      <p className="text-[9px] text-foreground/30 mt-4">No spam. Unsubscribe anytime.</p>
    </div>
  )
}

// Back to Top with Progress Ring
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)
      setIsVisible(scrollTop > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all group cursor-pointer"
        >
          <svg className="absolute -inset-1 w-full h-full pointer-events-none" style={{ width: 'calc(100% + 8px)', height: 'calc(100% + 8px)' }}>
            <circle
              cx="50%"
              cy="50%"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="22"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)}
              strokeLinecap="round"
              style={{ rotate: "-90deg", transformOrigin: "center" }}
            />
          </svg>
          <ChevronUp size={20} className="text-white/70 group-hover:text-white transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Estimated Reading Time Component
function ReadingTimeComponent({ content }: { content: string }) {
  const getReadTime = (text: string): string => {
    const plainText = text.replace(/<[^>]*>/g, '')
    const words = plainText.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm text-foreground/50">
      <BookOpen size={14} />
      <span>{getReadTime(content)}</span>
    </div>
  )
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [authors, setAuthors] = useState<Author[]>([])
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [formattedDate, setFormattedDate] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params
      const fetchedPost = await getPostBySlug(slug)
      
      if (!fetchedPost) {
        setLoading(false)
        return
      }
      
      setPost(fetchedPost)
      
      const authorsData = await getAuthors()
      setAuthors(authorsData)
      
      const related = await getRelatedPosts(fetchedPost.id, fetchedPost.category)
      setRelatedPosts(related)
      
      if (fetchedPost.published_at) {
        setFormattedDate(new Date(fetchedPost.published_at).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }))
      } else {
        setFormattedDate('Just now')
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [params])

  const handlePrint = () => {
    window.print()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/40 animate-pulse">Loading...</div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">Post not found</p>
          <Link href="/" className="text-foreground/40 hover:text-foreground text-sm mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const author = authors.find((a: Author) => a.name === post.author)
  
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

  return (
    <main className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Floating Share Bar */}
      <FloatingShareBar title={post.title} url={`/blog/${post.slug}`} />

      {/* Table of Contents */}
      <TableOfContents content={post.content} />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] w-full">
        <img
          src={post.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <button onClick={handlePrint} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Printer size={14} />
                </button>
                <BookmarkButton postId={post.id} />
                <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">
                  {post.category}
                </span>
                <span className="text-foreground/30">•</span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-1">
                  <TrendingUp size={10} /> Trending
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-foreground">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </div>
                <ReadingTimeComponent content={post.content} />
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} />
                  <span>Featured</span>
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
          <Quote size={24} className="text-foreground/30 mb-4" />
          <p className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
            "{post.excerpt}"
          </p>
        </div>
        
        {/* Main Content */}
        <div className="text-lg text-foreground/70 leading-relaxed font-light blog-content">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose prose-invert max-w-none [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:italic [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:italic [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-foreground/70 [&_a]:underline [&_a]:hover:text-foreground [&_img]:rounded-lg [&_img]:my-8 [&_img]:mx-auto [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_hr]:my-12 [&_hr]:border-foreground/10"
          />
        </div>
        
        {/* Reaction Buttons */}
        <ReactionButtons postId={post.id} />
        
        {/* Key Insights */}
        <div className="bg-gradient-to-br from-foreground/[0.03] to-transparent border border-foreground/10 p-8 rounded-lg my-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-amber-400" />
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">Key Insights</h4>
          </div>
          <ul className="space-y-4">
            {insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 text-foreground/70 font-light">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Author Spotlight */}
        {author && (
          <AuthorSpotlight author={author} postDate={formattedDate} />
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-6 border-t border-foreground/10 mt-8">
            <span className="text-[10px] uppercase tracking-wider text-foreground/40 mr-2">Explore more:</span>
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs text-foreground/50 px-3 py-1 bg-foreground/5 rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Related Posts with Enhanced Styling */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 mt-12 border-t border-foreground/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">You Might Also Enjoy</h3>
              <Link href="/blog" className="text-xs text-foreground/40 hover:text-foreground flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((related: BlogPost) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    <img
                      src={related.featured_image_url || 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9'}
                      alt={related.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/40">{related.category}</span>
                  <h4 className="font-serif italic text-xl mt-2 group-hover:text-foreground/70 transition-colors">{related.title}</h4>
                  <p className="text-sm text-foreground/50 mt-2 line-clamp-2 font-light">{related.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-foreground/40">
                    <span>{related.read_time || '5 min read'}</span>
                    <span>•</span>
                    <span>{related.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Newsletter Signup */}
        <NewsletterSignup />
      </article>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Print Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md rounded-lg px-4 py-2 text-sm text-white border border-white/10"
          >
            Print dialog opened. Ready to print!
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}