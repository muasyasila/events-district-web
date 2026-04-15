'use client'

import { useState, useEffect } from 'react'
import AdminImageUploader from './AdminImageUploader'
import { Plus, Edit2, Trash2, GripVertical, X, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  category: string
  image_url: string
  order_index: number
  is_active: boolean
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    const response = await fetch('/api/admin/hero')
    const data = await response.json()
    setSlides(data)
    setLoading(false)
  }

  const handleSave = async (slide: Partial<HeroSlide>) => {
    const method = slide.id ? 'PUT' : 'POST'
    const response = await fetch('/api/admin/hero', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide)
    })
    
    if (response.ok) {
      toast.success(`Slide ${slide.id ? 'updated' : 'created'} successfully`)
      fetchSlides()
      setIsModalOpen(false)
      setEditingSlide(null)
    } else {
      toast.error('Failed to save slide')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      const response = await fetch(`/api/admin/hero?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Slide deleted')
        fetchSlides()
      } else {
        toast.error('Failed to delete slide')
      }
    }
  }

  const toggleActive = async (id: number, currentStatus: boolean) => {
    const response = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentStatus })
    })
    
    if (response.ok) {
      toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchSlides()
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return
    
    const items = Array.from(slides)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    const updatedItems = items.map((item, index) => ({ ...item, order_index: index }))
    setSlides(updatedItems)
    
    for (const item of updatedItems) {
      await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, order_index: item.order_index })
      })
    }
    
    toast.success('Order updated')
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Hero Slides</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Drag the ⋮⋮ icon to reorder, click edit to modify</p>
        </div>
        <button
          onClick={() => {
            setEditingSlide(null)
            setIsModalOpen(true)
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add New Slide
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-4 hover:shadow-md"
                    >
                      <div {...provided.dragHandleProps} className="cursor-move">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {slide.image_url ? (
                          <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{slide.title} {slide.subtitle}</h3>
                          {!slide.is_active && <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Inactive</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{slide.description}</p>
                        <p className="text-xs text-amber-500 mt-1 truncate font-medium">{slide.category || 'No category set'}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(slide.id, slide.is_active)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          {slide.is_active ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => { setEditingSlide(slide); setIsModalOpen(true) }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(slide.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <SlideModal slide={editingSlide} onSave={handleSave} onClose={() => { setIsModalOpen(false); setEditingSlide(null) }} />
      )}
    </div>
  )
}

function SlideModal({ slide, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    id: slide?.id,
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    cta_text: slide?.cta_text || 'Explore Collections',
    cta_link: slide?.cta_link || '/portfolio',
    category: slide?.category || 'Wedding • Corporate • Private',
    image_url: slide?.image_url || '',
    is_active: slide?.is_active ?? true
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">{slide ? 'Edit Slide' : 'Create New Slide'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Hero Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Hero Image</label>
            <AdminImageUploader bucket="hero-images" onUploadComplete={(url) => setFormData({ ...formData, image_url: url })} existingImage={formData.image_url} />
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400">📷 Image Tips:</p>
              <ul className="text-xs text-amber-600 dark:text-amber-500 mt-1 space-y-0.5 list-disc list-inside">
                <li>Recommended size: 1920x1080px (16:9 ratio)</li>
                <li>Max file size: 5MB</li>
                <li>Formats: JPG, PNG, WebP, AVIF</li>
                <li>Will be optimized automatically by Next.js</li>
              </ul>
            </div>
          </div>
          
          {/* Title & Subtitle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" required />
              <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-[10px] text-blue-600 dark:text-blue-400">💡 Title Guidelines:</p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Keep to 1 word (e.g., "MODERN", "BESPOKE", "LUXURY") for best visual appearance on the hero section.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" required />
              <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-[10px] text-blue-600 dark:text-blue-400">💡 Subtitle Guidelines:</p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Keep to 1 word (e.g., "Aesthetics", "Curation", "Events") for clean typography.</p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" required />
            <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-600 dark:text-blue-400">📝 Description Guidelines:</p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Aim for 100-150 characters. Keep it impactful and concise. Example: "Clean lines. Bold statements. Unforgettable atmospheres that redefine contemporary elegance."</p>
            </div>
          </div>
          
          {/* CTA Button & Link - IMPROVED HELPFUL TIPS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">✨ Button Text</label>
              <input type="text" value={formData.cta_text} onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
              <div className="mt-1 p-1.5 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                <p className="text-[10px] text-purple-600 dark:text-purple-400">🎯 What to put here?</p>
                <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-0.5">This is the text visitors see and click. Examples: "Explore Collections", "Begin Your Journey", "View Signature Events". Make it action-driven and inviting!</p>
                <p className="text-[10px] text-purple-400 dark:text-purple-500 mt-0.5 italic">💡 Pro tip: Keep it 2-3 words for best button appearance.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🔗 Button Link</label>
              <input type="text" value={formData.cta_link} onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
              <div className="mt-1 p-1.5 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                <p className="text-[10px] text-purple-600 dark:text-purple-400">📍 Where does it go?</p>
                <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-0.5">This is where visitors go when they click. Examples: "/portfolio", "/contact", "/services", "/quote". Use internal paths starting with "/".</p>
                <p className="text-[10px] text-purple-400 dark:text-purple-500 mt-0.5 italic">💡 Pro tip: Test your links after saving to ensure they work!</p>
              </div>
            </div>
          </div>
          
          {/* CATEGORY TAGS - With comprehensive guidelines */}
          <div>
            <label className="block text-sm font-medium mb-1">
              🏷️ Category Tags <span className="text-amber-500">✨ Shows on your hero section</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="Wedding • Corporate • Private"
            />
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">🎯 How to Use Category Tags:</p>
              <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-1 list-disc list-inside">
                <li>Use <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded"> • </span> (space • space) to separate categories</li>
                <li>Examples: <span className="font-mono">"Wedding • Corporate • Private"</span> or <span className="font-mono">"Custom • Personalized • Exclusive"</span></li>
                <li>The FIRST category (before the first •) shows on mobile devices</li>
                <li>The FULL text shows on desktop and tablets</li>
                <li>You can use 1, 2, 3, or more categories - whatever fits your brand</li>
              </ul>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              id="is_active"
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm">✅ Active (visible on website)</label>
          </div>
          
          {/* Summary Box - Shows preview of how it will look */}
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">📱 Live Preview (how it appears on frontend):</p>
            <div className="space-y-1">
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                <span className="font-medium">📱 Mobile category:</span> {formData.category.split('•')[0].trim() || 'First category'}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                <span className="font-medium">💻 Desktop category:</span> {formData.category || 'Full category text'}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                <span className="font-medium">✨ Headline:</span> {formData.title} {formData.subtitle}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                <span className="font-medium">📝 Description length:</span> {formData.description.length} characters {formData.description.length > 150 ? '⚠️ Consider shortening for better mobile view' : '✅ Good length'}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                <span className="font-medium">🔘 Button:</span> "{formData.cta_text}" → {formData.cta_link}
              </p>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200">
            <Save className="w-4 h-4" /> Save Slide
          </button>
        </div>
      </div>
    </div>
  )
}