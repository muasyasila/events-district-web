"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'


export default function WeddingPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Mark this session as having shown wedding intent
    sessionStorage.setItem('hasWeddingIntent', 'true')
    // Also record which page triggered it for analytics
    sessionStorage.setItem('weddingIntentSource', pathname || 'unknown')
  }, [pathname])

  return null
}
