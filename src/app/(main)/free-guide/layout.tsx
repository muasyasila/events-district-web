import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Wedding Planning Checklist | Events District',
  description: 'Get our complete wedding planning checklist used by 2,400+ couples. 100% free, no hidden paywall.',
}

export default function FreeGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}