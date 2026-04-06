'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Package, FileText, Users, LogOut, Menu, X, LayoutGrid, Tag } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/inventory', label: 'Inventory', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { href: '/admin/blog/authors', label: 'Authors', icon: Users },
    { href: '/admin/blog/categories', label: 'Blog Categories', icon: FileText },
    { href: '/admin/leads', label: 'Leads', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile menu button - repositioned to top-3 left-3 with smaller icon */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-black border border-white/10 rounded text-white"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar - added overflow-y-auto for scrolling on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-black tracking-tighter text-white">Events District</h1>
          <p className="text-xs text-white/40 mt-1">Admin Portal</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content - adjusted padding for mobile */}
      <main className="lg:ml-64 min-h-screen bg-[#0A0A0A]">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}