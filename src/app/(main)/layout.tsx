import Navigation from '@/components/Navigation'
import LuxuryFooter from '@/components/sections/LuxuryFooter'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import FloatingActions from '@/components/FloatingActions'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main>
        {children}
      </main>
      <LuxuryFooter />
      <ExitIntentPopup />
      <FloatingActions />
    </>
  )
}