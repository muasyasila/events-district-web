'use client'

import { useState, useEffect } from 'react'
import AdminImageUploader from './AdminImageUploader'
import { Plus, Edit2, Trash2, Star, X, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar_url: string
  order_index: number
  is_active: boolean
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setTestimonials(data)
      } else if (data.data && Array.isArray(data.data)) {
        setTestimonials(data.data)
      } else if (data.error) {
        console.error('API Error:', data.error)
        toast.error('Failed to load testimonials')
        setTestimonials([])
      } else {
        console.error('Unexpected data format:', data)
        setTestimonials([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load testimonials')
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (testimonial: Partial<Testimonial>) => {
    const method = testimonial.id ? 'PUT' : 'POST'
    const response = await fetch('/api/admin/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial)
    })
    
    if (response.ok) {
      toast.success(`Testimonial ${testimonial.id ? 'updated' : 'added'} successfully`)
      fetchTestimonials()
      setIsModalOpen(false)
      setEditingItem(null)
    } else {
      const error = await response.json()
      toast.error(error.error || 'Failed to save testimonial')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Testimonial deleted')
        fetchTestimonials()
      } else {
        toast.error('Failed to delete testimonial')
      }
    }
  }

  const toggleActive = async (id: number, currentStatus: boolean) => {
    const response = await fetch('/api/admin/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentStatus })
    })
    
    if (response.ok) {
      toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchTestimonials()
    } else {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading testimonials...</div>

  if (!Array.isArray(testimonials)) {
    console.error('Testimonials is not an array:', testimonials)
    return <div className="p-8 text-center text-red-500">Error loading testimonials. Please refresh the page.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage client reviews, ratings, and avatar images</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setIsModalOpen(true) }}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No testimonials yet. Click "Add Testimonial" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-900 rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Avatar with circle preview - shows how it will look on frontend */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 ring-2 ring-amber-500/30">
                    {testimonial.avatar_url ? (
                      <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                        No img
                      </div>
                    )}
                  </div>
                  {/* Gold ring indicator for active */}
                  {testimonial.is_active && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => toggleActive(testimonial.id, testimonial.is_active)} 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title={testimonial.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {testimonial.is_active ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button 
                        onClick={() => { setEditingItem(testimonial); setIsModalOpen(true) }} 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-amber-500" />
                      </button>
                      <button 
                        onClick={() => handleDelete(testimonial.id)} 
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2 italic">"{testimonial.content}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <TestimonialModal testimonial={editingItem} onSave={handleSave} onClose={() => { setIsModalOpen(false); setEditingItem(null) }} />
      )}
    </div>
  )
}

function TestimonialModal({ testimonial, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    id: testimonial?.id,
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    avatar_url: testimonial?.avatar_url || '',
    is_active: testimonial?.is_active ?? true
  })

  // Preview the avatar in a circle to show how it will look on frontend
  const avatarPreview = formData.avatar_url || null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Avatar Image Upload with Circle Preview */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              👤 Avatar Image <span className="text-amber-500">*Shows as circle on website</span>
            </label>
            
            {/* Circle Preview - Shows how it will look on frontend */}
            {avatarPreview && (
              <div className="mb-3 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-amber-500/30 shadow-lg">
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  <p className="text-[10px] text-center mt-2 text-gray-500">How it appears on website</p>
                </div>
              </div>
            )}
            
            <AdminImageUploader 
              bucket="testimonials" 
              onUploadComplete={(url) => setFormData({ ...formData, avatar_url: url })} 
              existingImage={formData.avatar_url} 
            />
            
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400">📷 Image Tips:</p>
              <ul className="text-xs text-amber-600 dark:text-amber-500 mt-1 space-y-0.5 list-disc list-inside">
                <li>Recommended size: 200x200px (square)</li>
                <li>Max file size: 2MB</li>
                <li>Formats: JPG, PNG, WebP</li>
                <li>Image will be automatically cropped into a circle</li>
                <li>For best results, use a square, high-resolution photo</li>
              </ul>
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">✨ Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
              required 
            />
            <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-600 dark:text-blue-400">💡 Name Guidelines:</p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Use full name (e.g., "Victoria Hamilton" or "Amara &amp; Kofi Mensah") for authenticity.</p>
            </div>
          </div>
          
          {/* Role/Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">🎭 Role/Title</label>
            <input 
              type="text" 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
              required 
            />
            <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-600 dark:text-blue-400">💡 Role Guidelines:</p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Examples: "Bride & Groom", "Head of Marketing", "Private Client", "Family"</p>
            </div>
          </div>
          
          {/* Testimonial Content */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">📝 Testimonial Content</label>
            <textarea 
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              rows={3} 
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
              required 
            />
            <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-600 dark:text-blue-400">📝 Testimonial Guidelines:</p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Aim for 150-300 characters. Keep it authentic and impactful. Longer testimonials work well too!</p>
              <p className="text-[10px] text-blue-400 dark:text-blue-500 mt-0.5 italic">Current length: {formData.content.length} characters</p>
            </div>
          </div>
          
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">⭐ Rating (1-5 stars)</label>
            <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setFormData({ ...formData, rating: star })} 
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 transition-all ${star <= formData.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
                </button>
              ))}
            </div>
            <div className="mt-2 p-1.5 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
              <p className="text-[10px] text-purple-600 dark:text-purple-400">⭐ Rating Guide:</p>
              <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-0.5">5 stars = Excellent, 4 stars = Very Good, 3 stars = Good, 2 stars = Fair, 1 star = Poor</p>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              id="is_active"
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-900 dark:text-white">✅ Active (visible on website)</label>
          </div>
          
          {/* Live Preview Section - Shows how testimonial will look on frontend */}
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">📱 Live Preview (how it appears on website):</p>
            <div className="flex gap-3">
              {/* Circle Avatar Preview */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-amber-500/30">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      No img
                    </div>
                  )}
                </div>
                {formData.is_active && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{formData.name || 'Client Name'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{formData.role || 'Role'}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 ${i < formData.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] mt-1 text-gray-600 dark:text-gray-400 italic line-clamp-2">
                  "{formData.content || 'Testimonial content will appear here...'}"
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)} 
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Save className="w-4 h-4" /> Save Testimonial
          </button>
        </div>
      </div>
    </div>
  )
}