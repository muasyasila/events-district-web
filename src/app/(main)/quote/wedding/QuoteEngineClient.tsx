'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Plus, Minus, ChevronDown, ChevronUp, Crown,
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles,
  Package, Theater, Coffee, PartyPopper, Mail, Bookmark, Calendar, CheckCircle2, Copy,
  Heart, Star, ChevronRight, X, Send, Check
} from 'lucide-react'
import { InventoryItem, SetupType, TierType } from '@/app/actions/inventory'
import { getMultiplier, getItemTotalCost, getScaledQuantity, calculateTierTotal } from '@/lib/utils/scaling'
import ItemWithImage from '@/components/quote/ItemWithImage'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.20)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.25)',
}

// ─── Tier visual configs ──────────────────────────────────────────────────────
const TIER_CONFIG = {
  essential: {
    label:   'Essential',
    badge:   'Beautifully curated',
    tagline: 'Everything you need, nothing you don\'t.',
    bg:      'linear-gradient(135deg, #4B5563 0%, #9CA3AF 50%, #4B5563 100%)',
    border:  'rgba(156, 163, 175, 0.30)',
    text:    '#F9FAFB',
    sub:     'rgba(249,250,251,0.55)',
    glow:    'rgba(156,163,175,0.10)',
    includes: ['Ceremony arch & florals', 'Aisle styling', 'Welcome signage', 'Candle installations'],
  },
  signature: {
    label:   'Signature',
    badge:   'Most chosen',
    tagline: 'The package 60% of our couples choose.',
    bg:      'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #1E3A5F 100%)',
    border:  'rgba(59, 130, 246, 0.45)',
    text:    '#DBEAFE',
    sub:     'rgba(219,234,254,0.60)',
    glow:    'rgba(59,130,246,0.18)',
    includes: ['Everything in Essential', 'Centrepiece upgrades', 'Reception backdrop', 'Floral ceiling installation', 'Gold accents throughout'],
  },
  luxury: {
    label:   'Luxury',
    badge:   'The full experience',
    tagline: 'The event people talk about for years.',
    bg:      'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 40%, #D4AF37 80%, #B8960C 100%)',
    border:  'rgba(212, 175, 55, 0.60)',
    text:    '#1a1400',
    sub:     'rgba(26,20,0,0.60)',
    glow:    'rgba(212,175,55,0.28)',
    includes: ['Everything in Signature', 'Custom lighting design', 'Champagne wall', 'Photo booth setup', 'Day-of coordinator', 'Full venue transformation'],
  },
} as const

// ─── Props ────────────────────────────────────────────────────────────────────
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

// ─── Animated price counter ───────────────────────────────────────────────────
function AnimatedPrice({ value, className = '' }: { value: number; className?: string }) {
  const [displayed, setDisplayed] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value === prevRef.current) return
    const start   = prevRef.current
    const end     = value
    const dur     = 600
    const startTs = performance.now()

    const step = (ts: number) => {
      const p = Math.min((ts - startTs) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplayed(Math.round(start + (end - start) * ease))
      if (p < 1) requestAnimationFrame(step)
      else prevRef.current = end
    }
    requestAnimationFrame(step)
  }, [value])

  return (
    <span className={className}>
      {displayed.toLocaleString()}
    </span>
  )
}

