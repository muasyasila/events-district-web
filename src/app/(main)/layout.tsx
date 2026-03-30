// src/app/(main)/layout.tsx
import Navigation from '@/components/Navigation'
import LuxuryFooter from '@/components/sections/LuxuryFooter'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        {children}
      </main>
      <LuxuryFooter />
    </>
  )
}