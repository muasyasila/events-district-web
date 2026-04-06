"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Heart,
  Camera,
  Grid3x3,
  LayoutGrid,
  Images,
  Star
} from 'lucide-react'
import Link from 'next/link'

// Portfolio data structure
interface PortfolioItem {
  id: number
  title: string
  category: 'wedding' | 'corporate' | 'social' | 'culinary'
  subcategory: string
  clientName: string
  eventDate: string
  location: string
  guestCount: number
  description: string
  images: string[]
  beforeImage?: string
  afterImage?: string
  featured?: boolean
  tags: string[]
}

// Sample portfolio data - Replace with your actual data from database
const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "Romantic Garden Wedding",
    category: "wedding",
    subcategory: "Outdoor Wedding",
    clientName: "Sarah & Michael",
    eventDate: "March 15, 2025",
    location: "Nairobi, Kenya",
    guestCount: 180,
    description: "A breathtaking garden wedding with floral arches, cascading centerpieces, and warm ambient lighting. The couple wanted a romantic, ethereal feel with soft pinks and whites.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop",
    ],
    beforeImage: "https://images.unsplash.com/photo-1582719471381-5c85e5d6d4e2?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    featured: true,
    tags: ["Romantic", "Floral", "Garden", "Elegant"]
  },
  {
    id: 2,
    title: "Corporate Gala Dinner",
    category: "corporate",
    subcategory: "Corporate Event",
    clientName: "Tech Innovation Summit",
    eventDate: "February 10, 2025",
    location: "Nairobi, Kenya",
    guestCount: 350,
    description: "A sophisticated black-tie gala with dramatic lighting, luxury table settings, and a stunning red carpet entrance.",
    images: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=600&fit=crop",
    ],
    tags: ["Corporate", "Elegant", "Lighting", "Red Carpet"]
  },
  {
    id: 3,
    title: "Luxury Birthday Celebration",
    category: "social",
    subcategory: "Birthday",
    clientName: "Amanda's 30th Birthday",
    eventDate: "January 20, 2025",
    location: "Nairobi, Kenya",
    guestCount: 120,
    description: "A glamorous 30th birthday celebration with rose gold accents, balloon installations, and a stunning dessert table.",
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=600&fit=crop",
    ],
    tags: ["Birthday", "Glamorous", "Balloons", "Dessert Table"]
  },
  {
    id: 4,
    title: "Traditional Wedding Ceremony",
    category: "wedding",
    subcategory: "Traditional Wedding",
    clientName: "James & Grace",
    eventDate: "December 5, 2024",
    location: "Nairobi, Kenya",
    guestCount: 250,
    description: "A beautiful traditional wedding blending cultural elements with modern elegance. Rich colors, ceremonial arches, and vibrant floral arrangements.",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    ],
    tags: ["Traditional", "Cultural", "Vibrant", "Ceremony"]
  },
  {
    id: 5,
    title: "Product Launch Experience",
    category: "corporate",
    subcategory: "Product Launch",
    clientName: "Luxury Beauty Brand",
    eventDate: "November 18, 2024",
    location: "Nairobi, Kenya",
    guestCount: 200,
    description: "An immersive product launch with branded installations, interactive displays, and Instagram-worthy photo moments.",
    images: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
    ],
    tags: ["Product Launch", "Branded", "Interactive", "Modern"]
  },
  {
    id: 6,
    title: "Baby Shower Celebration",
    category: "social",
    subcategory: "Baby Shower",
    clientName: "Emily & David",
    eventDate: "October 12, 2024",
    location: "Nairobi, Kenya",
    guestCount: 60,
    description: "A whimsical baby shower with gender reveal elements, pastel decor, and a stunning dessert table.",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=600&fit=crop",
    ],
    tags: ["Baby Shower", "Whimsical", "Pastel", "Dessert Table"]
  }
]

const categoryConfig = {
  all: { label: "All Work", icon: Grid3x3, color: "from-foreground/20" },
  wedding: { label: "Weddings", icon: Heart, color: "from-rose-500/20" },
  corporate: { label: "Corporate", icon: LayoutGrid, color: "from-blue-500/20" },
  social: { label: "Social", icon: Users, color: "from-purple-500/20" },
  culinary: { label: "Culinary", icon: Camera, color: "from-amber-500/20" }
}

