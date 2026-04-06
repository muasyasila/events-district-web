"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Minus, ChevronDown, ChevronUp, Crown, 
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles, 
  Package, GraduationCap, Home, Trees, Armchair, Utensils, 
  Flower2, Sparkle, Star, Cake, PartyPopper, Balloon, 
  Camera, Music, Gift, Wine, Coffee, CheckCircle, 
  Trophy, BookOpen, Award, Globe, Mic, PenTool, Lamp,
  Video
} from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

// Types
type VenueType = 'indoor' | 'outdoor'
type TierType = 'essential' | 'signature' | 'luxury'

// Graduation Categories
const gradCategories = [
  { id: 'ceremony', name: 'Ceremony Setup', icon: GraduationCap },
  { id: 'decor', name: 'Graduation Decor', icon: Flower2 },
  { id: 'lighting', name: 'Lighting & Atmosphere', icon: Lamp },
  { id: 'signage', name: 'Celebration Signage', icon: PenTool },
  { id: 'photo', name: 'Photo Opportunities', icon: Camera },
  { id: 'refreshments', name: 'Refreshment Area', icon: Coffee }
]

// INDOOR Graduation Items
const indoorGradItems = {
  essential: {
    ceremony: [
      { name: 'Basic Stage Setup', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple stage for photos and speeches' },
      { name: 'Graduate Seating Area', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Designated seating for the graduate' }
    ],
    decor: [
      { name: 'School Color Balloons', cost: 4000, baseQuantity: 50, scalingRule: 'per_person', description: 'Balloons in school colors' },
      { name: 'Graduation Banner', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: '"Congratulations" banner' },
      { name: 'Table Centerpieces', cost: 3000, baseQuantity: 8, scalingRule: 'per_table', description: 'Simple graduation-themed centerpieces' }
    ],
    lighting: [
      { name: 'Standard Room Lighting', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic ambient lighting' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom welcome sign with graduate name' }
    ],
    photo: [
      { name: 'Photo Backdrop', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple graduation-themed photo backdrop' }
    ],
    refreshments: [
      { name: 'Basic Snack Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple table for refreshments' }
    ]
  },
  signature: {
    ceremony: [
      { name: 'Premium Stage Design', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated stage with draping and florals' },
      { name: 'VIP Seating Area', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Special seating for graduate and family' },
      { name: 'Aisle Styling', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Decorated aisle for graduate entrance' }
    ],
    decor: [
      { name: 'School Color Balloon Arch', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Stunning balloon arch in school colors' },
      { name: 'Graduation Cap Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'DIY graduation cap centerpieces' },
      { name: 'Diploma Display', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Special display for diploma' },
      { name: 'Memory Wall', cost: 7000, baseQuantity: 1, scalingRule: 'fixed', description: 'Wall for photos and memories' }
    ],
    lighting: [
      { name: 'LED Uplighting', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Color-changing uplights in school colors' },
      { name: 'Fairy Light Curtain', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Twinkling light backdrop' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 6000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign with name/degree' },
      { name: 'Year Banner', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom banner with graduation year' },
      { name: 'Directional Signs', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Wayfinding signs for guests' }
    ],
    photo: [
      { name: 'Premium Photo Backdrop', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom graduation photo backdrop' },
      { name: 'Photo Props Station', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Graduation-themed photo props' },
      { name: 'Selfie Mirror', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive selfie mirror' }
    ],
    refreshments: [
      { name: 'Styled Refreshment Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Decorated food and drink station' },
      { name: 'Cake Display', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Special display for graduation cake' }
    ]
  },
  luxury: {
    ceremony: [
      { name: 'Grand Stage Design', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete stage transformation with florals and lighting' },
      { name: 'Red Carpet Entrance', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Red carpet for graduate entrance' },
      { name: 'VIP Lounge Area', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury seating for family and VIPs' },
      { name: 'Live Streaming Setup', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Professional camera and streaming setup' }
    ],
    decor: [
      { name: 'Giant Balloon Installation', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Massive balloon display in school colors' },
      { name: 'Fresh Flower Arrangements', cost: 20000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium floral centerpieces' },
      { name: 'Graduation Cap Wall', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Wall decorated with graduation caps' },
      { name: 'Achievement Timeline', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Visual timeline of academic journey' },
      { name: 'Balloon Drop', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Surprise balloon drop moment' }
    ],
    lighting: [
      { name: 'Custom Monogram Projection', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Light projection of graduate name/initials' },
      { name: 'Intelligent Lighting System', cost: 30000, baseQuantity: 1, scalingRule: 'fixed', description: 'Full programmable lighting experience' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED dance floor' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon sign with graduate name' },
      { name: 'Welcome Light Box', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign' },
      { name: 'Inspiration Quotes Wall', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Wall of inspirational graduation quotes' }
    ],
    photo: [
      { name: '360 Photo Booth', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive 360 video booth' },
      { name: 'Green Screen Photo', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Green screen with custom backgrounds' },
      { name: 'Professional Photographer', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: '2-hour professional photography' },
      { name: 'Instant Print Station', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Instant photo prints for guests' }
    ],
    refreshments: [
      { name: 'Premium Catering Setup', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Full catering display and setup' },
      { name: 'Champagne Toast Station', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Champagne toast for the graduate' },
      { name: 'Graduation Cake Display', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Spectacular graduation cake presentation' }
    ]
  }
}

// OUTDOOR Graduation Items
const outdoorGradItems = {
  essential: {
    ceremony: [
      { name: 'High Peak Tent (50 Seater)', cost: 6000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic tent for ceremony' },
      { name: 'Simple Stage', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Outdoor stage for speeches' }
    ],
    decor: [
      { name: 'School Color Balloons', cost: 4000, baseQuantity: 50, scalingRule: 'per_person', description: 'Balloons in school colors' },
      { name: 'Graduation Banner', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Outdoor-friendly banner' }
    ],
    lighting: [
      { name: 'String Lights', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic outdoor string lighting' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Weather-resistant welcome sign' }
    ],
    photo: [
      { name: 'Photo Backdrop', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Outdoor photo backdrop' }
    ],
    refreshments: [
      { name: 'Basic Refreshment Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Covered refreshment area' }
    ]
  },
  signature: {
    ceremony: [
      { name: 'Blines Tent (100 Seater)', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure' },
      { name: 'Premium Outdoor Stage', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated outdoor stage' },
      { name: 'Tent Draping', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant tent draping' }
    ],
    decor: [
      { name: 'School Color Balloon Arch', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Outdoor balloon arch' },
      { name: 'Graduation Cap Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'DIY graduation cap centerpieces' },
      { name: 'Memory Wall', cost: 7000, baseQuantity: 1, scalingRule: 'fixed', description: 'Outdoor memory display' }
    ],
    lighting: [
      { name: 'Fairy Light Canopy', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Magical light ceiling' },
      { name: 'LED Pathway Lights', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Lit pathway for entrance' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 6000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign' },
      { name: 'Year Banner', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom banner with graduation year' }
    ],
    photo: [
      { name: 'Premium Photo Backdrop', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom graduation photo backdrop' },
      { name: 'Photo Props Station', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Graduation-themed photo props' }
    ],
    refreshments: [
      { name: 'Styled Refreshment Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Decorated food and drink station' },
      { name: 'Cake Display', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Special display for graduation cake' }
    ]
  },
  luxury: {
    ceremony: [
      { name: 'A-Frame Luxury Tent', cost: 70000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure' },
      { name: 'Full Ceiling Draping', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete tent transformation' },
      { name: 'Red Carpet Walkway', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Red carpet entrance' },
      { name: 'VIP Lounge Area', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury outdoor lounge' }
    ],
    decor: [
      { name: 'Giant Balloon Installation', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Massive balloon display' },
      { name: 'Fresh Flower Arrangements', cost: 20000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium floral centerpieces' },
      { name: 'Graduation Cap Wall', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Wall decorated with graduation caps' },
      { name: 'Balloon Drop', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Surprise balloon drop moment' }
    ],
    lighting: [
      { name: 'Premium Lighting Package', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete outdoor lighting experience' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED dance floor' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon sign with graduate name' },
      { name: 'Welcome Light Box', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign' }
    ],
    photo: [
      { name: '360 Photo Booth', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive 360 video booth' },
      { name: 'Professional Photographer', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: '2-hour professional photography' }
    ],
    refreshments: [
      { name: 'Premium Catering Setup', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Full catering display and setup' },
      { name: 'Champagne Toast Station', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Champagne toast for the graduate' }
    ]
  }
}

// Tables
const tableOptions = {
  essential: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 8, scalingRule: 'per_table', description: 'Seats 8-10 guests' }
  ],
  signature: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 5, scalingRule: 'per_table', description: 'Seats 10-12 guests' }
  ],
  luxury: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 8, scalingRule: 'per_table', description: 'Seats 10-12 guests' },
    { name: 'VIP Sweetheart Table', cost: 800, baseQuantity: 1, scalingRule: 'fixed', description: 'Special table for graduate' }
  ]
}

// Add-ons
const addOns = [
  { id: 'balloon-arch', name: 'Graduation Balloon Arch', price: 15000, icon: Balloon, description: 'School color balloon arch', category: 'decor' },
  { id: 'photo-booth', name: 'Photo Booth Experience', price: 12000, icon: Camera, description: 'Backdrop + props + instant prints', category: 'photo' },
  { id: 'live-dj', name: 'Party DJ', price: 25000, icon: Music, description: 'Sound system + lighting + MC', category: 'entertainment' },
  { id: 'graduation-caps', name: 'Custom Graduation Caps', price: 8000, icon: GraduationCap, description: 'Personalized caps for graduate', category: 'premium' },
  { id: 'memory-video', name: 'Memory Video Montage', price: 15000, icon: Video, description: 'Slideshow of graduate photos', category: 'entertainment' },
  { id: 'party-favors', name: 'Graduation Favors', price: 7500, icon: Gift, description: 'Personalized favors for 25 guests', category: 'premium' },
  { id: 'neon-sign', name: 'Neon "Congrats" Sign', price: 18000, icon: Sparkle, description: 'Custom neon sign', category: 'signage' },
  { id: 'confetti-cannon', name: 'Confetti Cannons', price: 12000, icon: PartyPopper, description: '2 confetti cannons for grand moment', category: 'premium' }
]

// Scaling factors
const scalingFactors = [
  { pax: 50, multiplier: 0.8 },
  { pax: 100, multiplier: 1.0 },
  { pax: 150, multiplier: 1.4 },
  { pax: 200, multiplier: 1.7 },
  { pax: 250, multiplier: 2.0 },
  { pax: 300, multiplier: 2.3 },
  { pax: 400, multiplier: 2.8 },
  { pax: 500, multiplier: 3.2 }
]

// Helper functions
const getMultiplier = (pax: number) => {
  const factor = scalingFactors.find(f => f.pax === pax)
  return factor?.multiplier || 1.0
}

const getScaledQuantity = (pax: number, rule: string, baseQuantity: number) => {
  switch(rule) {
    case 'per_person':
      return Math.ceil((pax / 100) * baseQuantity)
    case 'per_table':
      const tablesNeeded = Math.ceil(pax / 8)
      return tablesNeeded
    default:
      return baseQuantity
  }
}

const getItemTotal = (item: any, pax: number, multiplier: number) => {
  const scaledQuantity = getScaledQuantity(pax, item.scalingRule, item.baseQuantity)
  const unitPrice = item.cost / item.baseQuantity
  const scaledUnitPrice = unitPrice * multiplier
  return Math.round(scaledUnitPrice * scaledQuantity)
}

export default function GraduationQuoteClient() {
  const [pax, setPax] = useState<number>(100)
  const [venue, setVenue] = useState<VenueType>('indoor')
  const [activeTiers, setActiveTiers] = useState<Set<TierType>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [showEmailQuote, setShowEmailQuote] = useState(false)
  const [emailQuoteAddress, setEmailQuoteAddress] = useState('')
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventDate: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const multiplier = getMultiplier(pax)
  const tiers: TierType[] = ['essential', 'signature', 'luxury']

  const getTierDisplayName = (tier: TierType) => {
    switch(tier) {
      case 'essential': return 'Essential'
      case 'signature': return 'Signature'
      case 'luxury': return 'Luxury'
      default: return tier
    }
  }

  const getTierDescription = (tier: TierType) => {
    switch(tier) {
      case 'essential': return 'Perfect for intimate graduation celebrations'
      case 'signature': return 'Our most popular graduation package'
      case 'luxury': return 'The ultimate graduation experience'
      default: return ''
    }
  }

  const getTierIcon = (tier: TierType) => {
    switch(tier) {
      case 'luxury': return <Crown size={16} className="inline-block ml-1" />
      case 'signature': return <Star size={14} className="inline-block ml-1" />
      default: return null
    }
  }

  const getTierItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorGradItems[tier] : outdoorGradItems[tier]
    const tables = tableOptions[tier]
    const allItems = Object.values(venueItems).flat()
    return [...allItems, ...tables]
  }

  const getGroupedItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorGradItems[tier] : outdoorGradItems[tier]
    const tables = tableOptions[tier]
    const grouped: Record<string, any[]> = {}
    
    gradCategories.forEach(cat => {
      const items = venueItems[cat.id as keyof typeof venueItems]
      if (items && items.length > 0) {
        grouped[cat.name] = items
      }
    })
    
    if (tables.length > 0) {
      grouped['Table Settings'] = tables
    }
    
    return grouped
  }

  const getTierTotal = (tier: TierType) => {
    const items = getTierItems(tier)
    return items.reduce((sum, item) => sum + getItemTotal(item, pax, multiplier), 0)
  }

  const getAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, id) => {
      const addon = addOns.find(a => a.id === id)
      return sum + (addon?.price || 0)
    }, 0)
  }

  const getGrandTotal = (tier: TierType) => {
    return getTierTotal(tier) + getAddOnsTotal()
  }

  const toggleTier = (tier: TierType) => {
    setActiveTiers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tier)) {
        newSet.delete(tier)
        const keysToRemove = Object.keys(expandedCategories).filter(key => key.startsWith(`${tier}-`))
        if (keysToRemove.length > 0) {
          const newExpanded = { ...expandedCategories }
          keysToRemove.forEach(key => delete newExpanded[key])
          setExpandedCategories(newExpanded)
        }
      } else {
        newSet.add(tier)
      }
      return newSet
    })
  }

  const toggleCategory = (tier: TierType, catName: string) => {
    if (!activeTiers.has(tier)) return
    const key = `${tier}-${catName}`
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isCategoryExpanded = (tier: TierType, catName: string) => {
    const key = `${tier}-${catName}`
    return expandedCategories[key] || false
  }

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success(`Quote request sent! We'll contact you within 24 hours.`)
      setShowContactForm(false)
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full mb-3">
              <GraduationCap className="w-3 h-3 text-foreground/60" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                Graduation Quote Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">
              Celebrate Your Achievement,
              <span className="block text-foreground/40">Honor the Moment</span>
            </h1>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-foreground/20 text-foreground text-xs uppercase tracking-wider font-medium hover:border-foreground/40 rounded-full">
            <span>Custom Request</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-background border border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Guest Count</h3>
                <p className="text-[10px] text-foreground/40">Adjust to see pricing update</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {scalingFactors.map(factor => (
                <button 
                  key={factor.pax} 
                  onClick={() => setPax(factor.pax)}
                  className={`px-4 py-2 text-xs font-bold border transition-all duration-300 rounded-full ${
                    pax === factor.pax 
                      ? 'bg-foreground text-background border-foreground' 
                      : 'bg-background border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {factor.pax}
                </button>
              ))}
            </div>
            <p className="text-[8px] text-foreground/40 mt-4">*Item quantities automatically adjust based on guest count</p>
          </div>

          <div className="bg-background border border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Venue Style</h3>
                <p className="text-[10px] text-foreground/40">Choose your celebration setting</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setVenue('indoor')}
                className={`group p-4 text-center transition-all duration-300 rounded-xl border ${
                  venue === 'indoor' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <Home className={`w-6 h-6 mx-auto mb-2 transition-colors ${venue === 'indoor' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'}`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${venue === 'indoor' ? 'text-background' : 'text-foreground'}`}>Indoor</p>
                <p className={`text-[9px] mt-1 ${venue === 'indoor' ? 'text-background/70' : 'text-foreground/40'}`}>Hall, Home, Venue</p>
              </button>
              <button 
                onClick={() => setVenue('outdoor')}
                className={`group p-4 text-center transition-all duration-300 rounded-xl border ${
                  venue === 'outdoor' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <Trees className={`w-6 h-6 mx-auto mb-2 transition-colors ${venue === 'outdoor' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'}`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${venue === 'outdoor' ? 'text-background' : 'text-foreground'}`}>Outdoor</p>
                <p className={`text-[9px] mt-1 ${venue === 'outdoor' ? 'text-background/70' : 'text-foreground/40'}`}>Garden, Backyard, Beach</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const total = getTierTotal(tier)
            const isActive = activeTiers.has(tier)
            const tierDisplayName = getTierDisplayName(tier)
            const tierDescription = getTierDescription(tier)
            const tierIcon = getTierIcon(tier)
            const groupedItems = getGroupedItems(tier)
            
            if (Object.keys(groupedItems).length === 0) return null
            
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`bg-background border rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `border-foreground/30 ring-1 ring-foreground/20 ${tier === 'luxury' ? 'shadow-2xl shadow-foreground/5' : ''}`
                    : 'border-foreground/10 hover:border-foreground/20'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">{tierDisplayName}</span>
                      {tierIcon}
                    </div>
                    {tier === 'signature' && <span className="px-2 py-0.5 bg-foreground/10 text-[8px] uppercase tracking-wider rounded-full text-foreground/60">Most Popular</span>}
                    {tier === 'luxury' && <span className="px-2 py-0.5 bg-foreground/10 text-[8px] uppercase tracking-wider rounded-full text-foreground/60">Best Value</span>}
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-light tracking-tighter text-foreground">
                      <span className="text-sm font-bold mr-1 opacity-60">KES</span>
                      {total.toLocaleString()}
                    </p>
                    <p className="text-xs text-foreground/40 mt-2">{tierDescription}</p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button 
                    onClick={() => toggleTier(tier)}
                    className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center px-5 rounded-lg border transition-all duration-300 ${
                      isActive 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-background border-foreground/20 text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {isActive ? 'Close Details' : 'View Package Details'}
                    {isActive ? <Minus size={14}/> : <Plus size={14}/>}
                  </button>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4 border-t border-foreground/10 pt-4">
                        {Object.entries(groupedItems).map(([catName, items]) => {
                          const categoryTotal = items.reduce((sum, item) => sum + getItemTotal(item, pax, multiplier), 0)
                          const isExpanded = isCategoryExpanded(tier, catName)
                          
                          return (
                            <div key={catName} className="border-t border-foreground/10 pt-3 first:border-t-0 first:pt-0">
                              <button onClick={() => toggleCategory(tier, catName)} className="w-full flex justify-between items-center group">
                                <div className="text-left">
                                  <p className="text-[8px] font-black uppercase tracking-wider opacity-50 text-foreground/40">{catName}</p>
                                  <p className="text-xs font-medium text-foreground">{catName}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-mono whitespace-nowrap text-foreground">KES {categoryTotal.toLocaleString()}</span>
                                  {isExpanded ? <ChevronUp size={14} className="opacity-50 text-foreground" /> : <ChevronDown size={14} className="opacity-50 text-foreground" />}
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden mt-3 space-y-2"
                                  >
                                    {items.map((item, idx) => {
                                      const quantity = getScaledQuantity(pax, item.scalingRule, item.baseQuantity)
                                      const itemTotal = getItemTotal(item, pax, multiplier)
                                      const unitPrice = item.cost / item.baseQuantity
                                      const scaledUnitPrice = Math.round(unitPrice * multiplier)
                                      return (
                                        <div key={idx} className="flex justify-between items-center pl-4 py-2 border-l-2 border-current/20">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] font-mono font-bold">{quantity}×</span>
                                              <p className="text-[10px] leading-tight font-medium">{item.name}</p>
                                            </div>
                                            {item.baseQuantity > 1 && <p className="text-[8px] opacity-60 mt-0.5">{scaledUnitPrice.toLocaleString()} each</p>}
                                            <p className="text-[7px] opacity-40 mt-0.5">{item.description}</p>
                                          </div>
                                          <div className="text-right ml-4">
                                            <p className="text-[9px] font-mono whitespace-nowrap font-bold">KES {itemTotal.toLocaleString()}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                        
                        <div className="pt-4 border-t-2 border-foreground/20 mt-4">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground/60">Package Total</p>
                            <p className="text-xl font-bold text-foreground">KES {total.toLocaleString()}</p>
                          </div>
                          <p className="text-[8px] opacity-50 text-foreground/40 mt-2">*Based on {pax} guests • Scaled with {multiplier}x price multiplier</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Add-Ons Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="bg-background border border-foreground/10 rounded-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-serif italic text-foreground">Make It Unforgettable</h3>
            <p className="text-sm text-foreground/50 mt-1">Add these extras to celebrate in style</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon) => {
              const Icon = addon.icon
              const isSelected = selectedAddOns.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 text-left ${
                    isSelected ? 'border-foreground/40 bg-foreground/5' : 'border-foreground/10 hover:border-foreground/30'
                  }`}
                >
                  <Icon size={20} className="text-foreground/60 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{addon.name}</p>
                    <p className="text-[10px] text-foreground/40">{addon.description}</p>
                  </div>
                  <p className="text-xs font-mono text-foreground">KES {addon.price.toLocaleString()}</p>
                  {isSelected && <CheckCircle size={14} className="text-green-500" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quote Summary */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="bg-gradient-to-r from-foreground/[0.02] via-transparent to-foreground/[0.02] border border-foreground/10 rounded-xl p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground/50">Estimated Total (with add-ons)</p>
              <p className="text-3xl font-light text-foreground">KES {getGrandTotal('signature').toLocaleString()}</p>
              <p className="text-[10px] text-foreground/40 mt-1">*Based on {pax} guests • {venue} venue</p>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={() => { toast.success('Quote saved to your browser!') }} className="px-6 py-2.5 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-medium rounded-full hover:border-foreground/40">Save Quote</button>
              <button onClick={() => setShowEmailQuote(!showEmailQuote)} className="px-6 py-2.5 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-medium rounded-full hover:border-foreground/40">Email Quote</button>
              <button onClick={() => setShowContactForm(true)} className="px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold rounded-full hover:bg-foreground/90">Request Quote</button>
            </div>
          </div>

          <AnimatePresence>
            {showEmailQuote && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-foreground/10">
                <div className="flex gap-3">
                  <input type="email" value={emailQuoteAddress} onChange={(e) => setEmailQuoteAddress(e.target.value)} placeholder="your@email.com" className="flex-1 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground" />
                  <button onClick={() => { if (emailQuoteAddress) { toast.success(`Quote sent to ${emailQuoteAddress}`); setShowEmailQuote(false) } }} className="px-4 py-2 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold rounded-full">Send</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showContactForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-foreground/10">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground" />
                    <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground" />
                    <input type="date" name="eventDate" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground" />
                  </div>
                  <textarea name="message" placeholder="Any special requests?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground resize-none" />
                  <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-foreground text-background text-[11px] uppercase tracking-wider font-bold rounded-full">Send Request</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="bg-background border border-foreground/10 rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-foreground/60" />
            <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">Need Something Different?</span>
          </div>
          <h2 className="text-2xl font-serif italic text-foreground mb-3">Create a Custom Graduation Celebration</h2>
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">Don't see exactly what you're looking for? Let's create a completely custom graduation experience tailored to your achievement.</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full">
            Contact Us <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}