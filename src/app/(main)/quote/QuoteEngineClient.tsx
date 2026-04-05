'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Minus, ChevronDown, ChevronUp, Crown, 
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles, 
  Package, Theater, Coffee, PartyPopper, Mail, Bookmark, Calendar, CheckCircle, Copy
} from 'lucide-react'
import { InventoryItem, SetupType, TierType } from '@/app/actions/inventory'
import { getMultiplier, getItemTotalCost, getScaledQuantity, calculateTierTotal } from '@/lib/utils/scaling'
import ItemWithImage from '@/components/quote/ItemWithImage'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

interface QuoteEngineClientProps {
  initialPax: number
  initialSetup: SetupType
  scalingFactors: Array<{ pax: number; multiplier: number }>
  categoryNames: Record<string, string>
  theaterInventory: {
    essential: Record<string, InventoryItem[]>
    signature: Record<string, InventoryItem[]>
    luxury: Record<string, InventoryItem[]>
  }
  restaurantInventory: {
    essential: Record<string, InventoryItem[]>
    signature: Record<string, InventoryItem[]>
    luxury: Record<string, InventoryItem[]>
  }
}

export default function QuoteEngineClient({
  initialPax,
  initialSetup,
  scalingFactors,
  categoryNames,
  theaterInventory,
  restaurantInventory,
}: QuoteEngineClientProps) {
  const [pax, setPax] = useState<number>(initialPax)
  const [setup, setSetup] = useState<SetupType>(initialSetup)
  const [activeTiers, setActiveTiers] = useState<Set<TierType>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showPlayground, setShowPlayground] = useState(false)
  
  // New states for quote actions
  const [showEmailQuote, setShowEmailQuote] = useState(false)
  const [emailQuoteAddress, setEmailQuoteAddress] = useState('')
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isQuoteSaved, setIsQuoteSaved] = useState(false)
  const [selectedTierForQuote, setSelectedTierForQuote] = useState<TierType | null>(null)

  // Get the current multiplier based on pax
  const multiplier = useMemo(() => getMultiplier(pax, scalingFactors), [pax, scalingFactors])

  // Get current inventory based on setup
  const currentInventory = useMemo(() => {
    return setup === 'theater' ? theaterInventory : restaurantInventory
  }, [setup, theaterInventory, restaurantInventory])

  const tiers: TierType[] = ['essential', 'signature', 'luxury']

  const getTierDisplayName = (tier: TierType): string => {
    switch(tier) {
      case 'essential': return 'Essential'
      case 'signature': return 'Signature'
      case 'luxury': return 'Luxury'
      default: return tier
    }
  }

  const getTierDescription = (tier: TierType): string => {
    switch(tier) {
      case 'essential': return 'Essential elegance for intimate celebrations'
      case 'signature': return 'Signature style for unforgettable moments'
      case 'luxury': return 'Luxury redefined for the extraordinary'
      default: return ''
    }
  }

  const getTierIcon = (tier: TierType) => {
    switch(tier) {
      case 'luxury': return <Crown size={16} className="inline-block ml-1" />
      case 'signature': return <PartyPopper size={14} className="inline-block ml-1" />
      default: return null
    }
  }

  // Check if a tier has any items
  const hasItems = (tier: TierType): boolean => {
    const groupedItems = currentInventory[tier]
    return groupedItems && Object.keys(groupedItems).length > 0
  }

  const toggleTier = (tier: TierType) => {
    // Don't open if there are no items
    if (!hasItems(tier)) return
    
    setActiveTiers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tier)) {
        newSet.delete(tier)
        // Reset expanded categories for this tier when closing
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

  const toggleCategory = (tier: TierType, cat: string) => {
    // Only allow expanding categories for active tiers
    if (!activeTiers.has(tier)) return
    
    const key = `${tier}-${cat}`
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isCategoryExpanded = (tier: TierType, cat: string) => {
    const key = `${tier}-${cat}`
    return expandedCategories[key] || false
  }

  // Calculate total for a tier
  const getTierTotal = (tier: TierType): number => {
    const groupedItems = currentInventory[tier]
    if (!groupedItems) return 0
    
    const allItems = Object.values(groupedItems).flat()
    return calculateTierTotal(allItems, pax, multiplier)
  }

  // Get the grouped items for a tier
  const getGroupedItems = (tier: TierType) => {
    return currentInventory[tier] || {}
  }

  // Save quote to localStorage
  const saveQuoteToLocalStorage = (tier: TierType) => {
    const total = getTierTotal(tier)
    const groupedItems = getGroupedItems(tier)
    
    // Create a simplified version of items for storage
    const itemsSummary = Object.entries(groupedItems).map(([cat, items]) => ({
      category: cat,
      categoryName: categoryNames[cat] || cat,
      items: items.map(item => ({
        name: item.name,
        quantity: getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name),
        cost: getItemTotalCost(item, pax, multiplier)
      }))
    }))
    
    const quoteData = {
      id: Date.now(),
      tier: getTierDisplayName(tier),
      total: total,
      pax: pax,
      setup: setup,
      date: new Date().toISOString(),
      itemsSummary: itemsSummary
    }
    
    const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]')
    savedQuotes.push(quoteData)
    localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes))
    
    setIsQuoteSaved(true)
    toast.success(`${getTierDisplayName(tier)} quote saved! You can view it later.`)
    setTimeout(() => setIsQuoteSaved(false), 3000)
  }

  // Send quote to email
  const sendQuoteToEmail = async (tier: TierType, email: string) => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!tier) {
      toast.error('Please select a package tier')
      return
    }
    
    setIsEmailSending(true)
    
    const total = getTierTotal(tier)
    const groupedItems = getGroupedItems(tier)
    
    // Format the quote for email
    let itemsHtml = ''
    Object.entries(groupedItems).forEach(([cat, items]) => {
      itemsHtml += `<h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; color: #FFFFFF;">Category ${cat}: ${categoryNames[cat] || cat}</h3>`
      itemsHtml += `<ul style="margin: 0; padding-left: 20px; list-style: none;">`
      items.forEach(item => {
        const quantity = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
        const itemTotal = getItemTotalCost(item, pax, multiplier)
        itemsHtml += `<li style="margin-bottom: 8px; color: #CCCCCC;"><strong style="color: #FFFFFF;">${item.name}</strong> - ${quantity}× - KES ${itemTotal.toLocaleString()}</li>`
      })
      itemsHtml += `</ul>`
    })
    
    try {
      // Send email via API route
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tier: getTierDisplayName(tier),
          total,
          pax,
          setup,
          itemsHtml,
          date: new Date().toLocaleDateString()
        })
      })
      
      if (response.ok) {
        toast.success(`Quote sent to ${email}! Check your inbox.`)
        setShowEmailQuote(false)
        setEmailQuoteAddress('')
        setSelectedTierForQuote(null)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email. Please try again.')
    } finally {
      setIsEmailSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
      
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full mb-3">
              <Calculator className="w-3 h-3 text-foreground/60" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                Interactive Quote Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">
              Design Your Wedding Vision,
              <span className="block text-foreground/40">With Precision</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPlayground(!showPlayground)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/20 text-foreground text-xs uppercase tracking-wider font-medium hover:border-foreground/40 hover:bg-foreground/10 transition-all duration-300 rounded-full"
            >
              <Package size={14} />
              <span>Build Custom Your Package</span>
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-foreground/20 text-foreground text-xs uppercase tracking-wider font-medium hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300 rounded-full"
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </Link>
          </div>
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

          {/* Layout Selector */}
          <div className="bg-background border border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Layout Style</h3>
                <p className="text-[10px] text-foreground/40">Choose your seating arrangement</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSetup('theater')}
                className={`group p-4 text-center transition-all duration-300 rounded-xl border ${
                  setup === 'theater' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <Theater className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                  setup === 'theater' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'
                }`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  setup === 'theater' ? 'text-background' : 'text-foreground'
                }`}>
                  Theater Style
                </p>
                <p className={`text-[9px] mt-1 ${
                  setup === 'theater' ? 'text-background/70' : 'text-foreground/40'
                }`}>
                  Rows facing forward
                </p>
              </button>
              
              <button 
                onClick={() => setSetup('restaurant')}
                className={`group p-4 text-center transition-all duration-300 rounded-xl border ${
                  setup === 'restaurant' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <Coffee className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                  setup === 'restaurant' ? 'text-background' : 'text-foreground/60 group-hover:text-foreground'
                }`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  setup === 'restaurant' ? 'text-background' : 'text-foreground'
                }`}>
                  Restaurant Style
                </p>
                <p className={`text-[9px] mt-1 ${
                  setup === 'restaurant' ? 'text-background/70' : 'text-foreground/40'
                }`}>
                  Tables for dining
                </p>
              </button>
            </div>
            
            <p className="text-[10px] text-foreground/40 mt-4 text-center">
              {setup === 'theater' 
                ? '✨ Row-style seating facing one direction — perfect for ceremonies, conferences, and presentations' 
                : '🍽️ Table-based seating for dining and conversation — ideal for receptions and social gatherings'}
            </p>
          </div>
        </div>

        {/* Custom Quote Playground (Placeholder for now) */}
        <AnimatePresence>
          {showPlayground && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 border border-foreground/10 rounded-xl p-8 text-center">
                <Package className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-serif italic text-foreground mb-2">
                  Your Custom Package Builder
                </h3>
                <p className="text-foreground/60 max-w-md mx-auto mb-6">
                  Coming soon! Build your own package by selecting individual items that match your vision.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground/60 text-xs rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>Launching Soon</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {tiers.map((tier, index) => {
            const isLuxury = tier === 'luxury'
            const total = getTierTotal(tier)
            const groupedItems = getGroupedItems(tier)
            const isActive = activeTiers.has(tier)
            const tierDisplayName = getTierDisplayName(tier)
            const tierDescription = getTierDescription(tier)
            const tierIcon = getTierIcon(tier)
            const tierHasItems = hasItems(tier)
            
            // If no items, don't render the card at all
            if (!tierHasItems) return null
            
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`bg-background border rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `border-foreground/30 ring-1 ring-foreground/20 ${isLuxury ? 'shadow-2xl shadow-foreground/5' : ''}`
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
                    {isLuxury && (
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
                  
                  {/* Save Quote Button in Header */}
                  <button
                    onClick={() => saveQuoteToLocalStorage(tier)}
                    className="absolute top-6 right-6 p-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    title="Save this quote"
                  >
                    <Bookmark size={14} className="text-foreground/60" />
                  </button>
                </div>

                {/* View Inventory Button */}
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

                {/* Detailed Inventory - Only shows if there are items */}
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
                        {Object.entries(groupedItems).map(([cat, items]) => {
                          const categoryTotal = items.reduce((sum, item) => 
                            sum + getItemTotalCost(item, pax, multiplier), 0
                          )
                          const isExpanded = isCategoryExpanded(tier, cat)
                          
                          return (
                            <div key={cat} className="border-t border-foreground/10 pt-4 first:border-t-0 first:pt-0">
                              <button
                                onClick={() => toggleCategory(tier, cat)}
                                className="w-full flex justify-between items-center group"
                              >
                                <div className="text-left">
                                  <p className="text-[8px] font-black uppercase tracking-wider opacity-50 text-foreground/40">
                                    Category {cat}
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {categoryNames[cat] || cat}
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
                                    {items.map((item) => {
                                      const scaledQuantity = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
                                      const itemTotal = getItemTotalCost(item, pax, multiplier)
                                      const unitPrice = item.base_cost / item.base_quantity
                                      const scaledUnitPrice = Math.round(unitPrice * multiplier)
                                      const showUnitPrice = item.base_quantity > 1
                                      
                                      return (
                                        <ItemWithImage
                                          key={item.id}
                                          item={item}
                                          scaledQuantity={scaledQuantity}
                                          scaledUnitPrice={scaledUnitPrice}
                                          showUnitPrice={showUnitPrice}
                                          itemTotal={itemTotal}
                                        />
                                      )
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                        
                        {/* Grand Total for Tier */}
                        <div className="pt-4 border-t-2 border-foreground/20 mt-4">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground/60">
                              Total {tierDisplayName.toUpperCase()} Package
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

        {/* Quote Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t border-foreground/10"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif italic text-foreground mb-2">
              Ready to Move Forward?
            </h3>
            <p className="text-foreground/50 text-sm">
              Save your quote, share it with us, or book a consultation to bring your vision to life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Save Quote Button */}
            <div className="bg-background border border-foreground/10 rounded-xl p-6 text-center hover:border-foreground/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 mb-4">
                <Bookmark className="w-5 h-5 text-foreground/60" />
              </div>
              <h4 className="text-base font-serif italic text-foreground mb-2">
                Save Your Quote
              </h4>
              <p className="text-xs text-foreground/50 mb-4">
                Save this quote to your browser for later reference.
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {tiers.map((tier) => {
                  const tierTotal = getTierTotal(tier)
                  if (tierTotal === 0) return null
                  return (
                    <button
                      key={tier}
                      onClick={() => saveQuoteToLocalStorage(tier)}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium border border-foreground/20 rounded-full hover:border-foreground/40 transition-colors"
                    >
                      Save {getTierDisplayName(tier)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Email Quote */}
            <div className="bg-background border border-foreground/10 rounded-xl p-6 text-center hover:border-foreground/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 mb-4">
                <Mail className="w-5 h-5 text-foreground/60" />
              </div>
              <h4 className="text-base font-serif italic text-foreground mb-2">
                Email Your Quote
              </h4>
              <p className="text-xs text-foreground/50 mb-4">
                Send this quote to your email address for later.
              </p>
              
              {!showEmailQuote ? (
                <button
                  onClick={() => setShowEmailQuote(true)}
                  className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-medium border border-foreground/20 rounded-full hover:border-foreground/40 transition-colors"
                >
                  Email Quote
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={selectedTierForQuote || ''}
                      onChange={(e) => setSelectedTierForQuote(e.target.value as TierType)}
                      className="flex-1 px-2 py-1.5 text-xs bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:outline-none focus:border-foreground/30"
                    >
                      <option value="">Select tier</option>
                      {tiers.map((tier) => {
                        const tierTotal = getTierTotal(tier)
                        if (tierTotal === 0) return null
                        return (
                          <option key={tier} value={tier}>{getTierDisplayName(tier)} - KES {tierTotal.toLocaleString()}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailQuoteAddress}
                      onChange={(e) => setEmailQuoteAddress(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-2 py-1.5 text-xs bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:outline-none focus:border-foreground/30 placeholder:text-foreground/40"
                    />
                    <button
                      onClick={() => sendQuoteToEmail(selectedTierForQuote!, emailQuoteAddress)}
                      disabled={!selectedTierForQuote || !emailQuoteAddress || isEmailSending}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    >
                      {isEmailSending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowEmailQuote(false)}
                    className="text-[9px] text-foreground/40 hover:text-foreground/60 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Book Consultation */}
            <div className="bg-background border border-foreground/10 rounded-xl p-6 text-center hover:border-foreground/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 mb-4">
                <Calendar className="w-5 h-5 text-foreground/60" />
              </div>
              <h4 className="text-base font-serif italic text-foreground mb-2">
                Book a Consultation
              </h4>
              <p className="text-xs text-foreground/50 mb-4">
                Let's discuss your vision in detail and bring it to life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-wider font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
              >
                <Calendar size={12} />
                Schedule Call
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Custom Quote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-foreground/10"
        >
          <div className="bg-gradient-to-r from-foreground/[0.02] via-transparent to-foreground/[0.02] border border-foreground/10 rounded-xl p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-foreground/60" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                Need Something Unique?
              </span>
            </div>
            
            <h3 className="text-2xl font-serif italic text-foreground mb-4">
              Create Your Custom Package
            </h3>
            
            <p className="text-foreground/60 max-w-2xl mx-auto mb-8">
              Don't see exactly what you're looking for? We specialize in creating bespoke experiences 
              tailored to your unique vision. Let's collaborate to design something extraordinary.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-all duration-300 rounded-full"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}