export default function PortfolioClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [beforeAfterValue, setBeforeAfterValue] = useState(50)

  const filteredItems = portfolioData.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  )

  const featuredItems = portfolioData.filter(item => item.featured)

  const openLightbox = (item: PortfolioItem, index: number) => {
    setSelectedItem(item)
    setCurrentImageIndex(index)
    setShowBeforeAfter(false)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
    setCurrentImageIndex(0)
    setShowBeforeAfter(false)
    setBeforeAfterValue(50)
  }

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length)
    }
  }

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'Escape') closeLightbox()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Images className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Our Work
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-foreground mb-4">
            Design Gallery
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto font-light">
            Explore our collection of stunning event transformations. Each space tells a unique story.
          </p>
          <div className="h-px w-12 bg-foreground/20 mx-auto mt-8" />
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/10 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              const isActive = selectedCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground'
                  }`}
                >
                  <Icon size={14} />
                  <span>{config.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {selectedCategory === "all" && featuredItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif italic text-foreground mb-2">
              Featured Work
            </h2>
            <div className="h-px w-12 bg-foreground/20 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(item, 0)}
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart size={14} />
                      <span>{item.clientName}</span>
                    </div>
                  </div>
                  {item.beforeImage && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white">
                      Before & After
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-serif italic text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-foreground/50">{item.subcategory}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(item, 0)}
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-white/70">{item.subcategory}</p>
                </div>
                {item.beforeImage && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[8px] text-white">
                    Before & After
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-foreground/40">{item.clientName}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground/40">
                  <Calendar size={10} />
                  <span>{new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full max-w-6xl mx-auto p-4" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X size={24} />
              </button>

              {/* Before/After Toggle */}
              {selectedItem.beforeImage && selectedItem.afterImage && (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <button
                    onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      showBeforeAfter
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {showBeforeAfter ? 'Hide Comparison' : 'View Before & After'}
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {selectedItem.images.length > 1 && !showBeforeAfter && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Image Display */}
              <div className="flex items-center justify-center min-h-[80vh]">
                {showBeforeAfter && selectedItem.beforeImage && selectedItem.afterImage ? (
                  <div className="relative w-full max-w-4xl">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img
                        src={selectedItem.afterImage}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${beforeAfterValue}%` }}
                      >
                        <img
                          src={selectedItem.beforeImage}
                          alt="Before"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                        style={{ left: `${beforeAfterValue}%` }}
                        onMouseDown={(e) => {
                          const onMouseMove = (moveEvent: MouseEvent) => {
                            const rect = (moveEvent.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()
                            if (rect) {
                              const newValue = ((moveEvent.clientX - rect.left) / rect.width) * 100
                              setBeforeAfterValue(Math.min(100, Math.max(0, newValue)))
                            }
                          }
                          const onMouseUp = () => {
                            document.removeEventListener('mousemove', onMouseMove)
                            document.removeEventListener('mouseup', onMouseUp)
                          }
                          document.addEventListener('mousemove', onMouseMove)
                          document.addEventListener('mouseup', onMouseUp)
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-white/60">
                      <span>Before</span>
                      <span>After</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedItem.images[currentImageIndex]}
                    alt={selectedItem.title}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Image Info */}
              {!showBeforeAfter && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-serif italic text-white mb-2">{selectedItem.title}</h2>
                    <p className="text-white/80 text-sm mb-3">{selectedItem.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{selectedItem.clientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{selectedItem.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{selectedItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{selectedItem.guestCount} guests</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedItem.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-[9px] text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Counter */}
              {selectedItem.images.length > 1 && !showBeforeAfter && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-xs text-white/70">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="bg-background border border-foreground/10 rounded-xl p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-foreground/60" />
            <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Ready to Create Something Beautiful?
            </span>
          </div>
          
          <h2 className="text-2xl font-serif italic text-foreground mb-3">
            Let's Design Your Event
          </h2>
          
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">
            Whether you're planning an intimate gathering or a grand celebration, we're here to bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
            >
              Get a Quote
              <ArrowRight size={12} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-bold hover:border-foreground/40 transition-colors rounded-full"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}