// ─── Guest count slider ───────────────────────────────────────────────────────
function GuestSlider({
  pax,
  scalingFactors,
  onChange,
}: {
  pax: number
  scalingFactors: Array<{ pax: number; multiplier: number }>
  onChange: (v: number) => void
}) {
  const min  = scalingFactors[0]?.pax ?? 50
  const max  = scalingFactors[scalingFactors.length - 1]?.pax ?? 500
  const pct  = ((pax - min) / (max - min)) * 100

  return (
    <div>
      {/* Current count display */}
      <div className="flex items-end gap-2 mb-4">
        <span
          className="text-5xl font-light tabular-nums bg-clip-text text-transparent"
          style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
        >
          {pax}
        </span>
        <span className="text-foreground/45 text-sm mb-2">guests</span>
      </div>

      {/* Slider */}
      <div className="relative mb-4">
        <input
          type="range"
          min={min}
          max={max}
          step={scalingFactors.length > 1 ? scalingFactors[1].pax - scalingFactors[0].pax : 50}
          value={pax}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${gold.light} 0%, ${gold.light} ${pct}%, rgba(212,175,55,0.15) ${pct}%, rgba(212,175,55,0.15) 100%)`,
          }}
        />
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%);
            cursor: pointer;
            box-shadow: 0 0 12px rgba(212,175,55,0.5);
          }
          input[type=range]::-moz-range-thumb {
            width: 22px; height: 22px;
            border: none; border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {scalingFactors.map(f => (
          <button
            key={f.pax}
            onClick={() => onChange(f.pax)}
            className="px-3 py-1.5 rounded-full text-xs border transition-all duration-200 font-medium"
            style={{
              borderColor: pax === f.pax ? gold.light : gold.border,
              background:  pax === f.pax ? gold.metallic : 'transparent',
              color:       pax === f.pax ? 'black' : undefined,
            }}
          >
            {f.pax}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function QuoteEngineClient({
  initialPax,
  initialSetup,
  scalingFactors,
  categoryNames,
  theaterInventory,
  restaurantInventory,
}: QuoteEngineClientProps) {
  const [pax,    setPax]    = useState<number>(initialPax)
  const [setup,  setSetup]  = useState<SetupType>(initialSetup)
  const [activeTier, setActiveTier] = useState<TierType | null>('signature')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedTier, setSelectedTier] = useState<TierType | null>('signature')
  const [showPlayground, setShowPlayground] = useState(false)

  // Email quote
  const [showEmail, setShowEmail]   = useState(false)
  const [emailAddr, setEmailAddr]   = useState('')
  const [sending,   setSending]     = useState(false)

  // Sticky bar
  const stickyRef = useRef<HTMLDivElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      const bottom = heroRef.current.getBoundingClientRect().bottom
      setShowSticky(bottom < 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const multiplier = useMemo(() => getMultiplier(pax, scalingFactors), [pax, scalingFactors])

  const currentInventory = useMemo(
    () => setup === 'theater' ? theaterInventory : restaurantInventory,
    [setup, theaterInventory, restaurantInventory]
  )

  const tiers: TierType[] = ['essential', 'signature', 'luxury']

  const hasItems = (tier: TierType) => {
    const g = currentInventory[tier]
    return g && Object.keys(g).length > 0
  }

  const getTierTotal = useCallback((tier: TierType): number => {
    const g = currentInventory[tier]
    if (!g) return 0
    return calculateTierTotal(Object.values(g).flat(), pax, multiplier)
  }, [currentInventory, pax, multiplier])

  const getGroupedItems = (tier: TierType) => currentInventory[tier] || {}

  const toggleCategory = (tier: TierType, cat: string) => {
    const key = `${tier}-${cat}`
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isCatExpanded = (tier: TierType, cat: string) => !!expandedCategories[`${tier}-${cat}`]

  const saveQuoteToLocalStorage = (tier: TierType) => {
    const total        = getTierTotal(tier)
    const groupedItems = getGroupedItems(tier)
    const quoteData = {
      id:           Date.now(),
      tier:         TIER_CONFIG[tier].label,
      total,
      pax,
      setup,
      date:         new Date().toISOString(),
      itemsSummary: Object.entries(groupedItems).map(([cat, items]) => ({
        category:     cat,
        categoryName: categoryNames[cat] || cat,
        items: items.map(item => ({
          name:     item.name,
          quantity: getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name),
          cost:     getItemTotalCost(item, pax, multiplier),
        })),
      })),
    }
    const saved = JSON.parse(localStorage.getItem('savedQuotes') || '[]')
    saved.push(quoteData)
    localStorage.setItem('savedQuotes', JSON.stringify(saved))
    toast.success(`${TIER_CONFIG[tier].label} quote saved!`)
  }

  const sendQuoteToEmail = async (tier: TierType, email: string) => {
    if (!email || !tier) { toast.error('Please enter your email'); return }
    setSending(true)
    const total        = getTierTotal(tier)
    const groupedItems = getGroupedItems(tier)
    let itemsHtml = ''
    Object.entries(groupedItems).forEach(([cat, items]) => {
      itemsHtml += `<h3>${categoryNames[cat] || cat}</h3><ul>`
      items.forEach(item => {
        const qty  = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
        const cost = getItemTotalCost(item, pax, multiplier)
        itemsHtml += `<li>${item.name} — ${qty}× — KES ${cost.toLocaleString()}</li>`
      })
      itemsHtml += '</ul>'
    })
    try {
      const res = await fetch('/api/send-quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, tier: TIER_CONFIG[tier].label, total, pax, setup, itemsHtml, date: new Date().toLocaleDateString() }),
      })
      if (res.ok) {
        toast.success(`Quote sent to ${email}!`)
        setShowEmail(false)
        setEmailAddr('')
      } else throw new Error()
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const activeTotal = selectedTier ? getTierTotal(selectedTier) : 0

  // Custom color for each tier in live comparison
  const getTierButtonStyle = (tier: TierType, isSelected: boolean) => {
    const colors = {
      essential: { bg: 'linear-gradient(135deg, #4B5563 0%, #9CA3AF 100%)', border: '#9CA3AF', text: '#F9FAFB' },
      signature: { bg: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: '#3B82F6', text: '#DBEAFE' },
      luxury: { bg: gold.metallic, border: gold.light, text: '#1a1400' }
    }
    const color = colors[tier]
    return {
      borderColor: isSelected ? color.border : gold.border,
      background: isSelected ? color.bg : 'rgba(255,255,255,0.02)',
      color: isSelected ? color.text : undefined,
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />

      {/* ── Gold top rule ── */}
      <div className="h-px w-full" style={{ background: gold.metallic }} />

      {/* ── Ambient orbs ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-24 pb-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px" style={{ background: gold.metallic }} />
              <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>
                Wedding Quote Engine
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-foreground mb-5">
              Your wedding.{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                Priced honestly.
              </span>
            </h1>

            <p className="text-base text-foreground/55 leading-relaxed mb-7 max-w-md">
              No vague "starting from" numbers. No waiting 48 hours for a reply. 
              Adjust your guest count and see your exact package price change in real time — 
              live from our actual inventory.
            </p>

            {/* Trust row */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: <CheckCircle2 size={13} />, text: 'Live inventory pricing' },
                { icon: <CheckCircle2 size={13} />, text: 'No hidden fees' },
                { icon: <CheckCircle2 size={13} />, text: 'Book in 2 minutes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: gold.light }}>
                  {item.icon}
                  <span className="text-xs text-foreground/55">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: live price display - NOW WITH TIER COLORS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            <div
              className="rounded-2xl p-7 border"
              style={{ borderColor: gold.border, background: gold.glow, boxShadow: `0 20px 60px ${gold.shadow}` }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: gold.light }}>
                Live package comparison
              </p>
              <div className="space-y-3">
                {tiers.map(tier => {
                  if (!hasItems(tier)) return null
                  const cfg   = TIER_CONFIG[tier]
                  const total = getTierTotal(tier)
                  const isSelected = selectedTier === tier
                  const buttonStyle = getTierButtonStyle(tier, isSelected)
                  return (
                    <motion.button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      whileHover={{ x: 3 }}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200"
                      style={{
                        borderColor: buttonStyle.borderColor,
                        background:  buttonStyle.background,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: isSelected ? buttonStyle.borderColor : cfg.border }}
                        />
                        <span
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: buttonStyle.color }}
                        >
                          {cfg.label}
                        </span>
                        {tier === 'signature' && (
                          <span
                            className="text-[8px] px-2 py-0.5 rounded-full font-bold"
                            style={{
                              background: isSelected ? 'rgba(0,0,0,0.15)' : gold.glow,
                              color:      isSelected ? 'black' : gold.light,
                              border:     `1px solid ${isSelected ? 'rgba(0,0,0,0.1)' : gold.border}`,
                            }}
                          >
                            Most Chosen
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div
                          className="text-sm font-bold tabular-nums"
                          style={{ color: buttonStyle.color }}
                        >
                          KES <AnimatedPrice value={total} />
                        </div>
                        <div
                          className="text-[9px]"
                          style={{ color: isSelected ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.35)' }}
                        >
                          {pax} guests
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-5 pt-4 border-t" style={{ borderColor: gold.border }}>
                <p className="text-[9px] text-foreground/35 text-center">
                  ✦ Prices update live as you adjust guest count below
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CONFIGURATOR CONTROLS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        <div
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: gold.border, background: gold.glow }}
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">

            {/* Guest count */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: gold.metallic }}
                >
                  <Users size={15} style={{ color: '#1a1400' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Guest Count</p>
                  <p className="text-[10px] text-foreground/40">Prices update instantly as you move the slider</p>
                </div>
              </div>
              <GuestSlider pax={pax} scalingFactors={scalingFactors} onChange={setPax} />
            </div>

            {/* Layout */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: gold.metallic }}
                >
                  <LayoutTemplate size={15} style={{ color: '#1a1400' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Seating Style</p>
                  <p className="text-[10px] text-foreground/40">Different setups include different item inventories</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: 'theater' as SetupType,
                    icon: <Theater size={20} />,
                    label: 'Theater Style',
                    sub: 'Rows facing forward · Ceremonies & presentations',
                  },
                  {
                    key: 'restaurant' as SetupType,
                    icon: <Coffee size={20} />,
                    label: 'Restaurant Style',
                    sub: 'Tables for dining · Receptions & social gatherings',
                  },
                ].map(opt => {
                  const isActive = setup === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSetup(opt.key)}
                      className="relative group p-4 rounded-xl border text-left transition-all duration-250"
                      style={{
                        borderColor: isActive ? gold.light : gold.border,
                        background:  isActive ? gold.metallic : 'transparent',
                      }}
                    >
                      <div className={`mb-2 ${isActive ? 'text-black' : 'text-foreground/50'}`}>{opt.icon}</div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-black' : 'text-foreground'}`}>
                        {opt.label}
                      </p>
                      <p className={`text-[10px] leading-snug ${isActive ? 'text-black/55' : 'text-foreground/40'}`}>
                        {opt.sub}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TIER CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-16">

        {/* Section heading */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px" style={{ background: gold.metallic }} />
              <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Choose your package</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">
              Three tiers.{' '}
              <span className="italic" style={{ color: gold.light }}>One perfect fit.</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/45 max-w-xs leading-relaxed">
            Click any tier to expand the full itemised breakdown. Prices update live with your guest count.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          {tiers.map((tier, tidx) => {
            if (!hasItems(tier)) return null
            const cfg           = TIER_CONFIG[tier]
            const total         = getTierTotal(tier)
            const isOpen        = activeTier === tier
            const isSelected    = selectedTier === tier
            const isLuxury      = tier === 'luxury'
            const groupedItems  = getGroupedItems(tier)

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: tidx * 0.1 }}
                className="relative flex flex-col"
              >
                {/* Most chosen badge */}
                {tier === 'signature' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-black"
                      style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                    >
                      ✦ Most Chosen
                    </div>
                  </div>
                )}

                <div
                  className="flex flex-col flex-1 rounded-2xl overflow-hidden border transition-all duration-300"
                  style={{
                    borderColor: isSelected ? gold.light : cfg.border,
                    boxShadow:   isSelected ? `0 8px 40px ${gold.shadow}` : isLuxury ? `0 4px 24px ${cfg.glow}` : 'none',
                  }}
                >
                  {/* Tier gradient header */}
                  <div
                    className="relative p-6 md:p-7"
                    style={{ background: cfg.bg }}
                  >
                    {/* Luxury shimmer */}
                    {isLuxury && (
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)' }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] font-medium mb-1" style={{ color: cfg.sub }}>
                            {cfg.badge}
                          </p>
                          <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: cfg.text }}>
                            {cfg.label}
                          </h3>
                        </div>
                        {isLuxury && <Crown size={18} style={{ color: cfg.text, opacity: 0.7 }} />}
                        {tier === 'signature' && <Star size={16} style={{ color: cfg.text, opacity: 0.7 }} />}
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-baseline gap-1" style={{ color: cfg.text }}>
                          <span className="text-xs opacity-60">KES</span>
                          <span className="text-4xl font-light tabular-nums">
                            <AnimatedPrice value={total} />
                          </span>
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: cfg.sub }}>
                          for {pax} guests · {setup} setup
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: cfg.sub }}>
                        {cfg.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Includes preview */}
                  <div className="px-6 py-4 border-b" style={{ borderColor: cfg.border, background: `${cfg.glow}` }}>
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-3 text-foreground/40">Includes</p>
                    <div className="space-y-2">
                      {cfg.includes.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={11} style={{ color: gold.light, flexShrink: 0 }} />
                          <span className="text-xs text-foreground/65">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 flex flex-col gap-2.5" style={{ background: gold.glow }}>
                    {/* Select this tier */}
                    <button
                      onClick={() => setSelectedTier(tier)}
                      className="w-full py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-200"
                      style={{
                        background:  isSelected ? gold.metallic : 'transparent',
                        color:       isSelected ? 'black' : undefined,
                        border:      `1px solid ${isSelected ? gold.light : gold.border}`,
                        boxShadow:   isSelected ? `0 4px 16px ${gold.shadow}` : 'none',
                      }}
                    >
                      {isSelected ? '✦ Selected' : 'Select Package'}
                    </button>

                    {/* Toggle details */}
                    <button
                      onClick={() => setActiveTier(isOpen ? null : tier)}
                      className="w-full py-2.5 rounded-full text-[10px] uppercase tracking-widest font-medium border flex items-center justify-center gap-2 transition-all duration-200 hover:bg-foreground/5"
                      style={{ borderColor: gold.border }}
                    >
                      {isOpen ? <><Minus size={11} /> Hide Details</> : <><Plus size={11} /> View Full Breakdown</>}
                    </button>
                  </div>

                  {/* ── Expanded inventory ── */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t"
                        style={{ borderColor: gold.border }}
                      >
                        <div className="px-5 py-5 space-y-3">
                          {Object.entries(groupedItems).map(([cat, items]) => {
                            const catTotal  = items.reduce((s, item) => s + getItemTotalCost(item, pax, multiplier), 0)
                            const isExpanded = isCatExpanded(tier, cat)
                            return (
                              <div
                                key={cat}
                                className="rounded-xl border overflow-hidden"
                                style={{ borderColor: gold.border }}
                              >
                                <button
                                  onClick={() => toggleCategory(tier, cat)}
                                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-foreground/3"
                                  style={{ background: gold.glow }}
                                >
                                  <div>
                                    <p className="text-[9px] uppercase tracking-wider text-foreground/35">
                                      {categoryNames[cat] || `Category ${cat}`}
                                    </p>
                                    <p className="text-xs font-medium text-foreground mt-0.5">
                                      KES {catTotal.toLocaleString()}
                                    </p>
                                  </div>
                                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={13} className="text-foreground/40" />
                                  </motion.div>
                                </button>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 py-3 space-y-2 border-t" style={{ borderColor: gold.border }}>
                                        {items.map(item => {
                                          const scaledQty   = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
                                          const itemTotal   = getItemTotalCost(item, pax, multiplier)
                                          const unitPrice   = item.base_cost / item.base_quantity
                                          const scaledUnit  = Math.round(unitPrice * multiplier)
                                          const showUnit    = item.base_quantity > 1
                                          return (
                                            <ItemWithImage
                                              key={item.id}
                                              item={item}
                                              scaledQuantity={scaledQty}
                                              scaledUnitPrice={scaledUnit}
                                              showUnitPrice={showUnit}
                                              itemTotal={itemTotal}
                                            />
                                          )
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}

                          {/* Tier total */}
                          <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: gold.glow, border: `1px solid ${gold.border}` }}>
                            <p className="text-[10px] uppercase tracking-wider text-foreground/50">
                              {TIER_CONFIG[tier].label} Total
                            </p>
                            <p className="text-base font-bold" style={{ color: gold.light }}>
                              KES <AnimatedPrice value={total} />
                            </p>
                          </div>

                          {/* Quick actions inside breakdown */}
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => saveQuoteToLocalStorage(tier)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[9px] uppercase tracking-wider border transition-all hover:bg-foreground/5"
                              style={{ borderColor: gold.border }}
                            >
                              <Bookmark size={10} /> Save
                            </button>
                            <button
                              onClick={() => { setSelectedTier(tier); setShowEmail(true) }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[9px] uppercase tracking-wider border transition-all hover:bg-foreground/5"
                              style={{ borderColor: gold.border }}
                            >
                              <Mail size={10} /> Email
                            </button>
                            <Link
                              href={`/contact?tier=${tier}&guests=${pax}&setup=${setup}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[9px] uppercase tracking-wider text-black font-bold"
                              style={{ background: gold.metallic }}
                            >
                              <Calendar size={10} /> Book
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Per-guest price context ── */}
        {selectedTier && activeTotal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-6 text-center"
          >
            {[
              { label: `Per guest`, value: `KES ${Math.round(activeTotal / pax).toLocaleString()}` },
              { label: `Per table (8 guests)`, value: `KES ${Math.round((activeTotal / pax) * 8).toLocaleString()}` },
              { label: `Selected package`, value: TIER_CONFIG[selectedTier].label },
            ].map((stat, i) => (
              <div key={i} className="px-5 py-3 rounded-xl border" style={{ borderColor: gold.border, background: gold.glow }}>
                <p className="text-[9px] uppercase tracking-wider text-foreground/38 mb-0.5">{stat.label}</p>
                <p className="text-sm font-medium" style={{ color: gold.light }}>{stat.value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF + URGENCY STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border-y" style={{ borderColor: gold.border, background: gold.glow }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              {
                icon: <Users size={14} />,
                value: '23 couples',
                label: 'booked the Signature package this month',
              },
              {
                icon: <Calendar size={14} />,
                value: 'March & April',
                label: 'dates filling fast — popular wedding season',
              },
              {
                icon: <Star size={14} />,
                value: '4.9 / 5',
                label: 'average rating from 150+ couples',
              },
              {
                icon: <CheckCircle2 size={14} />,
                value: '24 hrs',
                label: 'response guarantee after booking',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-center md:text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: gold.metallic }}>
                  <span style={{ color: '#1a1400' }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                  <p className="text-[10px] text-foreground/40">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CUSTOM QUOTE PLAYGROUND - ADDED FROM YOUR PREVIOUS CODE
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={() => setShowPlayground(!showPlayground)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/20 text-foreground text-xs uppercase tracking-wider font-medium hover:border-foreground/40 hover:bg-foreground/10 transition-all duration-300 rounded-full"
          >
            <Package size={14} />
            <span>Build Your Custom Package</span>
          </button>
        </div>

        <AnimatePresence>
          {showPlayground && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
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
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          EMAIL QUOTE MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEmail(false)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden bg-background border"
              style={{ borderColor: gold.border }}
            >
              <div className="h-px w-full" style={{ background: gold.metallic }} />
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: gold.light }}>
                      Email your quote
                    </p>
                    <h3 className="text-lg font-light text-foreground">
                      Send to your inbox
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowEmail(false)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-foreground/5 transition-colors"
                    style={{ borderColor: gold.border }}
                  >
                    <X size={13} className="text-foreground/50" />
                  </button>
                </div>

                {/* Tier selector */}
                <div className="mb-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] mb-3 text-foreground/40">Package</p>
                  <div className="flex gap-2">
                    {tiers.map(tier => {
                      if (!hasItems(tier)) return null
                      const tierColors = {
                        essential: { bg: 'linear-gradient(135deg, #4B5563 0%, #9CA3AF 100%)', border: '#9CA3AF' },
                        signature: { bg: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: '#3B82F6' },
                        luxury: { bg: gold.metallic, border: gold.light }
                      }
                      const colors = tierColors[tier]
                      return (
                        <button
                          key={tier}
                          onClick={() => setSelectedTier(tier)}
                          className="flex-1 py-2.5 rounded-xl text-xs border font-medium transition-all"
                          style={{
                            borderColor: selectedTier === tier ? colors.border : gold.border,
                            background:  selectedTier === tier ? colors.bg : 'transparent',
                            color:       selectedTier === tier ? (tier === 'luxury' ? '#1a1400' : '#FFFFFF') : undefined,
                          }}
                        >
                          {TIER_CONFIG[tier].label}
                        </button>
                      )
                    })}
                  </div>
                  {selectedTier && (
                    <p className="text-[10px] text-foreground/40 mt-2 text-center">
                      KES {getTierTotal(selectedTier).toLocaleString()} · {pax} guests
                    </p>
                  )}
                </div>

                {/* Email input */}
                <div className="mb-5">
                  <p className="text-[9px] uppercase tracking-[0.3em] mb-2 text-foreground/40">Your Email</p>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={emailAddr}
                    onChange={e => setEmailAddr(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <button
                  onClick={() => selectedTier && sendQuoteToEmail(selectedTier, emailAddr)}
                  disabled={!selectedTier || !emailAddr || sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-40"
                  style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                >
                  {sending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full" />
                  ) : (
                    <><Send size={12} /> Send Quote</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          QUOTE ACTIONS + CTA SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Left: custom package */}
          <div className="rounded-2xl border p-7 flex flex-col justify-between" style={{ borderColor: gold.border, background: gold.glow }}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Not quite right?</span>
              </div>
              <h3 className="text-xl font-light text-foreground mb-3">
                Build a custom package.
              </h3>
              <p className="text-sm text-foreground/55 leading-relaxed mb-6">
                These three tiers are starting points. Many of our couples customise elements — swapping florals,
                upgrading lighting, removing items they don't need. We're flexible.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Swap any item for an equivalent',
                  'Remove elements you don\'t need',
                  'Add items not in the standard packages',
                  'Combine elements from different tiers',
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={12} style={{ color: gold.light, flexShrink: 0 }} />
                    <span className="text-xs text-foreground/60">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/contact?source=custom-quote"
              className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-foreground border transition-all hover:border-amber-500/40"
              style={{ borderColor: gold.border }}
            >
              Request Custom Quote
            </Link>
          </div>

          {/* Right: book now */}
          <div
            className="rounded-2xl border p-7 flex flex-col justify-between relative overflow-hidden"
            style={{ borderColor: gold.border }}
          >
            {/* Gold bg */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #1a1400 0%, #2d2200 100%)` }} />
            <div className="absolute inset-0 opacity-20" style={{ background: gold.metallic }} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Ready to book?</span>
              </div>

              {selectedTier ? (
                <>
                  <h3 className="text-xl font-light mb-1" style={{ color: '#FFF2A8' }}>
                    {TIER_CONFIG[selectedTier].label} Package
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xs opacity-60 text-white">KES</span>
                    <span className="text-4xl font-light tabular-nums text-white">
                      <AnimatedPrice value={activeTotal} />
                    </span>
                  </div>
                  <p className="text-sm mb-6" style={{ color: 'rgba(255,242,168,0.55)' }}>
                    {pax} guests · {setup} setup · Prices confirmed at consultation
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-light mb-3" style={{ color: '#FFF2A8' }}>
                    Select a package above
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(255,242,168,0.55)' }}>
                    Choose Essential, Signature, or Luxury to see your total and proceed to booking.
                  </p>
                </>
              )}

              <div className="space-y-3">
                <Link
                  href={`/contact?tier=${selectedTier || 'signature'}&guests=${pax}&setup=${setup}`}
                  className="block w-full py-3.5 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                  style={{ background: gold.metallic, boxShadow: `0 6px 24px rgba(212,175,55,0.4)` }}
                >
                  Book This Package
                </Link>
                <button
                  onClick={() => setShowEmail(true)}
                  className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-medium rounded-full border text-white transition-all hover:bg-white/5"
                  style={{ borderColor: 'rgba(212,175,55,0.35)' }}
                >
                  Email Quote to Myself
                </button>
                <button
                  onClick={() => selectedTier && saveQuoteToLocalStorage(selectedTier)}
                  className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-medium rounded-full border transition-all hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}
                >
                  Save to Browser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            '✦ No deposit required to book a consultation',
            '✦ Final price confirmed in writing before any commitment',
            '✦ Full refund if you cancel 30+ days before your event',
          ].map(t => (
            <p key={t} className="text-[10px] text-foreground/30 uppercase tracking-wider">{t}</p>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STICKY BOOKING BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl"
            style={{ borderColor: gold.border, background: 'rgba(10,10,10,0.92)' }}
          >
            <div className="h-px w-full" style={{ background: gold.metallic }} />
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">

              {/* Left: current selection */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: gold.light }} />
                  <span className="text-[9px] uppercase tracking-wider text-white/40">Live pricing</span>
                </div>
                {selectedTier ? (
                  <>
                    <div className="h-4 w-px bg-white/10" />
                    <div>
                      <span className="text-xs font-medium text-white">{TIER_CONFIG[selectedTier].label} Package</span>
                      <span className="text-white/40 mx-2">·</span>
                      <span className="text-xs" style={{ color: gold.light }}>
                        KES <AnimatedPrice value={activeTotal} />
                      </span>
                      <span className="text-white/40 mx-2">·</span>
                      <span className="text-xs text-white/40">{pax} guests</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-xs text-white/40">Select a package to proceed</span>
                  </>
                )}
              </div>

              {/* Right: CTAs */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowEmail(true)}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] uppercase tracking-wider border transition-all hover:bg-white/5 text-white/60"
                  style={{ borderColor: 'rgba(212,175,55,0.25)' }}
                >
                  <Mail size={10} /> Email
                </button>
                <Link
                  href={`/contact?tier=${selectedTier || 'signature'}&guests=${pax}&setup=${setup}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                  style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                >
                  Book This Package <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacer for sticky bar */}
      {showSticky && <div className="h-20" />}
    </div>
  )
}