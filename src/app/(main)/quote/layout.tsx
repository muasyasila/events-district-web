// src/app/(main)/quote/layout.tsx
import WeddingPageTracker from '@/components/WeddingPageTracker'

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WeddingPageTracker />
      {children}
    </>
  )
}