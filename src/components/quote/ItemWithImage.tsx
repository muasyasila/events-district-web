'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { InventoryItem } from '@/app/actions/inventory'

interface ItemWithImageProps {
  item: InventoryItem
  scaledQuantity: number
  scaledUnitPrice: number
  showUnitPrice: boolean
  itemTotal: number
}

// The main component that combines everything
export default function ItemWithImage({ 
  item, 
  scaledQuantity, 
  scaledUnitPrice, 
  showUnitPrice, 
  itemTotal 
}: ItemWithImageProps) {
  const [showLargeImage, setShowLargeImage] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Calculate popup position when it should show
  useEffect(() => {
    if (showLargeImage && imageRef.current && mounted) {
      const rect = imageRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const popupHeight = 380
      const popupWidth = 288
      
      let top = rect.bottom + 8
      let left = rect.right + 8
      
      // Check if below would go off screen
      if (top + popupHeight > windowHeight) {
        top = rect.top - popupHeight - 8
      }
      
      // Check if right would go off screen
      if (left + popupWidth > windowWidth) {
        left = rect.left - popupWidth - 8
      }
      
      // Keep within bounds
      top = Math.max(8, Math.min(top, windowHeight - popupHeight - 8))
      left = Math.max(8, Math.min(left, windowWidth - popupWidth - 8))
      
      setPopupPosition({ top, left })
    }
  }, [showLargeImage, mounted])

  const getScalingText = () => {
    switch(item.scaling_rule) {
      case 'per_person': return 'Scales with guest count'
      case 'per_table': return 'Scales with number of tables'
      case 'per_car': return 'Scales with number of cars'
      case 'per_maid': return 'Scales with bridal party size'
      case 'fixed': return 'Fixed quantity per event'
      default: return ''
    }
  }

  const handleMouseEnter = () => {
    setShowLargeImage(true)
  }
  
  const handleMouseLeave = () => {
    setShowLargeImage(false)
  }

  return (
    <div className="flex justify-between items-center pl-4 py-2 border-l-2 border-current/20 relative">
      <div className="flex items-start gap-3 flex-1">
        {item.primary_image_url ? (
          <div 
            ref={imageRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-current/20 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src={item.primary_image_url} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-current/20 bg-current/5 flex items-center justify-center">
            <span className="text-[8px] opacity-40">No img</span>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold">
              {scaledQuantity}×
            </span>
            <p className="text-[10px] leading-tight font-medium">
              {item.name}
            </p>
          </div>
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

      {/* Portal Popup - rendered outside the DOM hierarchy */}
      {mounted && showLargeImage && item.primary_image_url && createPortal(
        <div
          className="fixed z-[99999] w-72 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <img 
            src={item.primary_image_url} 
            alt={item.name}
            className="w-full h-52 object-cover"
          />
          <div className="p-4">
            <p className="text-sm font-bold text-gray-800">{item.name}</p>
            <p className="text-[10px] text-gray-500 mt-2">
              ✓ {getScalingText()}
            </p>
            {scaledUnitPrice !== undefined && (
              <p className="text-[11px] font-mono text-gray-600 mt-3 pt-2 border-t border-gray-100">
                {scaledUnitPrice.toLocaleString()} KES per unit
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}