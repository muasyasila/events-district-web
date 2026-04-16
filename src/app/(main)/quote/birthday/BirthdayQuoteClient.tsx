'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Plus, Minus, ChevronDown, ChevronUp, Crown,
  Calculator, Users, LayoutTemplate, ArrowRight, Sparkles,
  Package, Home, Tent, Coffee, PartyPopper, Mail, Bookmark, Calendar, CheckCircle2, Copy,
  Heart, Star, ChevronRight, X, Send, Check, Cake, Music, Gift, Camera, Wine, Balloon, Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
    includes: ['Venue setup & styling', 'Standard table linens', 'Simple centerpieces', 'Basic lighting'],
  },
  signature: {
    label:   'Signature',
    badge:   'Most chosen',
    tagline: 'The package 60% of our clients choose.',
    bg:      'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #1E3A5F 100%)',
    border:  'rgba(59, 130, 246, 0.45)',
    text:    '#DBEAFE',
    sub:     'rgba(219,234,254,0.60)',
    glow:    'rgba(59,130,246,0.18)',
    includes: ['Everything in Essential', 'Premium table linens', 'Floral centerpieces', 'Chiavari chairs', 'LED uplighting'],
  },
  luxury: {
    label:   'Luxury',
    badge:   'The full experience',
    tagline: 'The party people talk about for years.',
    bg:      'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 40%, #D4AF37 80%, #B8960C 100%)',
    border:  'rgba(212, 175, 55, 0.60)',
    text:    '#1a1400',
    sub:     'rgba(26,20,0,0.60)',
    glow:    'rgba(212,175,55,0.28)',
    includes: ['Everything in Signature', 'Full venue transformation', 'Champagne wall', 'Photo booth', 'Custom neon sign', 'LED dance floor'],
  },
} as const

// Types
type VenueType = 'indoor' | 'outdoor'
type TierType = 'essential' | 'signature' | 'luxury'

// Category configurations
const categories = [
  { id: 'venue', name: 'Venue Styling & Setup', icon: LayoutTemplate },
  { id: 'decor', name: 'Decor Details', icon: Sparkles },
  { id: 'lighting', name: 'Lighting & Mood', icon: PartyPopper },
  { id: 'signage', name: 'Branding & Signage', icon: Calendar },
  { id: 'dessert', name: 'Dessert & Display Styling', icon: Cake }
]

