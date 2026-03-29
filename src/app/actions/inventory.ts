'use server'

import { createClient } from '@/lib/supabase/server'

export type SetupType = 'theater' | 'restaurant'
export type TierType = 'essential' | 'signature' | 'luxury'
export type ScalingRule = 'per_person' | 'per_table' | 'fixed' | 'per_car' | 'per_maid'

export interface InventoryItem {
  id: string
  name: string
  category_code: string
  setup_type: SetupType
  tier: TierType
  base_cost: number
  scaling_rule: ScalingRule
  base_quantity: number
  primary_image_url: string | null
  image_alt_text: string | null
  is_active: boolean
  sort_order: number
}

export interface ScalingFactor {
  pax: number
  multiplier: number
}

// Helper function to calculate scaled quantity based on rule
function getScaledQuantity(
  pax: number,
  rule: ScalingRule,
  baseQuantity: number,
  itemName: string
): number {
  switch (rule) {
    case 'per_person':
      return Math.ceil((pax / 100) * baseQuantity)
    case 'per_table':
      const tablesNeeded = Math.ceil(pax / 8)
      return tablesNeeded
    case 'per_car':
      const carMultiplier = Math.ceil(pax / 100)
      return Math.min(baseQuantity * carMultiplier, 50)
    case 'per_maid':
      const maidMultiplier = Math.ceil(pax / 100)
      return Math.min(baseQuantity * maidMultiplier, 12)
    case 'fixed':
    default:
      return baseQuantity
  }
}

// Get scaling factors from database
export async function getScalingFactors(): Promise<ScalingFactor[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('scaling_factors')
    .select('*')
    .order('pax', { ascending: true })
  
  if (error) {
    console.error('Error fetching scaling factors:', error.message)
    return []
  }
  
  return data || []
}

// Get inventory items for a specific setup and tier
export async function getInventoryItems(
  setup: SetupType, 
  tier: TierType
): Promise<InventoryItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('setup_type', setup)
    .eq('tier', tier)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching inventory:', error.message)
    return []
  }
  
  return data || []
}

// Get all inventory for a setup (all tiers)
export async function getAllInventoryForSetup(setup: SetupType): Promise<Record<TierType, InventoryItem[]>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('setup_type', setup)
    .eq('is_active', true)
  
  if (error) {
    console.error('Error fetching all inventory:', error.message)
    return { essential: [], signature: [], luxury: [] }
  }
  
  // Group by tier
  const grouped = {
    essential: data?.filter((item: InventoryItem) => item.tier === 'essential') || [],
    signature: data?.filter((item: InventoryItem) => item.tier === 'signature') || [],
    luxury: data?.filter((item: InventoryItem) => item.tier === 'luxury') || []
  }
  
  return grouped
}

// Get category names
export async function getCategoryNames(): Promise<Record<string, string>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('code, name')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching categories:', error.message)
    return {}
  }
  
  const categoryMap: Record<string, string> = {}
  data?.forEach((cat: { code: string; name: string }) => {
    categoryMap[cat.code] = cat.name
  })
  
  return categoryMap
}

// Get tier total for a specific setup and tier at given guest count
export async function getTierTotals(setup: SetupType, tier: TierType, pax: number): Promise<number> {
  const supabase = await createClient()
  
  // Get all items for this setup and tier
  const { data: items, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('setup_type', setup)
    .eq('tier', tier)
    .eq('is_active', true)
  
  if (error || !items) {
    console.error('Error fetching items for tier total:', error)
    return 0
  }
  
  // Get scaling factors
  const { data: scalingFactors, error: scaleError } = await supabase
    .from('scaling_factors')
    .select('*')
  
  if (scaleError || !scalingFactors) {
    console.error('Error fetching scaling factors:', scaleError)
    return 0
  }
  
  const multiplier = scalingFactors.find(f => f.pax === pax)?.multiplier || 1.0
  
  // Calculate total
  let total = 0
  for (const item of items) {
    const scaledQuantity = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name)
    const unitPrice = item.base_cost / item.base_quantity
    const scaledUnitPrice = unitPrice * multiplier
    total += Math.round(scaledUnitPrice * scaledQuantity)
  }
  
  return total
}