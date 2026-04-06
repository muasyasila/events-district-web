"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, Package } from 'lucide-react'

interface QuoteType {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  display_order: number
}

export default function QuoteTypesManagement() {
  const [quoteTypes, setQuoteTypes] = useState<QuoteType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    display_order: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const fetchQuoteTypes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quote_types')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching quote types:', error)
    } else {
      setQuoteTypes(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuoteTypes()
  }, [])

  const handleNew = () => {
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true,
      display_order: quoteTypes.length + 1
    })
    setShowForm(true)
  }

  const handleEdit = (type: QuoteType) => {
    setEditingId(type.id)
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description,
      is_active: type.is_active,
      display_order: type.display_order
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setError('Name and slug are required')
      return
    }

    setError(null)
    
    if (editingId) {
      const { error } = await supabase
        .from('quote_types')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          is_active: formData.is_active,
          display_order: formData.display_order
        })
        .eq('id', editingId)
      
      if (error) {
        setError('Failed to update: ' + error.message)
      } else {
        setSuccess('Quote type updated successfully!')
        setShowForm(false)
        fetchQuoteTypes()
        setTimeout(() => setSuccess(null), 3000)
      }
    } else {
      const { error } = await supabase
        .from('quote_types')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          is_active: true,
          display_order: formData.display_order
        }])
      
      if (error) {
        setError('Failed to create: ' + error.message)
      } else {
        setSuccess('Quote type created successfully!')
        setShowForm(false)
        fetchQuoteTypes()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete quote type "${name}"? This will affect all items under this type.`)) {
      const { error } = await supabase
        .from('quote_types')
        .delete()
        .eq('id', id)
      
      if (error) {
        setError('Failed to delete: ' + error.message)
      } else {
        setSuccess('Quote type deleted successfully!')
        fetchQuoteTypes()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quote Types</h1>
          <p className="text-sm text-white/40 mt-1">Manage different quote categories (Wedding, Birthday, Graduation, etc.)</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition"
        >
          <Plus size={16} />
          Add Quote Type
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
                {editingId ? 'Edit Quote Type' : 'Add Quote Type'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Wedding"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="wedding"
                />
                <p className="text-[10px] text-white/40 mt-1">URL-friendly identifier (lowercase, no spaces)</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Wedding decor and design services"
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

      {/* Quote Types Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : quoteTypes.length === 0 ? (
          <div className="p-8 text-center text-white/40">No quote types yet. Click "Add Quote Type" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Name</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Slug</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Description</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {quoteTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-white/40" />
                        <span className="text-sm font-medium text-white">{type.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">{type.slug}</td>
                    <td className="px-4 py-3 text-sm text-white/40">{type.description || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        type.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {type.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(type)} className="p-1 text-blue-400 hover:text-blue-300 mr-2">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(type.id, type.name)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-white/30 text-center">
        Total quote types: {quoteTypes.length}
      </div>
    </div>
  )
}