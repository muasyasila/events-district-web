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
}

export interface ScalingFactor {
  pax: number
  multiplier: number
}

// Get scaling factors from database
export async function getScalingFactors(): Promise<ScalingFactor[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('scaling_factors')
    .select('*')
    .order('pax', { ascending: true })
  
  if (error) {
    console.error('Error fetching scaling factors:', error)
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
    console.error('Error fetching inventory:', error)
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
    console.error('Error fetching all inventory:', error)
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
    console.error('Error fetching categories:', error)
    return {}
  }
  
  const categoryMap: Record<string, string> = {}
  data?.forEach((cat: { code: string; name: string }) => {
    categoryMap[cat.code] = cat.name
  })
  
  return categoryMap
}