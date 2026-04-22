import { getInventoryItems, getScalingFactors, getCategoryNames } from '@/app/actions/inventory'
import { getMultiplier, groupItemsByCategory, calculateTierTotal, getItemTotalCost, getScaledQuantity } from '@/lib/utils/scaling'
import QuoteEngineClient from './QuoteEngineClient'

interface QuoteEngineServerProps {
  initialPax?: number
  initialSetup?: 'theater' | 'restaurant'
}

export default async function QuoteEngineServer({ 
  initialPax = 100,
  initialSetup = 'theater' 
}: QuoteEngineServerProps) {
  // Fetch all data from database
  const [scalingFactors, categoryNames, essentialTheater, signatureTheater, luxuryTheater] = await Promise.all([
    getScalingFactors(),
    getCategoryNames(),
    getInventoryItems('theater', 'essential'),
    getInventoryItems('theater', 'signature'),
    getInventoryItems('theater', 'luxury'),
  ])
  
  // Group items by category for each tier
  const theaterInventory = {
    essential: groupItemsByCategory(essentialTheater),
    signature: groupItemsByCategory(signatureTheater),
    luxury: groupItemsByCategory(luxuryTheater),
  }
  
  // Fetch restaurant data
  const [essentialRestaurant, signatureRestaurant, luxuryRestaurant] = await Promise.all([
    getInventoryItems('restaurant', 'essential'),
    getInventoryItems('restaurant', 'signature'),
    getInventoryItems('restaurant', 'luxury'),
  ])
  
  const restaurantInventory = {
    essential: groupItemsByCategory(essentialRestaurant),
    signature: groupItemsByCategory(signatureRestaurant),
    luxury: groupItemsByCategory(luxuryRestaurant),
  }
  
  return (
    <QuoteEngineClient
      initialPax={initialPax}
      initialSetup={initialSetup}
      scalingFactors={scalingFactors}
      categoryNames={categoryNames}
      theaterInventory={theaterInventory}
      restaurantInventory={restaurantInventory}
    />
  )
}