// Helper to generate placeholder images based on item name
const getItemImage = (itemName: string): string => {
  const imageMap: Record<string, string> = {
    'Standard Room Setup': '/images/birthday/room-setup.jpg',
    'Basic Wall Draping': '/images/birthday/wall-draping.jpg',
    'Standard Table Linens': '/images/birthday/table-linens.jpg',
    'Simple Centerpieces': '/images/birthday/centerpieces.jpg',
    'Spandex Chairs': '/images/birthday/chair-covers.jpg',
    'Standard Ambient Lighting': '/images/birthday/ambient-lighting.jpg',
    'Welcome Sign': '/images/birthday/welcome-sign.jpg',
    'Basic Dessert Table': '/images/birthday/dessert-table.jpg',
    'Premium Room Transformation': '/images/birthday/premium-room.jpg',
    'Sequin Wall Backdrop': '/images/birthday/sequin-wall.jpg',
    'Premium Draping': '/images/birthday/premium-draping.jpg',
    'Premium Table Linens + Runners': '/images/birthday/premium-linens.jpg',
    'Floral Centerpieces': '/images/birthday/floral-centerpieces.jpg',
    'Chiavari Chairs': '/images/birthday/chiavari-chairs.jpg',
    'Premium Chair Covers': '/images/birthday/premium-chair-covers.jpg',
    'LED Uplighting (8 lights)': '/images/birthday/led-uplighting.jpg',
    'Fairy Light Curtain': '/images/birthday/fairy-lights.jpg',
    'Custom Acrylic Sign': '/images/birthday/acrylic-sign.jpg',
    'LED Letter Sign': '/images/birthday/led-letter-sign.jpg',
    'Premium Dessert Table': '/images/birthday/premium-dessert.jpg',
    'Cake Display Stand': '/images/birthday/cake-stand.jpg',
    'Full Venue Transformation': '/images/birthday/full-venue.jpg',
    'Fresh Flower Wall Installation': '/images/birthday/flower-wall.jpg',
    'Custom Neon Sign Wall': '/images/birthday/neon-sign.jpg',
    'Crystal Chandeliers': '/images/birthday/chandeliers.jpg',
    'Luxury Sequin + Velvet Linens': '/images/birthday/luxury-linens.jpg',
    'Premium Floral Installations': '/images/birthday/premium-florals.jpg',
    'Cross Back Chairs': '/images/birthday/cross-back-chairs.jpg',
    'Luxury Lounge Furniture': '/images/birthday/lounge-furniture.jpg',
    'Balloon Garland Installation': '/images/birthday/balloon-garland.jpg',
    'Custom Monogram Projection': '/images/birthday/monogram.jpg',
    'Disco Ball + Dance Lights': '/images/birthday/disco-ball.jpg',
    'LED Dance Floor': '/images/birthday/led-dance-floor.jpg',
    'Neon Name Sign': '/images/birthday/neon-name-sign.jpg',
    'Welcome Light Box': '/images/birthday/light-box.jpg',
    'Directional Signs': '/images/birthday/directional-signs.jpg',
    'Champagne Tower Display': '/images/birthday/champagne-tower.jpg',
    'Grazing Table Styling': '/images/birthday/grazing-table.jpg',
    'Candy Buffet': '/images/birthday/candy-buffet.jpg',
    'Round Tables (60")': '/images/birthday/round-table.jpg',
    'Rectangle Tables (8ft)': '/images/birthday/rectangle-table.jpg',
    'Sweetheart Table': '/images/birthday/sweetheart-table.jpg',
    'High Peak Tent (100 Seater)': '/images/birthday/high-peak-tent.jpg',
    'Food Tent': '/images/birthday/food-tent.jpg',
    'Kitchen Tent': '/images/birthday/kitchen-tent.jpg',
    'String Light Canopy': '/images/birthday/string-lights.jpg',
    'Blines Tent (10x10 Section)': '/images/birthday/blines-tent.jpg',
    'Tent Draping & Decor': '/images/birthday/tent-draping.jpg',
    'Fairy Light Canopy': '/images/birthday/fairy-light-canopy.jpg',
    'A-Frame Luxury Tent (2 Sections)': '/images/birthday/aframe-tent.jpg',
    'Full Ceiling Draping': '/images/birthday/ceiling-draping.jpg',
    'Premium Lighting + Uplighting': '/images/birthday/premium-lighting.jpg',
  }
  
  // Return mapped image or placeholder
  return imageMap[itemName] || '/images/birthday/placeholder.jpg'
}

