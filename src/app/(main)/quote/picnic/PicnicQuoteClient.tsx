"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Minus, ChevronDown, ChevronUp, Crown, 
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles, 
  Package, Heart, Home, Trees, Armchair, Utensils, 
  Flower2, Sparkle, Star, Cake, PartyPopper, Balloon, 
  Camera, Music, Gift, Wine, Coffee, CheckCircle, 
  Sun, Moon, Cloud, Umbrella, Bed, Sofa, 
  GlassWater, Pizza, IceCream, Bluetooth, Volume2
} from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

// Types
type VenueType = 'indoor' | 'outdoor'
type TierType = 'essential' | 'signature' | 'luxury'

// Picnic Categories
const picnicCategories = [
  { id: 'setup', name: 'Picnic Setup', icon: Umbrella },
  { id: 'seating', name: 'Seating & Comfort', icon: Sofa },
  { id: 'decor', name: 'Romantic Decor', icon: Flower2 },
  { id: 'dining', name: 'Dining Experience', icon: GlassWater },
  { id: 'lighting', name: 'Lighting & Ambiance', icon: Sun },
  { id: 'entertainment', name: 'Entertainment', icon: Music }
]

// PICNIC Items (Outdoor focused - more romantic)
const picnicItems = {
  essential: {
    setup: [
      { name: 'Basic Picnic Blanket', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Large comfortable picnic blanket' },
      { name: 'Small Low Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Low wooden table for dining' },
      { name: 'Picnic Basket', cost: 2500, baseQuantity: 1, scalingRule: 'fixed', description: 'Classic wicker picnic basket' }
    ],
    seating: [
      { name: 'Floor Cushions (4)', cost: 2000, baseQuantity: 4, scalingRule: 'per_person', description: 'Comfortable floor cushions' }
    ],
    decor: [
      { name: 'Fresh Flower Bunch', cost: 1500, baseQuantity: 1, scalingRule: 'fixed', description: 'Small fresh flower arrangement' },
      { name: 'Candles (2)', cost: 1000, baseQuantity: 2, scalingRule: 'fixed', description: 'Romantic candles' }
    ],
    dining: [
      { name: 'Basic Dinnerware Set', cost: 1500, baseQuantity: 2, scalingRule: 'per_person', description: 'Plates, glasses, cutlery for 2' },
      { name: 'Cheese Board', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Small wooden cheese board' }
    ],
    lighting: [
      { name: 'String Lights', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: '10ft battery-operated string lights' }
    ],
    entertainment: [
      { name: 'Bluetooth Speaker', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Portable speaker for music' }
    ]
  },
  signature: {
    setup: [
      { name: 'Luxury Picnic Mat', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Thick waterproof picnic mat' },
      { name: 'Low Picnic Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful low wooden table' },
      { name: 'Wicker Picnic Basket', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium wicker basket with leather straps' },
      { name: 'Beach Umbrella', cost: 6000, baseQuantity: 1, scalingRule: 'fixed', description: 'Large sun/rain umbrella' }
    ],
    seating: [
      { name: 'Floor Cushions (6)', cost: 4000, baseQuantity: 6, scalingRule: 'per_person', description: 'Luxury velvet floor cushions' },
      { name: 'Backrest Cushions', cost: 3000, baseQuantity: 2, scalingRule: 'per_person', description: 'Comfortable back support' },
      { name: 'Moroccan Poufs', cost: 8000, baseQuantity: 2, scalingRule: 'fixed', description: 'Stylish leather poufs' }
    ],
    decor: [
      { name: 'Floral Arrangement', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful fresh flower centerpiece' },
      { name: 'Candle Lanterns (4)', cost: 4000, baseQuantity: 4, scalingRule: 'fixed', description: 'Glass lanterns with candles' },
      { name: 'Rose Petals', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Fresh rose petals for the setup' },
      { name: 'Decorative Throw', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Soft throw blanket' }
    ],
    dining: [
      { name: 'Premium Dinnerware Set', cost: 4000, baseQuantity: 2, scalingRule: 'per_person', description: 'Ceramic plates, wine glasses, metal cutlery' },
      { name: 'Charcuterie Board', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Large wooden charcuterie board' },
      { name: 'Wine Glasses (2)', cost: 2000, baseQuantity: 2, scalingRule: 'per_person', description: 'Crystal wine glasses' },
      { name: 'Ice Bucket', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Stylish ice bucket with bottle opener' }
    ],
    lighting: [
      { name: 'Fairy Light Canopy', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Magical fairy light ceiling' },
      { name: 'LED Candle Set', cost: 5000, baseQuantity: 6, scalingRule: 'fixed', description: 'Flickering LED candles' },
      { name: 'Paper Lanterns', cost: 4000, baseQuantity: 5, scalingRule: 'fixed', description: 'Hanging paper lanterns' }
    ],
    entertainment: [
      { name: 'Premium Bluetooth Speaker', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'High-quality portable speaker' },
      { name: 'Portable Projector', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Mini projector for outdoor movies' },
      { name: 'Projector Screen', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Portable projector screen' }
    ]
  },
  luxury: {
    setup: [
      { name: 'Luxury Canopy Tent', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful canopy with draping' },
      { name: 'Low Teak Table', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium teak wood low table' },
      { name: 'Leather Picnic Basket', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Handcrafted leather picnic basket' },
      { name: 'Weather Canopy', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Weather-resistant canopy' }
    ],
    seating: [
      { name: 'Floor Cushions (8)', cost: 8000, baseQuantity: 8, scalingRule: 'per_person', description: 'Luxury velvet floor cushions' },
      { name: 'Backrest Cushions (4)', cost: 6000, baseQuantity: 4, scalingRule: 'per_person', description: 'Premium back support' },
      { name: 'Ottoman Seating', cost: 15000, baseQuantity: 2, scalingRule: 'fixed', description: 'Luxury ottoman seats' },
      { name: 'Persian Rug', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful Persian rug base' }
    ],
    decor: [
      { name: 'Luxury Floral Installation', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Stunning fresh flower installation' },
      { name: 'Vintage Lanterns (6)', cost: 10000, baseQuantity: 6, scalingRule: 'fixed', description: 'Antique-style lanterns' },
      { name: 'Rose Petal Pathway', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Rose petal trail to setup' },
      { name: 'Decorative Throws (2)', cost: 8000, baseQuantity: 2, scalingRule: 'fixed', description: 'Luxury cashmere throws' },
      { name: 'Floral Hoop', cost: 6000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful floral hoop decoration' }
    ],
    dining: [
      { name: 'Luxury Dinnerware Set', cost: 10000, baseQuantity: 2, scalingRule: 'per_person', description: 'Premium porcelain, crystal glasses, gold cutlery' },
      { name: 'Cheese & Charcuterie Board', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Large artisan board' },
      { name: 'Champagne Flutes (2)', cost: 5000, baseQuantity: 2, scalingRule: 'per_person', description: 'Crystal champagne flutes' },
      { name: 'Wine Cooler', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant wine cooler stand' },
      { name: 'Table Runner', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury linen table runner' }
    ],
    lighting: [
      { name: 'Chandelier Lighting', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Battery-operated chandelier' },
      { name: 'Smart LED System', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'App-controlled color lighting' },
      { name: 'Star Projector', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Galaxy star projector' },
      { name: 'Tiki Torches', cost: 8000, baseQuantity: 4, scalingRule: 'fixed', description: 'Ambient tiki torches' }
    ],
    entertainment: [
      { name: 'Premium Sound System', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'High-end portable speakers' },
      { name: 'Outdoor Movie Setup', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Projector + screen + sound' },
      { name: 'Acoustic Musician', cost: 30000, baseQuantity: 1, scalingRule: 'fixed', description: '1-hour live acoustic performance' }
    ]
  }
}

// Add-ons for Picnic
const addOns = [
  { id: 'gourmet-food', name: 'Gourmet Picnic Food', price: 8000, icon: Pizza, description: 'Artisan sandwiches, salads, fruits', category: 'dining' },
  { id: 'wine-bottle', name: 'Premium Wine/Champagne', price: 5000, icon: Wine, description: 'Choice of wine or champagne', category: 'dining' },
  { id: 'dessert-box', name: 'Dessert Box', price: 4000, icon: Cake, description: 'Assorted pastries and sweets', category: 'dining' },
  { id: 'photographer', name: 'Private Photographer', price: 15000, icon: Camera, description: '30-min photo session', category: 'entertainment' },
  { id: 'flower-bouquet', name: 'Custom Bouquet', price: 6000, icon: Flower2, description: 'Bespoke flower bouquet', category: 'decor' },
  { id: 'surprise-setup', name: 'Surprise Setup', price: 5000, icon: Gift, description: 'Hidden setup before arrival', category: 'premium' },
  { id: 'welcome-drink', name: 'Welcome Mocktail', price: 3000, icon: GlassWater, description: '2 welcome drinks', category: 'dining' }
]

// Scaling factors
const scalingFactors = [
  { pax: 2, multiplier: 1.0 },
  { pax: 4, multiplier: 1.6 },
  { pax: 6, multiplier: 2.2 },
  { pax: 8, multiplier: 2.8 },
  { pax: 10, multiplier: 3.2 }
]

// Helper functions
const getMultiplier = (pax: number) => {
  const factor = scalingFactors.find(f => f.pax === pax)
  return factor?.multiplier || 1.0
}

const getScaledQuantity = (pax: number, rule: string, baseQuantity: number) => {
  switch(rule) {
    case 'per_person':
      return Math.ceil((pax / 2) * baseQuantity)
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

export default function PicnicQuoteClient() {
  const [pax, setPax] = useState<number>(2)
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
      case 'essential': return 'Perfect for a cozy date'
      case 'signature': return 'Romantic evening experience'
      case 'luxury': return 'Ultimate luxury proposal setup'
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

  const getGroupedItems = (tier: TierType) => {
    const items = picnicItems[tier]
    const grouped: Record<string, any[]> = {}
    
    picnicCategories.forEach(cat => {
      const catItems = items[cat.id as keyof typeof items]
      if (catItems && catItems.length > 0) {
        grouped[cat.name] = catItems
      }
    })
    
    return grouped
  }

  const getTierTotal = (tier: TierType) => {
    const items = Object.values(picnicItems[tier]).flat()
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
              <Heart className="w-3 h-3 text-foreground/60" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                Picnic Date Quote Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">
              Plan Your Perfect Picnic,
              <span className="block text-foreground/40">Create Lasting Memories</span>
            </h1>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-foreground/20 text-foreground text-xs uppercase tracking-wider font-medium hover:border-foreground/40 rounded-full">
            <span>Custom Request</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Guest Count Selector */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-8">
        <div className="bg-background border border-foreground/10 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-foreground/60" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Number of People</h3>
              <p className="text-[10px] text-foreground/40">Adjust for couples or small groups</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setPax(Math.max(2, pax - 2))}
              className="w-10 h-10 rounded-full border border-foreground/20 text-foreground/60 hover:border-foreground/40 transition-colors"
            >
              -
            </button>
            <div className="text-center">
              <span className="text-3xl font-light text-foreground">{pax}</span>
              <p className="text-[10px] text-foreground/40">people</p>
            </div>
            <button
              onClick={() => setPax(Math.min(10, pax + 2))}
              className="w-10 h-10 rounded-full border border-foreground/20 text-foreground/60 hover:border-foreground/40 transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-[8px] text-foreground/40 text-center mt-4">*Perfect for intimate dates and small gatherings</p>
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
                          <p className="text-[8px] opacity-50 text-foreground/40 mt-2">*Based on {pax} people • Romantic setup included</p>
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
            <h3 className="text-xl font-serif italic text-foreground">Make It Extra Special</h3>
            <p className="text-sm text-foreground/50 mt-1">Add these romantic touches</p>
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
              <p className="text-[10px] text-foreground/40 mt-1">*Based on {pax} people • Romantic setup</p>
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
                  <textarea name="message" placeholder="Any special requests? (proposal, anniversary, etc.)" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground resize-none" />
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
          <h2 className="text-2xl font-serif italic text-foreground mb-3">Create a Custom Picnic Experience</h2>
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">Don't see exactly what you're looking for? Let's create a completely custom picnic experience tailored to your romantic vision.</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full">
            Contact Us <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}