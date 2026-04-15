'use client'

import { useState } from 'react'
import HeroSlidesManager from '@/components/admin/HeroSlidesManager'
import TestimonialsManager from '@/components/admin/TestimonialsManager'
import { LayoutGrid, Users, Image as ImageIcon, Settings, Menu, X } from 'lucide-react'

const tabs = [
  { id: 'hero', label: 'Hero Slides', icon: LayoutGrid, description: 'Manage your homepage carousel slides' },
  { id: 'testimonials', label: 'Testimonials', icon: Users, description: 'Manage client reviews and feedback' },
]

export default function MediaManagementPage() {
  const [activeTab, setActiveTab] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Content Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                Manage hero slides, testimonials, and site content
              </p>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation - Desktop */}
        <div className="hidden lg:flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-t-lg font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600'
                }
              `}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'group-hover:text-amber-500'}`} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Navigation - Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-l-4 border-amber-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tab Indicators - Mobile Chips */}
        <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 sm:p-6">
            {activeTab === 'hero' && <HeroSlidesManager />}
            {activeTab === 'testimonials' && <TestimonialsManager />}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-amber-500">✓</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hero Slides</div>
            <div className="text-xs text-gray-500">Drag to reorder</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-amber-500">✓</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Testimonials</div>
            <div className="text-xs text-gray-500">Upload avatars</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-amber-500">📷</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Image Upload</div>
            <div className="text-xs text-gray-500">JPG, PNG, WebP</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-amber-500">🔄</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Live Updates</div>
            <div className="text-xs text-gray-500">Changes appear instantly</div>
          </div>
        </div>
      </div>
    </div>
  )
}