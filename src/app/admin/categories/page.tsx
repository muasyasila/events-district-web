"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, FolderOpen } from 'lucide-react'

interface CategoryGroup {
  id: string
  quote_type: string
  category_code: string
  category_name: string
  display_order: number
  is_active: boolean
}

const quoteTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'picnic', label: 'Picnic Date' },
  { value: 'custom', label: 'Custom' }
]

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quote_type: 'wedding',
    category_code: '',
    category_name: '',
    display_order: 0,
    is_active: true
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('category_groups')
      .select('*')
      .order('quote_type', { ascending: true })
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to fetch categories')
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleNew = () => {
    setEditingId(null)
    setFormData({
      quote_type: 'wedding',
      category_code: '',
      category_name: '',
      display_order: categories.length + 1,
      is_active: true
    })
    setShowForm(true)
  }

  const handleEdit = (cat: CategoryGroup) => {
    setEditingId(cat.id)
    setFormData({
      quote_type: cat.quote_type,
      category_code: cat.category_code,
      category_name: cat.category_name,
      display_order: cat.display_order,
      is_active: cat.is_active
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.category_code || !formData.category_name) {
      setError('Category code and name are required')
      return
    }

    setError(null)
    
    if (editingId) {
      const { error } = await supabase
        .from('category_groups')
        .update({
          quote_type: formData.quote_type,
          category_code: formData.category_code.toUpperCase(),
          category_name: formData.category_name,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId)
      
      if (error) {
        setError('Failed to update: ' + error.message)
      } else {
        setSuccess('Category updated successfully!')
        setShowForm(false)
        fetchCategories()
        setTimeout(() => setSuccess(null), 3000)
      }
    } else {
      const { error } = await supabase
        .from('category_groups')
        .insert([{
          quote_type: formData.quote_type,
          category_code: formData.category_code.toUpperCase(),
          category_name: formData.category_name,
          display_order: formData.display_order,
          is_active: true
        }])
      
      if (error) {
        setError('Failed to create: ' + error.message)
      } else {
        setSuccess('Category created successfully!')
        setShowForm(false)
        fetchCategories()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? This will affect all items in this category.`)) {
      const { error } = await supabase
        .from('category_groups')
        .delete()
        .eq('id', id)
      
      if (error) {
        setError('Failed to delete: ' + error.message)
      } else {
        setSuccess('Category deleted successfully!')
        fetchCategories()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  // Group categories by quote type
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.quote_type]) {
      acc[cat.quote_type] = []
    }
    acc[cat.quote_type].push(cat)
    return acc
  }, {} as Record<string, CategoryGroup[]>)

  const selectClassName = "w-full px-3 py-2 bg-black border border-white/20 rounded text-sm text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
  const optionClassName = "bg-black text-white"

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Groups</h1>
          <p className="text-sm text-white/40 mt-1">Manage categories for each quote type (Wedding, Birthday, Graduation, Picnic)</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-sm">
          {success}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Quote Type *</label>
                <select
                  value={formData.quote_type}
                  onChange={(e) => setFormData({...formData, quote_type: e.target.value})}
                  className={selectClassName}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 8px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '14px'
                  }}
                >
                  {quoteTypes.map(type => (
                    <option key={type.value} value={type.value} className={optionClassName}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Category Code *</label>
                <input
                  type="text"
                  value={formData.category_code}
                  onChange={(e) => setFormData({...formData, category_code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="A, VENUE, SETUP, etc."
                />
                <p className="text-[10px] text-white/40 mt-1">Short identifier (e.g., A, VENUE, SETUP)</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="External Structures & Lighting"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-white text-black py-2 rounded text-sm font-medium hover:bg-white/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-white/20 rounded text-sm text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories by Quote Type */}
      {loading ? (
        <div className="p-8 text-center text-white/40">Loading...</div>
      ) : Object.keys(groupedCategories).length === 0 ? (
        <div className="p-8 text-center text-white/40">No categories yet. Click "Add Category" to get started.</div>
      ) : (
        Object.entries(groupedCategories).map(([quoteType, cats]) => (
          <div key={quoteType} className="mb-8">
            <h2 className="text-lg font-serif italic text-foreground mb-4 pb-2 border-b border-foreground/20">
              {quoteTypes.find(t => t.value === quoteType)?.label || quoteType}
            </h2>
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Order</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cats.map((cat) => (
                    <tr key={cat.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FolderOpen size={14} className="text-white/40" />
                          <span className="text-sm font-mono text-white">{cat.category_code}</span>
                        </div>
                       </td>
                      <td className="px-4 py-3 text-sm text-white">{cat.category_name}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{cat.display_order}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          cat.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleEdit(cat)} className="p-1 text-blue-400 hover:text-blue-300 mr-2">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.category_name)} className="p-1 text-red-400 hover:text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <div className="mt-4 text-xs text-white/30 text-center">
        Total categories: {categories.length}
      </div>
    </div>
  )
}