'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNew = () => {
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: ''
    })
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData(category)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      setError('Name is required')
      return
    }

    // Auto-generate slug if not provided
    if (!formData.slug) {
      formData.slug = generateSlug(formData.name)
    }

    setError(null)
    
    if (editingId) {
      // Update existing category
      const { error } = await supabase
        .from('blog_categories')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description
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
      // Create new category
      const { error } = await supabase
        .from('blog_categories')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          description: formData.description
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
    if (confirm(`Delete category "${name}"? This will affect any posts using this category.`)) {
      const { error } = await supabase
        .from('blog_categories')
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-sm text-white/40 mt-1">Add and manage blog categories</p>
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
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded">
          {success}
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name)
                    })
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Design Philosophy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="design-philosophy"
                />
                <p className="text-[10px] text-white/40 mt-1">Auto-generated from name if left empty</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Exploring the principles behind luxury design..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-white text-black py-2 rounded font-medium hover:bg-white/90"
                >
                  Save Category
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-white/20 rounded hover:bg-white/5 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-white/40">No categories yet. Click "Add Category" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Name</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Slug</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Description</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{category.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">{category.slug}</td>
                    <td className="px-4 py-3 text-sm text-white/40 truncate max-w-md">{category.description || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(category)} className="p-1 text-blue-400 hover:text-blue-300 mr-2">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id, category.name)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}