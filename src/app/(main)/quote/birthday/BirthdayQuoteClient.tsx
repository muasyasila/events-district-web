"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Minus, ChevronDown, ChevronUp, Crown, 
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles, 
  Package, Sun, Home, Tent, Armchair, Utensils, 
  Flower2, Sparkle, Trees, Heart, Star, Cake, 
  PartyPopper, Balloon, Camera, Music, Gift, Wine, Coffee,
  CheckCircle, X, Palette, Lamp, PenTool, GlassWater
} from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

// Types
type VenueType = 'indoor' | 'outdoor'
type TierType = 'essential' | 'signature' | 'luxury'

// Category configurations
const categories = [
  { id: 'venue', name: 'Venue Styling & Setup', icon: LayoutTemplate },
  { id: 'decor', name: 'Decor Details', icon: Flower2 },
  { id: 'lighting', name: 'Lighting & Mood', icon: Lamp },
  { id: 'signage', name: 'Branding & Signage', icon: PenTool },
  { id: 'dessert', name: 'Dessert & Display Styling', icon: Cake }
]

// INDOOR Items (organized by category)
const indoorItems = {
  essential: {
    venue: [
      { name: 'Standard Room Setup', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic layout arrangement' },
      { name: 'Basic Wall Draping', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple fabric draping' }
    ],
    decor: [
      { name: 'Standard Table Linens', cost: 2000, baseQuantity: 13, scalingRule: 'per_table', description: 'Basic table covers' },
      { name: 'Simple Centerpieces', cost: 3000, baseQuantity: 13, scalingRule: 'per_table', description: 'Single flower vase' },
      { name: 'Spandex Chairs', cost: 70, baseQuantity: 100, scalingRule: 'per_person', description: 'Stretch chair covers' }
    ],
    lighting: [
      { name: 'Standard Ambient Lighting', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic room lighting' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic welcome board' }
    ],
    dessert: [
      { name: 'Basic Dessert Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple dessert display' }
    ]
  },
  signature: {
    venue: [
      { name: 'Premium Room Transformation', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete venue makeover' },
      { name: 'Sequin Wall Backdrop', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glamorous sequin wall' },
      { name: 'Premium Draping', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury fabric draping' }
    ],
    decor: [
      { name: 'Premium Table Linens + Runners', cost: 5000, baseQuantity: 13, scalingRule: 'per_table', description: 'Luxury table covers' },
      { name: 'Floral Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'Fresh flower arrangements' },
      { name: 'Chiavari Chairs', cost: 150, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant chiavari chairs' },
      { name: 'Premium Chair Covers', cost: 100, baseQuantity: 100, scalingRule: 'per_person', description: 'Luxury chair covers' }
    ],
    lighting: [
      { name: 'LED Uplighting (8 lights)', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Color-changing uplights' },
      { name: 'Fairy Light Curtain', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Twinkling light backdrop' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign' },
      { name: 'LED Letter Sign', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glowing letter display' }
    ],
    dessert: [
      { name: 'Premium Dessert Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled dessert display' },
      { name: 'Cake Display Stand', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated cake stand' }
    ]
  },
  luxury: {
    venue: [
      { name: 'Full Venue Transformation', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete venue overhaul' },
      { name: 'Fresh Flower Wall Installation', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Living flower wall' },
      { name: 'Custom Neon Sign Wall', cost: 22000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon backdrop' },
      { name: 'Crystal Chandeliers', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant crystal lighting' }
    ],
    decor: [
      { name: 'Luxury Sequin + Velvet Linens', cost: 10000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium table covers' },
      { name: 'Premium Floral Installations', cost: 18000, baseQuantity: 13, scalingRule: 'per_table', description: 'Designer flower arrangements' },
      { name: 'Cross Back Chairs', cost: 250, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant cross back chairs' },
      { name: 'Luxury Lounge Furniture', cost: 500, baseQuantity: 4, scalingRule: 'per_person', description: 'Comfortable lounge seating' },
      { name: 'Balloon Garland Installation', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Organic balloon garland' }
    ],
    lighting: [
      { name: 'Custom Monogram Projection', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Name/age light projection' },
      { name: 'Disco Ball + Dance Lights', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Party lighting experience' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED floor' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon name sign' },
      { name: 'Welcome Light Box', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign' },
      { name: 'Directional Signs', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom wayfinding signs' }
    ],
    dessert: [
      { name: 'Champagne Tower Display', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant champagne tower' },
      { name: 'Grazing Table Styling', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful grazing display' },
      { name: 'Candy Buffet', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Colorful candy display' }
    ]
  }
}

// OUTDOOR Items (organized by category)
const outdoorItems = {
  essential: {
    venue: [
      { name: 'High Peak Tent (100 Seater)', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic tent structure' },
      { name: 'Food Tent', cost: 2500, baseQuantity: 1, scalingRule: 'fixed', description: 'Separate food area' },
      { name: 'Kitchen Tent', cost: 2500, baseQuantity: 1, scalingRule: 'fixed', description: 'Kitchen preparation area' }
    ],
    decor: [
      { name: 'Standard Table Linens', cost: 2000, baseQuantity: 13, scalingRule: 'per_table', description: 'Basic table covers' },
      { name: 'Simple Centerpieces', cost: 3000, baseQuantity: 13, scalingRule: 'per_table', description: 'Single flower vase' },
      { name: 'Spandex Chairs', cost: 70, baseQuantity: 100, scalingRule: 'per_person', description: 'Stretch chair covers' }
    ],
    lighting: [
      { name: 'String Light Canopy', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic outdoor lighting' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic welcome board' }
    ],
    dessert: [
      { name: 'Basic Dessert Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple dessert display' }
    ]
  },
  signature: {
    venue: [
      { name: 'Blines Tent (10x10 Section)', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure' },
      { name: 'Premium Food Tent', cost: 3500, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled food area' },
      { name: 'Premium Kitchen Tent', cost: 3500, baseQuantity: 1, scalingRule: 'fixed', description: 'Professional kitchen setup' },
      { name: 'Tent Draping & Decor', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant tent draping' }
    ],
    decor: [
      { name: 'Premium Table Linens + Runners', cost: 5000, baseQuantity: 13, scalingRule: 'per_table', description: 'Luxury table covers' },
      { name: 'Floral Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'Fresh flower arrangements' },
      { name: 'Chiavari Chairs', cost: 150, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant chiavari chairs' },
      { name: 'Premium Chair Covers', cost: 100, baseQuantity: 100, scalingRule: 'per_person', description: 'Luxury chair covers' }
    ],
    lighting: [
      { name: 'LED Uplighting (8 lights)', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Color-changing uplights' },
      { name: 'Fairy Light Canopy', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Magical light ceiling' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign' },
      { name: 'LED Letter Sign', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glowing letter display' }
    ],
    dessert: [
      { name: 'Premium Dessert Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled dessert display' },
      { name: 'Cake Display Stand', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated cake stand' }
    ]
  },
  luxury: {
    venue: [
      { name: 'A-Frame Luxury Tent (2 Sections)', cost: 70000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure' },
      { name: 'Premium Food A-Frame', cost: 4500, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury food area' },
      { name: 'Premium Kitchen A-Frame', cost: 4500, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium kitchen setup' },
      { name: 'Full Ceiling Draping', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete ceiling transformation' }
    ],
    decor: [
      { name: 'Luxury Sequin + Velvet Linens', cost: 10000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium table covers' },
      { name: 'Premium Floral Installations', cost: 18000, baseQuantity: 13, scalingRule: 'per_table', description: 'Designer flower arrangements' },
      { name: 'Cross Back Chairs', cost: 250, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant cross back chairs' },
      { name: 'Luxury Lounge Furniture', cost: 500, baseQuantity: 4, scalingRule: 'per_person', description: 'Comfortable lounge seating' },
      { name: 'Balloon Garland Installation', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Organic balloon garland' }
    ],
    lighting: [
      { name: 'Premium Lighting + Uplighting', cost: 30000, baseQuantity: 1, scalingRule: 'fixed', description: 'Advanced lighting system' },
      { name: 'Crystal Chandeliers', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant hanging chandeliers' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED floor' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon name sign' },
      { name: 'Welcome Light Box', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign' },
      { name: 'Directional Signs', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom wayfinding signs' }
    ],
    dessert: [
      { name: 'Champagne Tower Display', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant champagne tower' },
      { name: 'Grazing Table Styling', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful grazing display' },
      { name: 'Candy Buffet', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Colorful candy display' }
    ]
  }
}

// Tables (shared across all venues)
const tableOptions = {
  essential: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests' }
  ],
  signature: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 5, scalingRule: 'per_table', description: 'Seats 10-12 guests' }
  ],
  luxury: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 8, scalingRule: 'per_table', description: 'Seats 10-12 guests' },
    { name: 'Sweetheart Table', cost: 800, baseQuantity: 1, scalingRule: 'fixed', description: 'Special table for guest of honor' }
  ]
}

// Add-ons (shared across all tiers)
const addOns = [
  { id: 'balloon-arch', name: 'Organic Balloon Arch', price: 15000, icon: Balloon, description: '10ft custom balloon arch', category: 'decor' },
  { id: 'photo-booth', name: 'Photo Booth Experience', price: 12000, icon: Camera, description: 'Backdrop + props + instant prints', category: 'entertainment' },
  { id: 'live-dj', name: 'Professional DJ', price: 25000, icon: Music, description: 'Sound system + lighting + MC', category: 'entertainment' },
  { id: 'champagne-wall', name: 'Champagne Wall', price: 15000, icon: Wine, description: '50 glasses + bubbly + LED lighting', category: 'premium' },
  { id: 'dessert-table', name: 'Dessert Table Styling', price: 10000, icon: Cake, description: 'Custom dessert display', category: 'decor' },
  { id: 'party-favors', name: 'Custom Party Favors', price: 7500, icon: Gift, description: 'Personalized favors for 25 guests', category: 'premium' },
  { id: 'neon-sign', name: 'Custom Neon Sign', price: 18000, icon: Sparkle, description: 'Name/age custom neon sign', category: 'signage' },
  { id: 'fireworks', name: 'Fireworks Display', price: 45000, icon: Sparkles, description: '5-minute outdoor show', category: 'premium' }
]

// Scaling factors for guest count
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

export default function BirthdayQuoteClient() {
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
    }
  }

  const getTierDescription = (tier: TierType) => {
    switch(tier) {
      case 'essential': return 'Essential elegance for intimate celebrations'
      case 'signature': return 'Signature style for unforgettable moments'
      case 'luxury': return 'Luxury redefined for the extraordinary'
    }
  }

  const getTierIcon = (tier: TierType) => {
    switch(tier) {
      case 'luxury': return <Crown size={16} className="inline-block ml-1" />
      case 'signature': return <Star size={14} className="inline-block ml-1" />
      default: return null
    }
  }

  // Get items for a specific tier based on venue
  const getTierItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorItems[tier] : outdoorItems[tier]
    const tables = tableOptions[tier]
    
    // Flatten all category items
    const allItems = Object.values(venueItems).flat()
    return [...allItems, ...tables]
  }

  // Get items grouped by category for display
  const getGroupedItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorItems[tier] : outdoorItems[tier]
    const tables = tableOptions[tier]
    
    const grouped: Record<string, any[]> = {}
    
    // Add venue items by category
    categories.forEach(cat => {
      if (venueItems[cat.id as keyof typeof venueItems]) {
        grouped[cat.name] = venueItems[cat.id as keyof typeof venueItems]
      }
    })
    
    // Add tables as a separate category
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
      } else {
        newSet.add(tier)
      }
      return newSet
    })
  }

  const toggleCategory = (tier: TierType, catName: string) => {
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
              <Cake className="w-3 h-3 text-foreground/60" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                Birthday Quote Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">
              Design Your Birthday Vision,
              <span className="block text-foreground/40">Celebrate in Style</span>
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
          {/* Guest Count Selector */}
          <div className="bg-background border border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Guest Count</h3>
                <p className="text-[10px] text-foreground/40">Adjust to see pricing update in real-time</p>
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
            <p className="text-[8px] text-foreground/40 mt-4">
              *Item quantities automatically adjust based on guest count
            </p>
          </div>

          {/* Venue Selector - Indoor first */}
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
                <Home className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                  venue === 'indoor' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'
                }`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  venue === 'indoor' ? 'text-background' : 'text-foreground'
                }`}>
                  Indoor
                </p>
                <p className={`text-[9px] mt-1 ${
                  venue === 'indoor' ? 'text-background/70' : 'text-foreground/40'
                }`}>
                  Hall, Home, Venue
                </p>
              </button>
              
              <button 
                onClick={() => setVenue('outdoor')}
                className={`group p-4 text-center transition-all duration-300 rounded-xl border ${
                  venue === 'outdoor' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <Trees className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                  venue === 'outdoor' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'
                }`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  venue === 'outdoor' ? 'text-background' : 'text-foreground'
                }`}>
                  Outdoor
                </p>
                <p className={`text-[9px] mt-1 ${
                  venue === 'outdoor' ? 'text-background/70' : 'text-foreground/40'
                }`}>
                  Garden, Backyard, Beach
                </p>
              </button>
            </div>
            <p className="text-[10px] text-foreground/40 mt-4 text-center">
              {venue === 'indoor' 
                ? '🏠 Wall backdrops, lighting, and indoor transformations included' 
                : '✨ Tents, lighting, and outdoor decor included'}
            </p>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const total = getTierTotal(tier)
            const grandTotal = getGrandTotal(tier)
            const isActive = activeTiers.has(tier)
            const tierDisplayName = getTierDisplayName(tier)
            const tierDescription = getTierDescription(tier)
            const tierIcon = getTierIcon(tier)
            const groupedItems = getGroupedItems(tier)
            
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
                {/* Tier Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                        {tierDisplayName}
                      </span>
                      {tierIcon}
                    </div>
                    {tier === 'signature' && (
                      <span className="px-2 py-0.5 bg-foreground/10 text-[8px] uppercase tracking-wider rounded-full text-foreground/60">
                        Most Popular
                      </span>
                    )}
                    {tier === 'luxury' && (
                      <span className="px-2 py-0.5 bg-foreground/10 text-[8px] uppercase tracking-wider rounded-full text-foreground/60">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-4xl font-light tracking-tighter text-foreground">
                      <span className="text-sm font-bold mr-1 opacity-60">KES</span>
                      {total.toLocaleString()}
                    </p>
                    <p className="text-xs text-foreground/40 mt-2">
                      {tierDescription}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
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

                {/* Detailed Inventory - Grouped by Category */}
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
                          const categoryTotal = items.reduce((sum, item) => 
                            sum + getItemTotal(item, pax, multiplier), 0
                          )
                          const isExpanded = isCategoryExpanded(tier, catName)
                          
                          return (
                            <div key={catName} className="border-t border-foreground/10 pt-3 first:border-t-0 first:pt-0">
                              <button
                                onClick={() => toggleCategory(tier, catName)}
                                className="w-full flex justify-between items-center group"
                              >
                                <div className="text-left">
                                  <p className="text-[8px] font-black uppercase tracking-wider opacity-50 text-foreground/40">
                                    {catName}
                                  </p>
                                  <p className="text-xs font-medium text-foreground">
                                    {catName}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-mono whitespace-nowrap text-foreground">
                                    KES {categoryTotal.toLocaleString()}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp size={14} className="opacity-50 text-foreground" />
                                  ) : (
                                    <ChevronDown size={14} className="opacity-50 text-foreground" />
                                  )}
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
                                      const showUnitPrice = item.baseQuantity > 1
                                      
                                      return (
                                        <div key={idx} className="flex justify-between items-center pl-4 py-2 border-l-2 border-current/20">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] font-mono font-bold">
                                                {quantity}×
                                              </span>
                                              <p className="text-[10px] leading-tight font-medium">
                                                {item.name}
                                              </p>
                                            </div>
                                            {showUnitPrice && (
                                              <p className="text-[8px] opacity-60 mt-0.5">
                                                {scaledUnitPrice.toLocaleString()} each
                                              </p>
                                            )}
                                            <p className="text-[7px] opacity-40 mt-0.5">
                                              {item.description}
                                            </p>
                                          </div>
                                          <div className="text-right ml-4">
                                            <p className="text-[9px] font-mono whitespace-nowrap font-bold">
                                              KES {itemTotal.toLocaleString()}
                                            </p>
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
                        
                        {/* Package Total */}
                        <div className="pt-4 border-t-2 border-foreground/20 mt-4">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground/60">
                              Package Total
                            </p>
                            <p className="text-xl font-bold text-foreground">
                              KES {total.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-[8px] opacity-50 text-foreground/40 mt-2">
                            *Based on {pax} guests • Scaled with {multiplier}x price multiplier
                          </p>
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
            <h3 className="text-xl font-serif italic text-foreground">Enhance Your Celebration</h3>
            <p className="text-sm text-foreground/50 mt-1">Add these extras to make your party unforgettable</p>
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
                    isSelected
                      ? 'border-foreground/40 bg-foreground/5'
                      : 'border-foreground/10 hover:border-foreground/30'
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

      {/* Quote Summary & Actions */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="bg-gradient-to-r from-foreground/[0.02] via-transparent to-foreground/[0.02] border border-foreground/10 rounded-xl p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Display */}
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground/50">Estimated Total (with add-ons)</p>
              <p className="text-3xl font-light text-foreground">KES {getGrandTotal('signature').toLocaleString()}</p>
              <p className="text-[10px] text-foreground/40 mt-1">*Based on {pax} guests • {venue} venue</p>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  const total = getGrandTotal('signature')
                  const quoteData = { pax, venue, total, date: new Date().toISOString() }
                  localStorage.setItem('savedBirthdayQuote', JSON.stringify(quoteData))
                  toast.success('Quote saved to your browser!')
                }}
                className="px-6 py-2.5 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-medium rounded-full hover:border-foreground/40 transition-colors"
              >
                Save Quote
              </button>
              <button
                onClick={() => setShowEmailQuote(!showEmailQuote)}
                className="px-6 py-2.5 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-medium rounded-full hover:border-foreground/40 transition-colors"
              >
                Email Quote
              </button>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold rounded-full hover:bg-foreground/90 transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>

          {/* Email Quote Form */}
          <AnimatePresence>
            {showEmailQuote && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-foreground/10"
              >
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={emailQuoteAddress}
                    onChange={(e) => setEmailQuoteAddress(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/30"
                  />
                  <button
                    onClick={() => {
                      if (emailQuoteAddress) {
                        toast.success(`Quote sent to ${emailQuoteAddress}`)
                        setShowEmailQuote(false)
                      }
                    }}
                    className="px-4 py-2 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold rounded-full"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Form */}
          <AnimatePresence>
            {showContactForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-foreground/10"
              >
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

      {/* Custom Quote CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="bg-background border border-foreground/10 rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-foreground/60" />
            <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Need Something Completely Unique?
            </span>
          </div>
          <h2 className="text-2xl font-serif italic text-foreground mb-3">Create a Custom Celebration</h2>
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">Don't see exactly what you're looking for? Let's create a completely custom birthday experience tailored to your vision.</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full">
            Contact Us <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}