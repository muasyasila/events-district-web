export type ScalingRule = 'per_person' | 'per_table' | 'fixed' | 'per_car' | 'per_maid'

export interface InventoryItemWithScaling {
  base_cost: number
  base_quantity: number
  scaling_rule: ScalingRule
  name?: string
  category_code?: string
}

// Get the multiplier for a given guest count
export function getMultiplier(pax: number, scalingFactors: Array<{ pax: number; multiplier: number }>): number {
  const factor = scalingFactors.find(f => f.pax === pax)
  return factor?.multiplier || 1.0
}

// Calculate scaled quantity based on rule
export function getScaledQuantity(
  pax: number,
  rule: ScalingRule,
  baseQuantity: number,
  itemName: string
): number {
  switch (rule) {
    case 'per_person':
      // Items like chairs, napkins, tiebacks
      return Math.ceil((pax / 100) * baseQuantity)
    
    case 'per_table':
      // Tables and centerpieces (assuming 8 guests per table)
      const tablesNeeded = Math.ceil(pax / 8)
      return tablesNeeded
    
    case 'per_car':
      // Car decorations - scale with guest count but cap at 50
      const carMultiplier = Math.ceil(pax / 100)
      return Math.min(baseQuantity * carMultiplier, 50)
    
    case 'per_maid':
      // Bouquets for bridal party
      const maidMultiplier = Math.ceil(pax / 100)
      return Math.min(baseQuantity * maidMultiplier, 12)
    
    case 'fixed':
    default:
      return baseQuantity
  }
}

// Calculate total cost for an item
export function getItemTotalCost(
  item: InventoryItemWithScaling,
  pax: number,
  multiplier: number
): number {
  const scaledQuantity = getScaledQuantity(pax, item.scaling_rule, item.base_quantity, item.name || '')
  // Unit price = base_cost / base_quantity
  const unitPrice = item.base_cost / item.base_quantity
  // Apply guest count multiplier to unit price
  const scaledUnitPrice = unitPrice * multiplier
  // Total = scaled unit price × scaled quantity
  return Math.round(scaledUnitPrice * scaledQuantity)
}

// Calculate total for an entire tier
export function calculateTierTotal(
  items: InventoryItemWithScaling[],
  pax: number,
  multiplier: number
): number {
  return items.reduce((total, item) => {
    return total + getItemTotalCost(item, pax, multiplier)
  }, 0)
}

// Group items by category
export function groupItemsByCategory<T extends { category_code: string }>(
  items: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}
  
  items.forEach(item => {
    if (!grouped[item.category_code]) {
      grouped[item.category_code] = []
    }
    grouped[item.category_code].push(item)
  })
  
  return grouped
}

// Calculate category totals
export function getCategoryTotals(
  items: InventoryItemWithScaling[],
  pax: number,
  multiplier: number
): Record<string, number> {
  const totals: Record<string, number> = {}
  
  items.forEach(item => {
    if (item.category_code) {
      const itemTotal = getItemTotalCost(item, pax, multiplier)
      totals[item.category_code] = (totals[item.category_code] || 0) + itemTotal
    }
  })
  
  return totals
}