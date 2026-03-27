'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  
  return (
    <>
      {!isAdminPage && <Navigation />}
      <main className={!isAdminPage ? "pt-20" : ""}>
        {children}
      </main>
    </>
  )
}