// INDOOR Items (organized by category) - WITH IMAGES
const indoorItems = {
  essential: {
    venue: [
      { name: 'Standard Room Setup', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic layout arrangement', image: '/images/birthday/room-setup.jpg' },
      { name: 'Basic Wall Draping', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple fabric draping', image: '/images/birthday/wall-draping.jpg' }
    ],
    decor: [
      { name: 'Standard Table Linens', cost: 2000, baseQuantity: 13, scalingRule: 'per_table', description: 'Basic table covers', image: '/images/birthday/table-linens.jpg' },
      { name: 'Simple Centerpieces', cost: 3000, baseQuantity: 13, scalingRule: 'per_table', description: 'Single flower vase', image: '/images/birthday/centerpieces.jpg' },
      { name: 'Spandex Chairs', cost: 70, baseQuantity: 100, scalingRule: 'per_person', description: 'Stretch chair covers', image: '/images/birthday/chair-covers.jpg' }
    ],
    lighting: [
      { name: 'Standard Ambient Lighting', cost: 4000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic room lighting', image: '/images/birthday/ambient-lighting.jpg' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic welcome board', image: '/images/birthday/welcome-sign.jpg' }
    ],
    dessert: [
      { name: 'Basic Dessert Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple dessert display', image: '/images/birthday/dessert-table.jpg' }
    ]
  },
  signature: {
    venue: [
      { name: 'Premium Room Transformation', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete venue makeover', image: '/images/birthday/premium-room.jpg' },
      { name: 'Sequin Wall Backdrop', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glamorous sequin wall', image: '/images/birthday/sequin-wall.jpg' },
      { name: 'Premium Draping', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury fabric draping', image: '/images/birthday/premium-draping.jpg' }
    ],
    decor: [
      { name: 'Premium Table Linens + Runners', cost: 5000, baseQuantity: 13, scalingRule: 'per_table', description: 'Luxury table covers', image: '/images/birthday/premium-linens.jpg' },
      { name: 'Floral Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'Fresh flower arrangements', image: '/images/birthday/floral-centerpieces.jpg' },
      { name: 'Chiavari Chairs', cost: 150, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant chiavari chairs', image: '/images/birthday/chiavari-chairs.jpg' },
      { name: 'Premium Chair Covers', cost: 100, baseQuantity: 100, scalingRule: 'per_person', description: 'Luxury chair covers', image: '/images/birthday/premium-chair-covers.jpg' }
    ],
    lighting: [
      { name: 'LED Uplighting (8 lights)', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Color-changing uplights', image: '/images/birthday/led-uplighting.jpg' },
      { name: 'Fairy Light Curtain', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Twinkling light backdrop', image: '/images/birthday/fairy-lights.jpg' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign', image: '/images/birthday/acrylic-sign.jpg' },
      { name: 'LED Letter Sign', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glowing letter display', image: '/images/birthday/led-letter-sign.jpg' }
    ],
    dessert: [
      { name: 'Premium Dessert Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled dessert display', image: '/images/birthday/premium-dessert.jpg' },
      { name: 'Cake Display Stand', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated cake stand', image: '/images/birthday/cake-stand.jpg' }
    ]
  },
  luxury: {
    venue: [
      { name: 'Full Venue Transformation', cost: 35000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete venue overhaul', image: '/images/birthday/full-venue.jpg' },
      { name: 'Fresh Flower Wall Installation', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Living flower wall', image: '/images/birthday/flower-wall.jpg' },
      { name: 'Custom Neon Sign Wall', cost: 22000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon backdrop', image: '/images/birthday/neon-sign.jpg' },
      { name: 'Crystal Chandeliers', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant crystal lighting', image: '/images/birthday/chandeliers.jpg' }
    ],
    decor: [
      { name: 'Luxury Sequin + Velvet Linens', cost: 10000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium table covers', image: '/images/birthday/luxury-linens.jpg' },
      { name: 'Premium Floral Installations', cost: 18000, baseQuantity: 13, scalingRule: 'per_table', description: 'Designer flower arrangements', image: '/images/birthday/premium-florals.jpg' },
      { name: 'Cross Back Chairs', cost: 250, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant cross back chairs', image: '/images/birthday/cross-back-chairs.jpg' },
      { name: 'Luxury Lounge Furniture', cost: 500, baseQuantity: 4, scalingRule: 'per_person', description: 'Comfortable lounge seating', image: '/images/birthday/lounge-furniture.jpg' },
      { name: 'Balloon Garland Installation', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Organic balloon garland', image: '/images/birthday/balloon-garland.jpg' }
    ],
    lighting: [
      { name: 'Custom Monogram Projection', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Name/age light projection', image: '/images/birthday/monogram.jpg' },
      { name: 'Disco Ball + Dance Lights', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Party lighting experience', image: '/images/birthday/disco-ball.jpg' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED floor', image: '/images/birthday/led-dance-floor.jpg' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon name sign', image: '/images/birthday/neon-name-sign.jpg' },
      { name: 'Welcome Light Box', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign', image: '/images/birthday/light-box.jpg' },
      { name: 'Directional Signs', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom wayfinding signs', image: '/images/birthday/directional-signs.jpg' }
    ],
    dessert: [
      { name: 'Champagne Tower Display', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant champagne tower', image: '/images/birthday/champagne-tower.jpg' },
      { name: 'Grazing Table Styling', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful grazing display', image: '/images/birthday/grazing-table.jpg' },
      { name: 'Candy Buffet', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Colorful candy display', image: '/images/birthday/candy-buffet.jpg' }
    ]
  }
}

// OUTDOOR Items (organized by category) - WITH IMAGES
const outdoorItems = {
  essential: {
    venue: [
      { name: 'High Peak Tent (100 Seater)', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic tent structure', image: '/images/birthday/high-peak-tent.jpg' },
      { name: 'Food Tent', cost: 2500, baseQuantity: 1, scalingRule: 'fixed', description: 'Separate food area', image: '/images/birthday/food-tent.jpg' },
      { name: 'Kitchen Tent', cost: 2500, baseQuantity: 1, scalingRule: 'fixed', description: 'Kitchen preparation area', image: '/images/birthday/kitchen-tent.jpg' }
    ],
    decor: [
      { name: 'Standard Table Linens', cost: 2000, baseQuantity: 13, scalingRule: 'per_table', description: 'Basic table covers', image: '/images/birthday/table-linens.jpg' },
      { name: 'Simple Centerpieces', cost: 3000, baseQuantity: 13, scalingRule: 'per_table', description: 'Single flower vase', image: '/images/birthday/centerpieces.jpg' },
      { name: 'Spandex Chairs', cost: 70, baseQuantity: 100, scalingRule: 'per_person', description: 'Stretch chair covers', image: '/images/birthday/chair-covers.jpg' }
    ],
    lighting: [
      { name: 'String Light Canopy', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic outdoor lighting', image: '/images/birthday/string-lights.jpg' }
    ],
    signage: [
      { name: 'Welcome Sign', cost: 2000, baseQuantity: 1, scalingRule: 'fixed', description: 'Basic welcome board', image: '/images/birthday/welcome-sign.jpg' }
    ],
    dessert: [
      { name: 'Basic Dessert Table', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Simple dessert display', image: '/images/birthday/dessert-table.jpg' }
    ]
  },
  signature: {
    venue: [
      { name: 'Blines Tent (10x10 Section)', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure', image: '/images/birthday/blines-tent.jpg' },
      { name: 'Premium Food Tent', cost: 3500, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled food area', image: '/images/birthday/food-tent.jpg' },
      { name: 'Premium Kitchen Tent', cost: 3500, baseQuantity: 1, scalingRule: 'fixed', description: 'Professional kitchen setup', image: '/images/birthday/kitchen-tent.jpg' },
      { name: 'Tent Draping & Decor', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant tent draping', image: '/images/birthday/tent-draping.jpg' }
    ],
    decor: [
      { name: 'Premium Table Linens + Runners', cost: 5000, baseQuantity: 13, scalingRule: 'per_table', description: 'Luxury table covers', image: '/images/birthday/premium-linens.jpg' },
      { name: 'Floral Centerpieces', cost: 8000, baseQuantity: 13, scalingRule: 'per_table', description: 'Fresh flower arrangements', image: '/images/birthday/floral-centerpieces.jpg' },
      { name: 'Chiavari Chairs', cost: 150, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant chiavari chairs', image: '/images/birthday/chiavari-chairs.jpg' },
      { name: 'Premium Chair Covers', cost: 100, baseQuantity: 100, scalingRule: 'per_person', description: 'Luxury chair covers', image: '/images/birthday/premium-chair-covers.jpg' }
    ],
    lighting: [
      { name: 'LED Uplighting (8 lights)', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Color-changing uplights', image: '/images/birthday/led-uplighting.jpg' },
      { name: 'Fairy Light Canopy', cost: 10000, baseQuantity: 1, scalingRule: 'fixed', description: 'Magical light ceiling', image: '/images/birthday/fairy-light-canopy.jpg' }
    ],
    signage: [
      { name: 'Custom Acrylic Sign', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Personalized acrylic sign', image: '/images/birthday/acrylic-sign.jpg' },
      { name: 'LED Letter Sign', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Glowing letter display', image: '/images/birthday/led-letter-sign.jpg' }
    ],
    dessert: [
      { name: 'Premium Dessert Table', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Styled dessert display', image: '/images/birthday/premium-dessert.jpg' },
      { name: 'Cake Display Stand', cost: 3000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elevated cake stand', image: '/images/birthday/cake-stand.jpg' }
    ]
  },
  luxury: {
    venue: [
      { name: 'A-Frame Luxury Tent (2 Sections)', cost: 70000, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium tent structure', image: '/images/birthday/aframe-tent.jpg' },
      { name: 'Premium Food A-Frame', cost: 4500, baseQuantity: 1, scalingRule: 'fixed', description: 'Luxury food area', image: '/images/birthday/food-tent.jpg' },
      { name: 'Premium Kitchen A-Frame', cost: 4500, baseQuantity: 1, scalingRule: 'fixed', description: 'Premium kitchen setup', image: '/images/birthday/kitchen-tent.jpg' },
      { name: 'Full Ceiling Draping', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Complete ceiling transformation', image: '/images/birthday/ceiling-draping.jpg' }
    ],
    decor: [
      { name: 'Luxury Sequin + Velvet Linens', cost: 10000, baseQuantity: 13, scalingRule: 'per_table', description: 'Premium table covers', image: '/images/birthday/luxury-linens.jpg' },
      { name: 'Premium Floral Installations', cost: 18000, baseQuantity: 13, scalingRule: 'per_table', description: 'Designer flower arrangements', image: '/images/birthday/premium-florals.jpg' },
      { name: 'Cross Back Chairs', cost: 250, baseQuantity: 100, scalingRule: 'per_person', description: 'Elegant cross back chairs', image: '/images/birthday/cross-back-chairs.jpg' },
      { name: 'Luxury Lounge Furniture', cost: 500, baseQuantity: 4, scalingRule: 'per_person', description: 'Comfortable lounge seating', image: '/images/birthday/lounge-furniture.jpg' },
      { name: 'Balloon Garland Installation', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Organic balloon garland', image: '/images/birthday/balloon-garland.jpg' }
    ],
    lighting: [
      { name: 'Premium Lighting + Uplighting', cost: 30000, baseQuantity: 1, scalingRule: 'fixed', description: 'Advanced lighting system', image: '/images/birthday/premium-lighting.jpg' },
      { name: 'Crystal Chandeliers', cost: 20000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant hanging chandeliers', image: '/images/birthday/chandeliers.jpg' },
      { name: 'LED Dance Floor', cost: 25000, baseQuantity: 1, scalingRule: 'fixed', description: 'Interactive LED floor', image: '/images/birthday/led-dance-floor.jpg' }
    ],
    signage: [
      { name: 'Neon Name Sign', cost: 18000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom neon name sign', image: '/images/birthday/neon-name-sign.jpg' },
      { name: 'Welcome Light Box', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Illuminated welcome sign', image: '/images/birthday/light-box.jpg' },
      { name: 'Directional Signs', cost: 5000, baseQuantity: 1, scalingRule: 'fixed', description: 'Custom wayfinding signs', image: '/images/birthday/directional-signs.jpg' }
    ],
    dessert: [
      { name: 'Champagne Tower Display', cost: 15000, baseQuantity: 1, scalingRule: 'fixed', description: 'Elegant champagne tower', image: '/images/birthday/champagne-tower.jpg' },
      { name: 'Grazing Table Styling', cost: 12000, baseQuantity: 1, scalingRule: 'fixed', description: 'Beautiful grazing display', image: '/images/birthday/grazing-table.jpg' },
      { name: 'Candy Buffet', cost: 8000, baseQuantity: 1, scalingRule: 'fixed', description: 'Colorful candy display', image: '/images/birthday/candy-buffet.jpg' }
    ]
  }
}

// Tables (shared across all venues)
const tableOptions = {
  essential: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests', image: '/images/birthday/round-table.jpg' }
  ],
  signature: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests', image: '/images/birthday/round-table.jpg' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 5, scalingRule: 'per_table', description: 'Seats 10-12 guests', image: '/images/birthday/rectangle-table.jpg' }
  ],
  luxury: [
    { name: 'Round Tables (60")', cost: 500, baseQuantity: 13, scalingRule: 'per_table', description: 'Seats 8-10 guests', image: '/images/birthday/round-table.jpg' },
    { name: 'Rectangle Tables (8ft)', cost: 600, baseQuantity: 8, scalingRule: 'per_table', description: 'Seats 10-12 guests', image: '/images/birthday/rectangle-table.jpg' },
    { name: 'Sweetheart Table', cost: 800, baseQuantity: 1, scalingRule: 'fixed', description: 'Special table for guest of honor', image: '/images/birthday/sweetheart-table.jpg' }
  ]
}

// Add-ons (shared across all tiers)
const addOns = [
  { id: 'balloon-arch', name: 'Organic Balloon Arch', price: 15000, icon: Balloon, description: '10ft custom balloon arch', category: 'decor', image: '/images/birthday/balloon-arch.jpg' },
  { id: 'photo-booth', name: 'Photo Booth Experience', price: 12000, icon: Camera, description: 'Backdrop + props + instant prints', category: 'entertainment', image: '/images/birthday/photo-booth.jpg' },
  { id: 'live-dj', name: 'Professional DJ', price: 25000, icon: Music, description: 'Sound system + lighting + MC', category: 'entertainment', image: '/images/birthday/dj.jpg' },
  { id: 'champagne-wall', name: 'Champagne Wall', price: 15000, icon: Wine, description: '50 glasses + bubbly + LED lighting', category: 'premium', image: '/images/birthday/champagne-wall.jpg' },
  { id: 'dessert-table', name: 'Dessert Table Styling', price: 10000, icon: Cake, description: 'Custom dessert display', category: 'decor', image: '/images/birthday/dessert-table.jpg' },
  { id: 'party-favors', name: 'Custom Party Favors', price: 7500, icon: Gift, description: 'Personalized favors for 25 guests', category: 'premium', image: '/images/birthday/party-favors.jpg' },
  { id: 'neon-sign', name: 'Custom Neon Sign', price: 18000, icon: Sparkles, description: 'Name/age custom neon sign', category: 'signage', image: '/images/birthday/neon-sign.jpg' },
  { id: 'fireworks', name: 'Fireworks Display', price: 45000, icon: PartyPopper, description: '5-minute outdoor show', category: 'premium', image: '/images/birthday/fireworks.jpg' }
]

// Scaling factors for guest count (updated: 30 to 100)
const scalingFactors = [
  { pax: 30, multiplier: 0.5 },
  { pax: 40, multiplier: 0.6 },
  { pax: 50, multiplier: 0.7 },
  { pax: 60, multiplier: 0.8 },
  { pax: 70, multiplier: 0.9 },
  { pax: 80, multiplier: 1.0 },
  { pax: 90, multiplier: 1.1 },
  { pax: 100, multiplier: 1.2 }
]

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

// ─── Item With Image Component (like wedding quote) ───────────────────────────
function ItemWithImage({ item, scaledQuantity, scaledUnitPrice, showUnitPrice, itemTotal, onImageClick }: { 
  item: any; 
  scaledQuantity: number; 
  scaledUnitPrice: number; 
  showUnitPrice: boolean; 
  itemTotal: number;
  onImageClick: (imageUrl: string, itemName: string) => void;
}) {
  const imageUrl = item.image || getItemImage(item.name)
  
  return (
    <div className="flex items-center gap-3 py-2 border-b border-foreground/5 last:border-0">
      {/* Image thumbnail */}
      <button
        onClick={() => onImageClick(imageUrl, item.name)}
        className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 group cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
      >
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/birthday/placeholder.jpg'
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ImageIcon size={14} className="text-white" />
        </div>
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-amber-500">
            {scaledQuantity}×
          </span>
          <p className="text-[11px] leading-tight font-medium text-foreground truncate">
            {item.name}
          </p>
        </div>
        {showUnitPrice && (
          <p className="text-[8px] text-foreground/40 mt-0.5">
            {scaledUnitPrice.toLocaleString()} each
          </p>
        )}
        <p className="text-[7px] text-foreground/30 mt-0.5 line-clamp-1">
          {item.description}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-mono whitespace-nowrap font-bold text-foreground">
          KES {itemTotal.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

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

const calculateTierTotal = (items: any[], pax: number, multiplier: number) => {
  return items.reduce((sum, item) => sum + getItemTotal(item, pax, multiplier), 0)
}

export default function BirthdayQuoteClient() {
  const [pax, setPax] = useState<number>(80)
  const [venue, setVenue] = useState<VenueType>('indoor')
  const [activeTier, setActiveTier] = useState<TierType | null>('signature')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedTier, setSelectedTier] = useState<TierType | null>('signature')
  const [showEmail, setShowEmail] = useState(false)
  const [emailAddr, setEmailAddr] = useState('')
  const [sending, setSending] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventDate: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null)

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

  const multiplier = getMultiplier(pax)
  const tiers: TierType[] = ['essential', 'signature', 'luxury']

  const getVenueItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorItems[tier] : outdoorItems[tier]
    const tables = tableOptions[tier]
    const allItems = Object.values(venueItems).flat()
    return [...allItems, ...tables]
  }

  const getGroupedItems = (tier: TierType) => {
    const venueItems = venue === 'indoor' ? indoorItems[tier] : outdoorItems[tier]
    const tables = tableOptions[tier]
    
    const grouped: Record<string, any[]> = {}
    
    categories.forEach(cat => {
      if (venueItems[cat.id as keyof typeof venueItems]) {
        grouped[cat.name] = venueItems[cat.id as keyof typeof venueItems]
      }
    })
    
    if (tables.length > 0) {
      grouped['Table Settings'] = tables
    }
    
    return grouped
  }

  const getTierTotal = (tier: TierType) => {
    const items = getVenueItems(tier)
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

  const activeTotal = selectedTier ? getGrandTotal(selectedTier) : 0

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

  const saveQuoteToLocalStorage = (tier: TierType) => {
    const total = getGrandTotal(tier)
    const quoteData = {
      id: Date.now(),
      tier: TIER_CONFIG[tier].label,
      total,
      pax,
      venue,
      date: new Date().toISOString(),
    }
    const saved = JSON.parse(localStorage.getItem('savedBirthdayQuotes') || '[]')
    saved.push(quoteData)
    localStorage.setItem('savedBirthdayQuotes', JSON.stringify(saved))
    toast.success(`${TIER_CONFIG[tier].label} quote saved!`)
  }

  const sendQuoteToEmail = async (tier: TierType, email: string) => {
    if (!email || !tier) { toast.error('Please enter your email'); return }
    setSending(true)
    try {
      const total = getGrandTotal(tier)
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          tier: TIER_CONFIG[tier].label, 
          total, 
          pax, 
          venue,
          type: 'birthday',
          date: new Date().toLocaleDateString() 
        }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success(`Quote request sent! We'll contact you within 24 hours.`)
      setShowContactForm(false)
      setIsSubmitting(false)
    }, 1500)
  }

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

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <p className="absolute -bottom-8 left-0 right-0 text-center text-white/60 text-xs">
                {lightboxImage.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                Birthday Quote Engine
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-foreground mb-5">
              Design your{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                birthday vision.
              </span>
              <br />Celebrate in style.
            </h1>

            <p className="text-base text-foreground/55 leading-relaxed mb-7 max-w-md">
              No vague "starting from" numbers. Adjust your guest count and see your exact package price 
              change in real time — live from our actual inventory.
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

          {/* Right: live price display */}
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
                          style={{ background: isSelected ? buttonStyle.borderColor : gold.light }}
                        />
                        <span
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: buttonStyle.color }}
                        >
                          {TIER_CONFIG[tier].label}
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

            {/* Guest count - Updated range 30-100 */}
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
                  <p className="text-[10px] text-foreground/40">Prices update instantly as you move the slider (30-100 guests)</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-end gap-2 mb-4">
                  <span
                    className="text-5xl font-light tabular-nums bg-clip-text text-transparent"
                    style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                  >
                    {pax}
                  </span>
                  <span className="text-foreground/45 text-sm mb-2">guests</span>
                </div>

                <div className="relative mb-4">
                  <input
                    type="range"
                    min={30}
                    max={100}
                    step={10}
                    value={pax}
                    onChange={e => setPax(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${gold.light} 0%, ${gold.light} ${((pax - 30) / 70) * 100}%, rgba(212,175,55,0.15) ${((pax - 30) / 70) * 100}%, rgba(212,175,55,0.15) 100%)`,
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

                <div className="flex flex-wrap gap-2">
                  {scalingFactors.map(f => (
                    <button
                      key={f.pax}
                      onClick={() => setPax(f.pax)}
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
            </div>

            {/* Venue Selector */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: gold.metallic }}
                >
                  <LayoutTemplate size={15} style={{ color: '#1a1400' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Venue Style</p>
                  <p className="text-[10px] text-foreground/40">Choose your celebration setting</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <Tent className={`w-6 h-6 mx-auto mb-2 transition-colors ${
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
                  : ' Tents, lighting, and outdoor decor included'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TIER CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px" style={{ background: gold.metallic }} />
              <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>Choose your package</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">
              Three tiers.{' '}
              <span className="italic" style={{ color: gold.light }}>One perfect celebration.</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/45 max-w-xs leading-relaxed">
            Click any tier to expand the full itemised breakdown. Click images to see larger view.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          {tiers.map((tier, tidx) => {
            const cfg = TIER_CONFIG[tier]
            const total = getTierTotal(tier)
            const isOpen = activeTier === tier
            const isSelected = selectedTier === tier
            const isLuxury = tier === 'luxury'
            const groupedItems = getGroupedItems(tier)
            
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

                      <div className="mb-3">
                        <div className="flex items-baseline gap-1" style={{ color: cfg.text }}>
                          <span className="text-xs opacity-60">KES</span>
                          <span className="text-4xl font-light tabular-nums">
                            <AnimatedPrice value={total} />
                          </span>
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: cfg.sub }}>
                          for {pax} guests · {venue} venue
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

                    <button
                      onClick={() => setActiveTier(isOpen ? null : tier)}
                      className="w-full py-2.5 rounded-full text-[10px] uppercase tracking-widest font-medium border flex items-center justify-center gap-2 transition-all duration-200 hover:bg-foreground/5"
                      style={{ borderColor: gold.border }}
                    >
                      {isOpen ? <><Minus size={11} /> Hide Details</> : <><Plus size={11} /> View Full Breakdown</>}
                    </button>
                  </div>

                  {/* ── Expanded inventory with images ── */}
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
                          {Object.entries(groupedItems).map(([catName, items]) => {
                            const categoryTotal = items.reduce((sum, item) => 
                              sum + getItemTotal(item, pax, multiplier), 0
                            )
                            const isExpanded = isCategoryExpanded(tier, catName)
                            return (
                              <div
                                key={catName}
                                className="rounded-xl border overflow-hidden"
                                style={{ borderColor: gold.border }}
                              >
                                <button
                                  onClick={() => toggleCategory(tier, catName)}
                                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-foreground/3"
                                  style={{ background: gold.glow }}
                                >
                                  <div>
                                    <p className="text-[9px] uppercase tracking-wider text-foreground/35">
                                      {catName}
                                    </p>
                                    <p className="text-xs font-medium text-foreground mt-0.5">
                                      KES {categoryTotal.toLocaleString()}
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
                                        {items.map((item, idx) => {
                                          const quantity = getScaledQuantity(pax, item.scalingRule, item.baseQuantity)
                                          const itemTotal = getItemTotal(item, pax, multiplier)
                                          const unitPrice = item.cost / item.baseQuantity
                                          const scaledUnitPrice = Math.round(unitPrice * multiplier)
                                          const showUnitPrice = item.baseQuantity > 1
                                          
                                          return (
                                            <ItemWithImage
                                              key={idx}
                                              item={item}
                                              scaledQuantity={quantity}
                                              scaledUnitPrice={scaledUnitPrice}
                                              showUnitPrice={showUnitPrice}
                                              itemTotal={itemTotal}
                                              onImageClick={(url, name) => setLightboxImage({ url, title: name })}
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
                              href={`/contact?type=birthday&tier=${tier}&guests=${pax}&venue=${venue}`}
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

      {/* Add-Ons Section with Images */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: gold.border, background: gold.glow }}>
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
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={addon.image}
                      alt={addon.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/birthday/placeholder.jpg'
                      }}
                    />
                  </div>
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
                These three tiers are starting points. Many of our clients customise elements — swapping decor,
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
            <button
              onClick={() => setShowContactForm(true)}
              className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-foreground border transition-all hover:border-amber-500/40"
              style={{ borderColor: gold.border }}
            >
              Request Custom Quote
            </button>
          </div>

          {/* Right: book now */}
          <div
            className="rounded-2xl border p-7 flex flex-col justify-between relative overflow-hidden"
            style={{ borderColor: gold.border }}
          >
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
                    {pax} guests · {venue} venue · Add-ons included
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
                  href={`/contact?type=birthday&tier=${selectedTier || 'signature'}&guests=${pax}&venue=${venue}`}
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

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowContactForm(false)}
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
                        Custom Quote Request
                      </p>
                      <h3 className="text-lg font-light text-foreground">
                        Tell us about your vision
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-foreground/5 transition-colors"
                      style={{ borderColor: gold.border }}
                    >
                      <X size={13} className="text-foreground/50" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-transparent border-b border-foreground/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-transparent border-b border-foreground/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-transparent border-b border-foreground/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="date"
                      name="eventDate"
                      placeholder="Event date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full px-4 py-3 bg-transparent border-b border-foreground/20 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                    <textarea
                      name="message"
                      placeholder="Tell us about your vision, theme, colors, and any special requests..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-transparent border-b border-foreground/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-40"
                      style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Quote Modal */}
        <AnimatePresence>
          {showEmail && selectedTier && (
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

                  <div className="mb-4">
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-3 text-foreground/40">Package</p>
                    <div className="flex gap-2">
                      {tiers.map(tier => {
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
                        KES {getGrandTotal(selectedTier).toLocaleString()} · {pax} guests
                      </p>
                    )}
                  </div>

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

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowEmail(true)}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] uppercase tracking-wider border transition-all hover:bg-white/5 text-white/60"
                  style={{ borderColor: 'rgba(212,175,55,0.25)' }}
                >
                  <Mail size={10} /> Email
                </button>
                <Link
                  href={`/contact?type=birthday&tier=${selectedTier || 'signature'}&guests=${pax}&venue=${venue}`}
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