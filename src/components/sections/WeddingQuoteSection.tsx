'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calculator, Sparkles, ArrowRight, Clock, Users, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PricingData {
  essential: number
  signature: number
  luxury: number
}

// Helper function to calculate tier total for 100 pax
async function fetchWeddingPricing(): Promise<PricingData> {
  const supabase = createClient()
  
  const tiers = ['essential', 'signature', 'luxury'] as const
  const setup = 'theater'
  
  let totals = {
    essential: 0,
    signature: 0,
    luxury: 0
  }
  
  for (const tier of tiers) {
    const { data: items, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('setup_type', setup)
      .eq('tier', tier)
      .eq('is_active', true)
    
    if (error || !items) continue
    
    // Calculate total for 100 pax (multiplier = 1.0)
    const multiplier = 1.0
    
    for (const item of items) {
      // Calculate scaled quantity based on rule
      let quantity = item.base_quantity
      
      switch (item.scaling_rule) {
        case 'per_person':
          quantity = Math.ceil((100 / 100) * item.base_quantity)
          break
        case 'per_table':
          const tablesNeeded = Math.ceil(100 / 8)
          quantity = tablesNeeded
          break
        case 'per_car':
          const carMultiplier = Math.ceil(100 / 100)
          quantity = Math.min(item.base_quantity * carMultiplier, 50)
          break
        case 'per_maid':
          const maidMultiplier = Math.ceil(100 / 100)
          quantity = Math.min(item.base_quantity * maidMultiplier, 12)
          break
        default:
          quantity = item.base_quantity
      }
      
      // Calculate unit price
      const unitPrice = item.base_cost / item.base_quantity
      const scaledUnitPrice = unitPrice * multiplier
      const itemTotal = Math.round(scaledUnitPrice * quantity)
      
      totals[tier] += itemTotal
    }
  }
  
  return totals
}

export default function WeddingQuoteSection() {
  const [pricing, setPricing] = useState<PricingData>({
    essential: 0,
    signature: 0,
    luxury: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPricing = async () => {
      const data = await fetchWeddingPricing()
      setPricing(data)
      setLoading(false)
    }
    loadPricing()
  }, [])

  return (
    <section className="relative w-full bg-background py-20 md:py-28 overflow-hidden border-y border-foreground/10">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/[0.01] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Side - Content */}
            <div className="p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full">
                  <Sparkles className="w-3 h-3 text-foreground/60" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                    Wedding Quotation
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-foreground leading-tight">
                  Plan Your Dream Wedding
                  <span className="block text-foreground/40 text-2xl md:text-3xl lg:text-4xl mt-2">
                    With Confidence
                  </span>
                </h2>

                {/* Description */}
                <p className="text-foreground/60 font-light leading-relaxed">
                  Get an instant, transparent quote for your wedding decor based on your guest count, 
                  layout preference, and style. No hidden fees, no surprises—just beautiful design 
                  tailored to your vision.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">100-1000+ Guests</p>
                      <p className="text-[10px] text-foreground/40">Scalable pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">3 Curated Tiers</p>
                      <p className="text-[10px] text-foreground/40">Essential • Signature • Luxury</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Real-Time Pricing</p>
                      <p className="text-[10px] text-foreground/40">Instantly adjust</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Itemized Breakdown</p>
                      <p className="text-[10px] text-foreground/40">See exactly what's included</p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link
                    href="/quote"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-all duration-300 rounded-sm"
                  >
                    <Calculator className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Get Wedding Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-foreground/20 text-foreground text-[11px] uppercase tracking-[0.2em] font-bold hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300 rounded-sm"
                  >
                    <span>Custom Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Note about other packages */}
                <p className="text-[10px] text-foreground/30 pt-4 border-t border-foreground/10">
                   Other event packages (Corporate, Social, Culinary) coming soon — 
                  <Link href="/contact" className="text-foreground/50 hover:text-foreground transition-colors ml-1 underline underline-offset-2">
                    contact us for a custom quote
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Side - Visual/Decorative with Dynamic Prices */}
            <div className="relative bg-foreground/[0.03] p-8 md:p-12 lg:p-16 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center w-full"
              >
                {/* Decorative Quote Mark */}
                <div className="text-8xl font-serif italic text-foreground/5 absolute top-8 left-8 hidden lg:block">
                  "
                </div>
                
                {/* Sample Price Display - Dynamic */}
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    Starting From
                  </p>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-12 w-40 bg-foreground/10 animate-pulse rounded mx-auto"></div>
                      <div className="h-4 w-48 bg-foreground/10 animate-pulse rounded mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-5xl md:text-6xl font-serif italic text-foreground">
                        KES {pricing.essential.toLocaleString()}
                      </p>
                      <p className="text-sm text-foreground/50">
                        for 100 guests • Essential Package
                      </p>
                    </>
                  )}
                  
                  <div className="w-16 h-px bg-foreground/20 mx-auto my-6" />
                  
                  <div className="space-y-3">
                    {loading ? (
                      <>
                        <div className="h-8 w-full bg-foreground/10 animate-pulse rounded"></div>
                        <div className="h-8 w-full bg-foreground/10 animate-pulse rounded"></div>
                        <div className="h-8 w-full bg-foreground/10 animate-pulse rounded"></div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-6 text-sm border-b border-foreground/10 pb-2">
                          <span className="text-foreground/60">Essential</span>
                          <span className="font-mono text-foreground">KES {pricing.essential.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-sm border-b border-foreground/10 pb-2">
                          <span className="text-foreground/60">Signature</span>
                          <span className="font-mono text-foreground">KES {pricing.signature.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-sm">
                          <span className="text-foreground/60">Luxury</span>
                          <span className="font-mono text-foreground">KES {pricing.luxury.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-foreground/30 mt-6">
                    *Prices shown for 100 guests • Theater setup
                  </p>
                </div>
                
                {/* Decorative Quote Mark Bottom */}
                <div className="text-8xl font-serif italic text-foreground/5 absolute bottom-8 right-8 hidden lg:block">
                  "
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}