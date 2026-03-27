'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ImagePortalProps {
  isOpen: boolean
  imageUrl: string
  itemName: string
  anchorRef: React.RefObject<HTMLDivElement>
  scaledUnitPrice?: number
  scalingRule?: string
}

export default function ImagePortal({ 
  isOpen, 
  imageUrl, 
  itemName, 
  anchorRef,
  scaledUnitPrice,
  scalingRule
}: ImagePortalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const popupHeight = 380 // Approximate popup height
      const popupWidth = 288 // w-72 = 288px
      
      let top = rect.bottom + 8 // Default: below
      let left = rect.right + 8 // Default: right
      
      // Check if below would go off screen
      if (top + popupHeight > windowHeight) {
        // Show above instead
        top = rect.top - popupHeight - 8
      }
      
      // Check if right would go off screen
      if (left + popupWidth > windowWidth) {
        // Show left instead
        left = rect.left - popupWidth - 8
      }
      
      // Ensure popup stays within viewport
      top = Math.max(8, Math.min(top, windowHeight - popupHeight - 8))
      left = Math.max(8, Math.min(left, windowWidth - popupWidth - 8))
      
      setPosition({ top, left })
    }
  }, [isOpen, anchorRef])

  const getScalingText = () => {
    switch(scalingRule) {
      case 'per_person': return 'Scales with guest count'
      case 'per_table': return 'Scales with number of tables'
      case 'per_car': return 'Scales with number of cars'
      case 'per_maid': return 'Scales with bridal party size'
      case 'fixed': return 'Fixed quantity per event'
      default: return ''
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed z-[99999] w-72 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <img 
        src={imageUrl} 
        alt={itemName}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <p className="text-sm font-bold text-gray-800">{itemName}</p>
        <p className="text-[10px] text-gray-500 mt-2">
          ✓ {getScalingText()}
        </p>
        {scaledUnitPrice && (
          <p className="text-[11px] font-mono text-gray-600 mt-3 pt-2 border-t border-gray-100">
            {scaledUnitPrice.toLocaleString()} KES per unit
          </p>
        )}
      </div>
    </div>,
    document.body
  )
}