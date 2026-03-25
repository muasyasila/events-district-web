'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ChevronDown, ChevronUp, Crown } from 'lucide-react'
import { InventoryItem, SetupType, TierType } from '@/app/actions/inventory'
import { getMultiplier, getItemTotalCost, getScaledQuantity, calculateTierTotal } from '@/lib/utils/scaling'

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

  const getTierIcon = (tier: TierType) => {
    switch(tier) {
      case 'luxury': return <Crown size={14} className="inline-block ml-1" />
      default: return null
    }
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

  const toggleCategory = (tier: TierType, cat: string) => {
    const key = `${tier}-${cat}`
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isCategoryExpanded = (tier: TierType, cat: string) => {
    return expandedCategories[`${tier}-${cat}`] || false
  }

  // Calculate total for a tier
  const getTierTotal = (tier: TierType): number => {
    const groupedItems = currentInventory[tier]
    if (!groupedItems) return 0
    
    // Flatten all items from all categories
    const allItems = Object.values(groupedItems).flat()
    
    return calculateTierTotal(allItems, pax, multiplier)
  }

  // Get the grouped items for a tier
  const getGroupedItems = (tier: TierType) => {
    return currentInventory[tier] || {}
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black py-20 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-black pb-8">
          <div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
              Events District
            </h1>
            <p className="mt-4 text-[10px] tracking-[0.4em] font-bold text-gray-400 uppercase">
              Atmosphere Engineering / Est. 2026
            </p>
          </div>
          <div className="mt-8 md:mt-0 text-right">
            <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">
              System Scale
            </span>
            <p className="text-2xl font-light">
              {pax} Guests — {setup.toUpperCase()} Setup
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-[10px] font-black uppercase mb-6 tracking-widest text-gray-400">
              1. Guest Count
            </h3>
            <div className="flex flex-wrap gap-2">
              {scalingFactors.map(factor => (
                <button 
                  key={factor.pax} 
                  onClick={() => setPax(factor.pax)}
                  className={`px-4 py-2 text-xs font-bold border transition-all ${
                    pax === factor.pax 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white border-gray-200 hover:border-black'
                  }`}
                >
                  {factor.pax}
                </button>
              ))}
            </div>
            <p className="text-[8px] text-gray-400 mt-3">
              *Item quantities automatically adjust based on guest count
            </p>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black uppercase mb-6 tracking-widest text-gray-400">
              2. Layout Configuration
            </h3>
            <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200">
              {(['theater', 'restaurant'] as SetupType[]).map(type => (
                <button 
                  key={type} 
                  onClick={() => setSetup(type)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    setup === type 
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {tiers.map((tier) => {
          const isLuxury = tier === 'luxury'
          const total = getTierTotal(tier)
          const groupedItems = getGroupedItems(tier)
          const isActive = activeTiers.has(tier)
          const tierDisplayName = getTierDisplayName(tier)
          const tierIcon = getTierIcon(tier)
          
          // If no items for this tier, don't render
          if (Object.keys(groupedItems).length === 0) return null
          
          return (
            <div 
              key={tier} 
              className={`border-2 ${isLuxury && !isActive ? 'bg-black text-white border-black shadow-2xl' : isLuxury && isActive ? 'bg-black text-white border-black shadow-2xl' : 'bg-white border-gray-200'} transition-all h-fit`}
            >
              {/* Tier Header */}
              <div className="p-8 border-b border-current/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    {tierDisplayName}
                  </span>
                  {tierIcon}
                </div>
                <div className="mt-6">
                  <h4 className="text-4xl font-light tracking-tighter">
                    <span className="text-sm font-bold mr-2 opacity-60">KES</span>
                    {total.toLocaleString()}
                  </h4>
                  {isLuxury && (
                    <p className="text-[8px] uppercase tracking-wider mt-2 opacity-60">
                      Premium Experience • All-Inclusive
                    </p>
                  )}
                </div>
              </div>

              {/* Toggle Button */}
              <div className="p-8 pt-0">
                <button 
                  onClick={() => toggleTier(tier)}
                  className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center px-4 border transition-all ${
                    isLuxury 
                      ? 'border-white/20 hover:bg-white hover:text-black' 
                      : 'border-black/10 hover:border-black'
                  }`}
                >
                  {isActive ? 'Close Breakdown' : 'View Inventory'}
                  {isActive ? <Minus size={14}/> : <Plus size={14}/>}
                </button>
              </div>

              {/* Detailed Inventory */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 space-y-6">
                      {Object.entries(groupedItems).map(([cat, items]) => {
                        // Calculate category total
                        const categoryTotal = items.reduce((sum, item) => 
                          sum + getItemTotalCost(item, pax, multiplier), 0
                        )
                        const isExpanded = isCategoryExpanded(tier, cat)
                        
                        return (
                          <div key={cat} className="border-t border-current/10 pt-4 first:border-t-0 first:pt-0">
                            <button
                              onClick={() => toggleCategory(tier, cat)}
                              className="w-full flex justify-between items-center group"
                            >
                              <div className="text-left">
                                <p className="text-[8px] font-black uppercase tracking-wider opacity-50">
                                  Category {cat}
                                </p>
                                <p className="text-xs font-bold">
                                  {categoryNames[cat] || cat}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono whitespace-nowrap">
                                  KES {categoryTotal.toLocaleString()}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp size={14} className="opacity-50 flex-shrink-0" />
                                ) : (
                                  <ChevronDown size={14} className="opacity-50 flex-shrink-0" />
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
                                    const scaledQuantity = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
                                    const itemTotal = getItemTotalCost(item, pax, multiplier)
                                    const unitPrice = item.base_cost / item.base_quantity
                                    const scaledUnitPrice = Math.round(unitPrice * multiplier)
                                    const showUnitPrice = item.base_quantity > 1
                                    
                                    return (
                                      <div 
                                        key={item.id} 
                                        className="flex justify-between items-center pl-4 py-2 border-l-2 border-current/20"
                                      >
                                        <div className="flex items-start gap-3 flex-1">
                                          <div className="min-w-[60px]">
                                            <span className="text-[10px] font-mono font-bold">
                                              {scaledQuantity}×
                                            </span>
                                            {showUnitPrice && scaledQuantity !== item.base_quantity && pax !== 100 && (
                                              <p className="text-[7px] opacity-60">
                                                base {item.base_quantity}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-[10px] leading-tight font-medium">
                                              {item.name}
                                            </p>
                                            {showUnitPrice && (
                                              <p className="text-[7px] opacity-60 mt-0.5">
                                                {scaledUnitPrice.toLocaleString()} each
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right ml-4">
                                          <p className="text-[9px] font-mono whitespace-nowrap font-bold">
                                            KES {itemTotal.toLocaleString()}
                                          </p>
                                          <p className="text-[7px] opacity-60">Total</p>
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
                      
                      {/* Grand Total for Tier */}
                      <div className="pt-4 border-t-2 border-current/20 mt-6">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-wider">
                            Total {tierDisplayName.toUpperCase()} Package
                          </p>
                          <p className="text-lg font-bold">
                            KES {total.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-[8px] opacity-50 mt-2">
                          *Based on {pax} guests • Scaled with {multiplier}x price multiplier
                        </p>
                        <p className="text-[7px] opacity-40 mt-1">
                          Quantities automatically adjusted for {pax} guests
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}