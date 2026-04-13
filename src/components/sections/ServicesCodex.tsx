"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight, X, Send, Calendar, MessageCircle,
  Calculator, Sparkles, ChevronRight, CheckCircle2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PricingTiers { essential: number; signature: number; luxury: number }
interface Service {
  name: string
  shortDesc: string
  fullDesc: string
  price?: number
  image: string
  trending?: boolean
  hasPackages?: boolean
  related: string[]
  quoteHref?: string
  quoteCta?: string
}
interface Category {
  id: string
  title: string
  short: string
  tagline: string
  heroImg: string
  services: Service[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: 'romance',
    title: 'Romance & Weddings',
    short: 'Romance',
    tagline: 'Where love becomes architecture.',
    heroImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900&h=1200',
    services: [
      { name: 'Wedding Decor', shortDesc: 'Ceremony arches, aisle styling, reception centrepieces', fullDesc: 'From intimate ceremonies to grand receptions, we create immersive wedding environments. Our team handles everything from floral installations to lighting design, ensuring your special day reflects your unique love story perfectly.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&h=500&fit=crop', trending: true, hasPackages: true, related: ['Rehearsal Dinners', 'Bridal Showers', 'Cakes & Confectionery'], quoteHref: '/quote', quoteCta: 'Get Instant Quote' },
      { name: 'Engagement Parties', shortDesc: 'Romantic setups, proposal backdrops', fullDesc: 'Create the perfect moment with our bespoke engagement setups. From intimate dinner styling to dramatic proposal backdrops, we ensure your question gets the "yes" it deserves.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=700&h=500&fit=crop', related: ['Picnic Dates', 'Wedding Decor', 'Dining Experiences'] },
      { name: 'Bridal Showers', shortDesc: 'Feminine, elegant decor with custom backdrops', fullDesc: 'Celebrate the bride-to-be with our elegant shower designs. Custom backdrops, sweet tables, and feminine touches that make for perfect photo opportunities.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&h=500&fit=crop', related: ['Baby Showers', 'Anniversary Celebrations', 'Cakes & Confectionery'] },
      { name: 'Rehearsal Dinners', shortDesc: 'Sophisticated table settings, ambient lighting', fullDesc: 'Set the tone for your wedding weekend with sophisticated rehearsal dinner styling. Intimate lighting, personalised table settings, and warm ambiance that primes everyone for the big day.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop', related: ['Wedding Decor', 'Catering Presentation', 'Bar & Lounge'] },
      { name: 'Anniversary Celebrations', shortDesc: 'Milestone anniversaries, vow renewals', fullDesc: 'Celebrate lasting love with nostalgic décor that honours your journey. From silver anniversaries to golden milestones, we create memories worth reliving.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&h=500&fit=crop', related: ['Wedding Decor', 'Picnic Dates', 'Dining Experiences'] },
      { name: 'Traditional Ceremonies', shortDesc: 'Cultural celebrations, recommitment ceremonies', fullDesc: 'Reaffirm your love with intimate ceremonies designed for recommitment. Elegant styling that honours your years together while creating new memories.', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=700&h=500&fit=crop', related: ['Wedding Decor', 'Anniversary Celebrations', 'Engagement Parties'] },
    ]
  },
  {
    id: 'social',
    title: 'Social & Celebrations',
    short: 'Celebrations',
    tagline: 'Every milestone deserves a monument.',
    heroImg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=900&h=1200',
    services: [
      { name: 'Birthday Decor', shortDesc: 'Milestone birthdays, themed parties', fullDesc: 'From first birthdays to centenarian celebrations, we design age-appropriate themes that wow guests. Balloon installations, photo backdrops, and custom signage personalised for the guest of honour.', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&h=500&fit=crop', trending: true, hasPackages: true, related: ['Surprise Parties', 'Cakes & Confectionery', 'Bar & Lounge'], quoteHref: '/quote/birthday', quoteCta: 'Quote This Party' },
      { name: 'Graduation Parties', shortDesc: 'Achievement backdrops, celebration setups', fullDesc: 'Celebrate academic achievements with style. Custom backdrops for photos, themed décor for school colours, and setups that honour the graduate in unforgettable fashion.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&h=500&fit=crop', hasPackages: true, related: ['Graduation Ceremonies', 'Birthday Decor', 'Catering Presentation'], quoteHref: '/quote/graduation', quoteCta: 'Quote This Event' },
      { name: 'Baby Showers', shortDesc: 'Gender reveals, whimsical themes', fullDesc: 'Welcome new life with our whimsical baby shower designs. Gender reveal setups, dessert tables, and themes that range from classic to contemporary.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=500&fit=crop', related: ['Bridal Showers', 'Cakes & Confectionery', 'Picnic Dates'] },
      { name: 'Picnic Dates', shortDesc: 'Luxury picnic setups, florals, grazing platters', fullDesc: 'Romantic outdoor experiences complete with low tables, luxury cushions, grazing platters, and fresh florals. Perfect for proposals or anniversaries.', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&h=500&fit=crop', hasPackages: true, related: ['Engagement Parties', 'Anniversary Celebrations', 'Catering Presentation'], quoteHref: '/quote/picnic', quoteCta: 'Quote This Picnic' },
      { name: 'Surprise Parties', shortDesc: 'Reveal setups, dramatic entrances', fullDesc: 'The art of the surprise. We coordinate reveal moments, dramatic entrances, and custom signage that makes the guest of honour feel truly special.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&h=500&fit=crop', related: ['Birthday Decor', 'Corporate Events', 'Bar & Lounge'] },
      { name: 'Memorial Services', shortDesc: 'Celebrations of life, tribute events', fullDesc: 'Honour loved ones with dignity and grace. We create serene environments for celebrations of life, with thoughtful touches that reflect their legacy.', image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=700&h=500&fit=crop', related: ['Wedding Decor', 'Anniversary Celebrations', 'Dining Experiences'] },
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate & Professional',
    short: 'Corporate',
    tagline: 'Your brand, made physical.',
    heroImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=900&h=1200',
    services: [
      { name: 'Corporate Events', shortDesc: 'Branded environments, stage design', fullDesc: 'Professional events that reflect your brand identity. Networking lounges, branded stages, and environments designed for business and pleasure.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&h=500&fit=crop', related: ['Conferences', 'Product Launches', 'Gala Dinners'] },
      { name: 'Product Launches', shortDesc: 'Immersive brand activations', fullDesc: 'Make your product unforgettable with immersive activations. Interactive displays, press-ready backdrops, and experiences that generate buzz.', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&h=500&fit=crop', trending: true, related: ['Trade Shows', 'Corporate Events', 'Conferences'] },
      { name: 'Gala Dinners', shortDesc: 'Luxurious table settings, red carpet', fullDesc: 'Black-tie affairs executed with precision. Red carpet experiences, luxurious table settings, and dramatic lighting for unforgettable evenings.', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&h=500&fit=crop', related: ['Award Ceremonies', 'Charity Galas', 'Corporate Events'] },
      { name: 'Award Ceremonies', shortDesc: 'Stage grandeur, trophy displays, VIP lounges', fullDesc: 'Celebrate excellence with grandeur. Trophy displays, VIP lounges, and stage designs that honour achievement in style.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&h=500&fit=crop', related: ['Gala Dinners', 'Conferences', 'Corporate Events'] },
      { name: 'Conferences', shortDesc: 'Speaker stages, registration branding', fullDesc: 'Professional conferences that inspire. Speaker stages, branded registration areas, and breakout rooms designed for learning and connection.', image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=700&h=500&fit=crop', related: ['Corporate Events', 'Trade Shows', 'Product Launches'] },
      { name: 'Trade Shows', shortDesc: 'Booth design, branded activations', fullDesc: 'Stand out on the exhibition floor with custom booth designs and branded activations that draw crowds and drive engagement.', image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=700&h=500&fit=crop', related: ['Product Launches', 'Conferences', 'Corporate Events'] },
    ]
  },
  {
    id: 'institutional',
    title: 'Institutional & Scale',
    short: 'Institutional',
    tagline: 'Large scale. No detail missed.',
    heroImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=900&h=1200',
    services: [
      { name: 'Graduation Ceremonies', shortDesc: 'Full school/university décor', fullDesc: 'Large-scale commencement ceremonies for entire institutions. Stage design, photo opportunities, directional signage, and branded backdrops for thousands of guests.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&h=500&fit=crop', related: ['University Events', 'Community Festivals', 'Conferences'] },
      { name: 'University Events', shortDesc: "Freshers' balls, alumni galas", fullDesc: "Campus celebrations that become traditions. Freshers balls, alumni reunions, and faculty recognition nights designed for academic communities.", image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=500&fit=crop', related: ['Graduation Ceremonies', 'Gala Dinners', 'Corporate Events'] },
      { name: 'Charity Galas', shortDesc: 'Elegant décor, mission-driven', fullDesc: 'Fundraising events that inspire generosity. Elegant décor aligned with your mission, creating atmospheres where donors feel connected to your cause.', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&h=500&fit=crop', related: ['Gala Dinners', 'Community Festivals', 'Award Ceremonies'] },
      { name: 'Community Festivals', shortDesc: 'Large-scale installations, multiple stages', fullDesc: 'Bring communities together with large-scale installations, multiple stages, and experiential zones that celebrate culture and connection.', image: 'https://images.unsplash.com/photo-1533174072545-7a4ce6eadca9?w=700&h=500&fit=crop', related: ['Graduation Ceremonies', 'Charity Galas', 'Trade Shows'] },
      { name: 'Political Events', shortDesc: 'Rallies, inaugurations, diplomatic functions', fullDesc: 'Professional staging for political and diplomatic occasions. Podium design, backdrop branding, and secure environment styling.', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=700&h=500&fit=crop', related: ['Corporate Events', 'Conferences', 'Community Festivals'] },
      { name: 'Religious Ceremonies', shortDesc: 'Weddings, baptisms, cultural celebrations', fullDesc: 'Respectful and beautiful décor for religious and cultural ceremonies. We honour traditions while bringing visual excellence to sacred spaces.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&h=500&fit=crop', related: ['Wedding Decor', 'Community Festivals', 'Anniversary Celebrations'] },
    ]
  },
  {
    id: 'culinary',
    title: 'Culinary & Dining',
    short: 'Culinary',
    tagline: 'Food is art. So is its presentation.',
    heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=900&h=1200',
    services: [
      { name: 'Catering Presentation', shortDesc: 'Food stations, buffet styling', fullDesc: 'Elevate your culinary offerings with artful presentation. Food stations, buffet styling, and chef table setups that make dining an experience in itself.', image: 'https://images.unsplash.com/photo-1555244162-803794f237d3?w=700&h=500&fit=crop', related: ['Dining Experiences', 'Bar & Lounge', 'Wedding Decor'] },
      { name: 'Bar & Lounge', shortDesc: 'Champagne walls, signature cocktail stations', fullDesc: 'Sophisticated drinking experiences. Champagne walls, signature cocktail stations, and lounge vignettes that encourage conversation and look stunning on camera.', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=700&h=500&fit=crop', trending: true, related: ['Catering Presentation', 'Dining Experiences', 'Corporate Events'] },
      { name: 'Cakes & Confectionery', shortDesc: 'Custom cake displays, dessert tables', fullDesc: 'Showcase sweet creations with custom displays. Tiered cake stands, dessert tablescapes, and pastry installations that look as good as they taste.', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=700&h=500&fit=crop', related: ['Baby Showers', 'Bridal Showers', 'Wedding Decor'] },
      { name: 'Dining Experiences', shortDesc: 'Tablescaping, thematic dining rooms', fullDesc: 'Immersive dining environments. Thematic tablescaping, room transformations, and sensory details that turn meals into lasting memories.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop', related: ['Catering Presentation', 'Gala Dinners', 'Anniversary Celebrations'] },
      { name: 'Food Festivals', shortDesc: 'Outdoor culinary events, tasting stations', fullDesc: 'Large-scale culinary celebrations. Multiple vendor styling, tasting stations, and outdoor dining environments that bring food communities together.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&h=500&fit=crop', related: ['Community Festivals', 'Catering Presentation', 'Trade Shows'] },
      { name: 'Private Chef Experiences', shortDesc: 'Intimate dining, chef table styling', fullDesc: 'Exclusive dining experiences in private settings. Chef table styling, intimate lighting, and personalised touches for truly memorable meals.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop', related: ['Dining Experiences', 'Catering Presentation', 'Anniversary Celebrations'] },
    ]
  },
]

const TIME_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM']

// ─── Pricing fetchers (preserved from original) ────────────────────────────────
async function fetchWeddingPricing(): Promise<PricingTiers> {
  try {
    const supabase = createClient()
    const tiers = ['essential', 'signature', 'luxury'] as const
    const totals = { essential: 0, signature: 0, luxury: 0 }
    for (const tier of tiers) {
      const { data: items } = await supabase.from('inventory_items').select('*').eq('setup_type', 'theater').eq('tier', tier).eq('is_active', true)
      if (!items) continue
      for (const item of items) {
        let quantity = item.base_quantity
        if (item.scaling_rule === 'per_person') quantity = Math.ceil((100 / 100) * item.base_quantity)
        else if (item.scaling_rule === 'per_table') quantity = Math.ceil(100 / 8)
        const unitPrice = item.base_cost / item.base_quantity
        totals[tier] += Math.round(unitPrice * quantity)
      }
    }
    return totals
  } catch { return { essential: 0, signature: 0, luxury: 0 } }
}

async function fetchStaticPricing(essential: number, signature: number, luxury: number): Promise<PricingTiers> {
  return { essential, signature, luxury }
}

// ─── Shared atoms ──────────────────────────────────────────────────────────────
function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px flex-shrink-0 ${className}`} style={{ background: gold.metallic }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <GoldRule className="w-8" />
      <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>{children}</span>
    </div>
  )
}

// ─── Tier card configs ────────────────────────────────────────────────────────
const TIER_CONFIG = {
  essential: {
    label: 'Essential',
    // Silver / slate — muted, cool
    bg: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 50%, #6B7280 100%)',
    border: 'rgba(156, 163, 175, 0.35)',
    text: '#E5E7EB',
    subText: 'rgba(229,231,235,0.6)',
    glow: 'rgba(156,163,175,0.15)',
    badge: 'Everything you need',
  },
  signature: {
    label: 'Signature',
    // Blue-silver — aspirational middle
    bg: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 50%, #1E3A5F 100%)',
    border: 'rgba(59, 130, 246, 0.40)',
    text: '#DBEAFE',
    subText: 'rgba(219,234,254,0.65)',
    glow: 'rgba(59,130,246,0.18)',
    badge: 'Most popular',
  },
  luxury: {
    label: 'Luxury',
    // Full gold — premium choice
    bg: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
    border: 'rgba(212, 175, 55, 0.55)',
    text: '#1a1400',
    subText: 'rgba(26,20,0,0.6)',
    glow: 'rgba(212,175,55,0.25)',
    badge: 'The full experience',
  },
} as const

// ─── Tier cards component ─────────────────────────────────────────────────────
function TierCards({
  tiers,
  quoteHref,
  pricingLoading,
}: {
  tiers: PricingTiers
  quoteHref: string
  pricingLoading: boolean
}) {
  if (pricingLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-5">
        {['essential','signature','luxury'].map(t => (
          <div key={t} className="h-24 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="mb-5">
      <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: gold.light }}>Choose your package</p>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {(['essential','signature','luxury'] as const).map((tier) => {
          const cfg = TIER_CONFIG[tier]
          const price = tiers[tier]
          const href = `${quoteHref}?tier=${tier}`
          const isLuxury = tier === 'luxury'

          return (
            <Link
              key={tier}
              href={href}
              className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: `1px solid ${cfg.border}`,
                boxShadow: `0 4px 20px ${cfg.glow}`,
              }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0" style={{ background: cfg.bg, opacity: isLuxury ? 1 : 0.9 }} />

              {/* Luxury: animated shimmer overlay */}
              {isLuxury && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)', backgroundSize: '200% 200%' }}
                />
              )}

              <div className="relative z-10 flex flex-col h-full p-3 sm:p-4">
                {/* Badge */}
                <div
                  className="text-[8px] uppercase tracking-wider mb-2 font-medium"
                  style={{ color: cfg.subText }}
                >
                  {cfg.badge}
                </div>

                {/* Tier name */}
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: cfg.text }}
                >
                  {cfg.label}
                </p>

                {/* Price */}
                <p
                  className="text-base sm:text-lg font-light leading-none mb-3"
                  style={{ color: cfg.text }}
                >
                  {(price / 1000).toFixed(0)}
                  <span className="text-[10px] ml-0.5 font-normal">K</span>
                </p>

                {/* CTA arrow */}
                <div className="mt-auto flex items-center gap-1" style={{ color: cfg.subText }}>
                  <span className="text-[9px] uppercase tracking-wider">Select</span>
                  <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="text-[9px] text-foreground/35 mt-2">
        Click any package to open the quote engine with your selection pre-filled.
      </p>
    </div>
  )
}

// ─── Service drawer ────────────────────────────────────────────────────────────
interface DrawerProps {
  service: Service | null
  categoryTitle: string
  pricing: Record<string, PricingTiers>
  pricingLoading: boolean
  onClose: () => void
  onRelatedClick: (name: string) => void
}

function ServiceDrawer({ service, categoryTitle, pricing, pricingLoading, onClose, onRelatedClick }: DrawerProps) {
  const [formMode, setFormMode] = useState<'idle' | 'consult' | 'chat'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '', question: '' })
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  useEffect(() => {
    setFormMode('idle')
    setFormData({ name: '', email: '', phone: '', date: '', time: '', message: '', question: '' })
  }, [service?.name])

  if (!service) return null

  const tiers = pricing[service.name]
  const hasTiers = service.hasPackages && tiers && tiers.essential > 0

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Consultation booked! We'll confirm within 24 hours.`)
    onClose()
  }
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Question sent! We typically reply within 10 minutes.`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.38, ease: [0.19, 1, 0.22, 1] }}
      className="w-full rounded-2xl overflow-hidden border mt-2"
      style={{ borderColor: gold.border, background: gold.glow }}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b" style={{ borderColor: gold.border }}>
        <div className="flex items-center gap-3 min-w-0">
          <GoldRule className="w-5 flex-shrink-0" />
          <span className="text-[9px] uppercase tracking-[0.3em] flex-shrink-0" style={{ color: gold.light }}>{categoryTitle}</span>
          <ChevronRight size={9} className="text-foreground/25 flex-shrink-0" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/55 truncate">{service.name}</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors hover:bg-foreground/5 flex-shrink-0 ml-3"
          style={{ borderColor: gold.border }}
        >
          <X size={12} className="text-foreground/50" />
        </button>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Left: image */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px] overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          {service.trending && (
            <div className="absolute top-4 right-4 text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: gold.metallic, color: 'black' }}>
              Trending
            </div>
          )}
          {/* Starting from hint on image */}
          {hasTiers && !pricingLoading && (
            <div className="absolute bottom-4 left-5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/55 mb-0.5">Packages from</p>
              <p className="text-xl font-light text-white">KES {tiers.essential.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Right: content + actions */}
        <div className="p-5 md:p-7 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-light text-foreground mb-2 leading-tight">{service.name}</h3>
            <p className="text-sm text-foreground/58 leading-relaxed mb-5">{service.fullDesc}</p>

            {/* ── Coloured tier cards ── */}
            {hasTiers && service.quoteHref && (
              <TierCards
                tiers={tiers}
                quoteHref={service.quoteHref}
                pricingLoading={pricingLoading}
              />
            )}

            {/* No-package quote nudge */}
            {!service.hasPackages && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
                style={{ background: gold.glow, border: `1px solid ${gold.border}` }}
              >
                <Sparkles size={13} style={{ color: gold.light, flexShrink: 0 }} />
                <p className="text-xs text-foreground/60 leading-snug">
                  Pricing is custom-quoted based on your event size, venue, and vision.
                  Book a free consultation to get your number.
                </p>
              </div>
            )}

            {/* Related services */}
            {formMode === 'idle' && (
              <div className="mb-4">
                <p className="text-[9px] uppercase tracking-[0.3em] mb-2.5" style={{ color: gold.light }}>Pairs well with</p>
                <div className="flex flex-wrap gap-2">
                  {service.related.map(r => (
                    <button
                      key={r}
                      onClick={() => onRelatedClick(r)}
                      className="text-[10px] px-3 py-1.5 rounded-full border transition-all duration-200 hover:bg-foreground hover:text-background text-foreground/55"
                      style={{ borderColor: gold.border }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Action area ── */}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: gold.border }}>
            <AnimatePresence mode="wait">
              {formMode === 'idle' && (
                <motion.div key="ctas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <button
                    onClick={() => setFormMode('consult')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                    style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                  >
                    <Calendar size={12} />
                    Book Consultation
                  </button>
                  <button
                    onClick={() => setFormMode('chat')}
                    className="w-full flex items-center justify-center gap-2 py-2 text-[10px] text-foreground/40 hover:text-foreground transition-colors"
                  >
                    <MessageCircle size={11} />
                    <span className="underline underline-offset-4">Just a quick question?</span>
                    <span className="text-foreground/22 ml-1">· Reply in 10 min</span>
                  </button>
                </motion.div>
              )}

              {formMode === 'consult' && (
                <motion.form key="consult-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={handleConsultSubmit} className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Book Consultation</p>
                    <button type="button" onClick={() => setFormMode('idle')} className="text-foreground/35 hover:text-foreground transition-colors"><X size={13} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground col-span-2 md:col-span-1" />
                    <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground col-span-2 md:col-span-1" />
                  </div>
                  <input type="tel" placeholder="Phone (optional)" value={formData.phone} onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))} className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" min={minDate} value={formData.date} onChange={e => setFormData(d => ({ ...d, date: e.target.value }))} className={`bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors ${formData.date ? 'text-foreground' : 'text-foreground/35'}`} />
                    <select value={formData.time} onChange={e => setFormData(d => ({ ...d, time: e.target.value }))} className={`bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none ${formData.time ? 'text-foreground' : 'text-foreground/35'}`}>
                      <option value="">Preferred Time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Tell us about your event..." required value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))} rows={2} className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground resize-none" />
                  <button type="submit" className="w-full py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black" style={{ background: gold.metallic }}>Confirm Consultation</button>
                  <button type="button" onClick={() => setFormMode('chat')} className="w-full text-[10px] text-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-1">
                    <MessageCircle size={10} /> Just a quick question instead?
                  </button>
                </motion.form>
              )}

              {formMode === 'chat' && (
                <motion.form key="chat-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={handleChatSubmit} className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Quick Question</p>
                      <p className="text-[9px] text-foreground/40">Typical reply: 10 minutes</p>
                    </div>
                    <button type="button" onClick={() => setFormMode('idle')} className="text-foreground/35 hover:text-foreground transition-colors"><X size={13} /></button>
                  </div>
                  <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground" />
                  <input type="email" placeholder="Email for reply" required value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground" />
                  <textarea placeholder="What's your question about this service?" required value={formData.question} onChange={e => setFormData(d => ({ ...d, question: e.target.value }))} rows={3} className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/35 text-foreground resize-none" />
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black" style={{ background: gold.metallic }}>
                    <Send size={11} /> Send Question
                  </button>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setFormMode('consult')} className="text-[10px] text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1">
                      <Calendar size={10} /> Book full consultation
                    </button>
                    <p className="text-[9px] text-foreground/30">WhatsApp: +254 700 000 000</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function ServicesCodex() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.1, once: false })
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  const [activeCatIdx, setActiveCatIdx] = useState(0)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [pricing, setPricing] = useState<Record<string, PricingTiers>>({})
  const [pricingLoading, setPricingLoading] = useState(true)
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  // Mobile: track expanded category
  const [mobileExpandedCat, setMobileExpandedCat] = useState<number | null>(0)

  const activeCat = CATEGORIES[activeCatIdx]

  // Load pricing
  useEffect(() => {
    const load = async () => {
      const [wedding, birthday, graduation, picnic] = await Promise.all([
        fetchWeddingPricing(),
        fetchStaticPricing(25000, 55000, 95000),
        fetchStaticPricing(35000, 75000, 125000),
        fetchStaticPricing(15000, 35000, 65000),
      ])
      setPricing({
        'Wedding Decor': wedding,
        'Birthday Decor': birthday,
        'Graduation Parties': graduation,
        'Picnic Dates': picnic,
      })
      setPricingLoading(false)
    }
    load()
  }, [])

  const handleServiceClick = useCallback((service: Service) => {
    setActiveService(prev => prev?.name === service.name ? null : service)
  }, [])

  const handleRelatedClick = useCallback((name: string) => {
    for (const cat of CATEGORIES) {
      const svc = cat.services.find(s => s.name === name)
      if (svc) {
        const catIdx = CATEGORIES.indexOf(cat)
        setActiveCatIdx(catIdx)
        setMobileExpandedCat(catIdx)
        setActiveService(svc)
        setTimeout(() => {
          sectionRef.current?.querySelector('[data-drawer]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 100)
        return
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
    >
      {/* ── Ambient gold glow ── */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">

        {/* ── Section header ── */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <SectionLabel>The Atelier</SectionLabel>
            <div className="mt-5 grid md:grid-cols-2 gap-6 items-end">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-foreground mt-3">
                Every event type.{' '}
                <span
                  className="italic bg-clip-text text-transparent"
                  style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                >
                  One standard.
                </span>
              </h2>
              <div className="space-y-3">
                <p className="text-foreground/55 text-sm leading-relaxed">
                  30+ specialisations across five distinct event categories.
                  Select a category to explore, then click any service to see
                  full details, live pricing, and a direct path to booking.
                </p>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 text-xs font-medium group/hq"
                  style={{ color: gold.light }}
                >
                  <Calculator size={12} />
                  <span className="underline underline-offset-4 group-hover/hq:no-underline transition-all">
                    Calculate your event cost instantly
                  </span>
                  <ArrowRight size={11} className="group-hover/hq:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════ DESKTOP LAYOUT */}
        <div className="hidden md:grid grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] gap-6 lg:gap-10 items-start">

          {/* Left: category selector (sticky) */}
          <div className="sticky top-24 space-y-1">
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeCatIdx === idx
              return (
                <motion.button
  key={cat.id}
  onClick={() => { setActiveCatIdx(idx); setActiveService(null) }}
  whileHover={{ x: 2 }}
  className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 group relative ${isActive ? 'ring-1 ring-amber-500/30' : ''}`}
>
                  {/* Image background on active */}
                  <div className={`relative flex items-center gap-3 px-4 py-3.5 transition-all duration-300 ${isActive ? '' : 'hover:bg-foreground/4'}`}>
                    {isActive && (
                      <motion.div
                        layoutId="cat-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: gold.glow, border: `1px solid ${gold.border}` }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={cat.heroImg} alt={cat.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-foreground' : 'text-foreground/50 group-hover:text-foreground/80'}`}>
                          {cat.title}
                        </p>
                        <p className={`text-[9px] truncate transition-colors ${isActive ? 'text-foreground/50' : 'text-foreground/30'}`} style={{ color: isActive ? gold.light : undefined }}>
                          {cat.services.length} services
                        </p>
                      </div>
                      {isActive && (
                        <motion.div layoutId="cat-dot" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold.light }} />
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}

            {/* CTA in sidebar */}
            <div className="pt-5 px-2">
              <GoldRule className="mb-5" />
              <div className="rounded-xl p-4" style={{ background: gold.glow, border: `1px solid ${gold.border}` }}>
                <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: gold.light }}>Instant Quote</p>
                <p className="text-sm font-light text-foreground mb-2 leading-snug">Wedding décor with live pricing</p>
                <Link
                  href="/quote"
                  className="block py-2 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                  style={{ background: gold.metallic }}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Right: service list + drawer */}
          <div className="min-w-0">
            {/* Category hero strip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                className="mb-6"
              >
                <div className="flex items-end gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={activeCat.heroImg} alt={activeCat.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: gold.light }}>
                      {activeCat.services.length} services
                    </p>
                    <h3 className="text-2xl font-light text-foreground">{activeCat.title}</h3>
                    <p className="text-sm text-foreground/45 italic mt-0.5">{activeCat.tagline}</p>
                  </div>
                </div>
                <GoldRule />
              </motion.div>
            </AnimatePresence>

            {/* Service list — drawer renders inline immediately below each clicked row */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat.id + '-list'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-0"
              >
                {activeCat.services.map((service, idx) => {
                  const isActive = activeService?.name === service.name
                  const isHovered = hoveredService === service.name
                  const hasPricing = service.hasPackages && pricing[service.name]?.essential > 0

                  return (
                    <div key={service.name}>
                      {/* ── Service row ── */}
                      <motion.button
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                        onClick={() => handleServiceClick(service)}
                        onMouseEnter={() => setHoveredService(service.name)}
                        onMouseLeave={() => setHoveredService(null)}
                        className={`w-full text-left group border-b transition-all duration-200 ${
                          isActive
                            ? 'border-transparent'
                            : 'last:border-b-0'
                        }`}
                        style={{ borderColor: isActive ? 'transparent' : gold.border }}
                      >
                        <div className={`flex items-center gap-4 py-4 px-3 rounded-xl transition-colors duration-200 ${isActive ? 'bg-foreground/4' : 'hover:bg-foreground/3'}`}>
                          {/* Thumbnail */}
                          <div
                            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300"
                            style={{
                              width: isActive || isHovered ? 48 : 40,
                              height: isActive || isHovered ? 48 : 40,
                              border: isActive ? `1.5px solid ${gold.light}` : '1.5px solid transparent',
                            }}
                          >
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>
                                {service.name}
                              </span>
                              {service.trending && (
                                <span className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ background: gold.light + '20', color: gold.light }}>
                                  Trending
                                </span>
                              )}
                              {service.hasPackages && (
                                <span className="text-[8px] px-2 py-0.5 rounded-full font-medium border" style={{ borderColor: gold.border, color: gold.light }}>
                                  Instant Quote
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 truncate transition-colors ${isActive ? 'text-foreground/55' : 'text-foreground/35 group-hover:text-foreground/50'}`}>
                              {service.shortDesc}
                            </p>
                          </div>

                          {/* Price hint + chevron */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {hasPricing && !pricingLoading && (
                              <span className="text-xs font-medium hidden lg:block" style={{ color: gold.light }}>
                                from {(pricing[service.name].essential / 1000).toFixed(0)}K
                              </span>
                            )}
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                              style={{ background: isActive ? gold.metallic : 'transparent' }}
                            >
                              <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRight size={12} className={isActive ? 'text-black' : 'text-foreground/30'} />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.button>

                      {/* ── Inline drawer — opens immediately below this row ── */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.38, ease: [0.19, 1, 0.22, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3">
                              <ServiceDrawer
                                service={activeService}
                                categoryTitle={activeCat.title}
                                pricing={pricing}
                                pricingLoading={pricingLoading}
                                onClose={() => setActiveService(null)}
                                onRelatedClick={handleRelatedClick}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ MOBILE LAYOUT */}
        <div className="md:hidden space-y-3">
          {CATEGORIES.map((cat, catIdx) => {
            const isExpanded = mobileExpandedCat === catIdx
            return (
              <div
                key={cat.id}
                className="rounded-2xl overflow-hidden border transition-all duration-300"
                style={{ borderColor: isExpanded ? gold.border : 'rgba(255,255,255,0.06)' }}
              >
                {/* Category header */}
                <button
                  onClick={() => {
                    setMobileExpandedCat(isExpanded ? null : catIdx)
                    setActiveCatIdx(catIdx)
                    setActiveService(null)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left"
                  style={{ background: isExpanded ? gold.glow : 'transparent' }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={cat.heroImg} alt={cat.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isExpanded ? 'text-foreground' : 'text-foreground/60'}`}>
                      {cat.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: gold.light }}>
                      {cat.services.length} services · {cat.tagline}
                    </p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={14} className={isExpanded ? 'text-foreground' : 'text-foreground/30'} />
                  </motion.div>
                </button>

                {/* Services list (mobile) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t px-4 pb-4 pt-2 space-y-1" style={{ borderColor: gold.border }}>
                        {cat.services.map((service) => {
                          const isActive = activeService?.name === service.name
                          return (
                            <div key={service.name}>
                              <button
                                onClick={() => handleServiceClick(service)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${isActive ? 'bg-foreground/5' : 'hover:bg-foreground/3'}`}
                                style={{ border: isActive ? `1px solid ${gold.border}` : '1px solid transparent' }}
                              >
                                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                                      {service.name}
                                    </span>
                                    {service.trending && (
                                      <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: gold.light + '20', color: gold.light }}>Trending</span>
                                    )}
                                    {service.hasPackages && (
                                      <span className="text-[8px] px-1.5 py-0.5 rounded-full border" style={{ borderColor: gold.border, color: gold.light }}>Quote</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-foreground/40 mt-0.5 truncate">{service.shortDesc}</p>
                                </div>
                                <motion.div animate={{ rotate: isActive ? 90 : 0 }}>
                                  <ChevronRight size={12} className="text-foreground/30 flex-shrink-0" />
                                </motion.div>
                              </button>

                              {/* Mobile drawer inline */}
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                                    className="overflow-hidden mt-1"
                                  >
                                    <div data-drawer>
                                      <ServiceDrawer
                                        service={activeService}
                                        categoryTitle={cat.title}
                                        pricing={pricing}
                                        pricingLoading={pricingLoading}
                                        onClose={() => setActiveService(null)}
                                        onRelatedClick={handleRelatedClick}
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ borderColor: gold.border }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* Live dot */}
              <span className="flex items-center gap-1.5 text-[10px] text-foreground/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                30+ services · All available by consultation
              </span>
            </div>
            <p className="text-xs text-foreground/45">
              Can't find what you're looking for? We love custom projects.{' '}
              <Link href="/contact" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Tell us your vision.
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest text-foreground border transition-all hover:border-amber-500/40"
              style={{ borderColor: gold.border }}
            >
              Custom Project
            </Link>
            <Link
              href="/quote"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-black"
              style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
            >
              <Calculator size={11} />
              Wedding Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
