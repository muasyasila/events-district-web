'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

interface Author {
  id: string
  name: string
  bio: string
  avatar_url: string | null
  role: string
  is_active: boolean
}

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Author>>({
    name: '',
    bio: '',
    avatar_url: null,
    role: '',
    is_active: true
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchAuthors = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching authors:', error)
    } else {
      setAuthors(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  const handleNew = () => {
    setEditingId(null)
    setFormData({
      name: '',
      bio: '',
      avatar_url: null,
      role: '',
      is_active: true
    })
    setShowForm(true)
  }

  const handleEdit = (author: Author) => {
    setEditingId(author.id)
    setFormData({
      name: author.name,
      bio: author.bio,
      avatar_url: author.avatar_url,
      role: author.role,
      is_active: author.is_active
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      setError('Name is required')
      return
    }

    setError(null)
    
    if (editingId) {
      // Update existing author - removed updated_at field
      const { error } = await supabase
        .from('blog_authors')
        .update({
          name: formData.name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          role: formData.role,
          is_active: formData.is_active
        })
        .eq('id', editingId)
      
      if (error) {
        setError('Failed to update: ' + error.message)
      } else {
        setSuccess('Author updated successfully!')
        setShowForm(false)
        fetchAuthors()
        setTimeout(() => setSuccess(null), 3000)
      }
    } else {
      // Create new author
      const { error } = await supabase
        .from('blog_authors')
        .insert([{
          name: formData.name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          role: formData.role,
          is_active: true
        }])
      
      if (error) {
        setError('Failed to create: ' + error.message)
      } else {
        setSuccess('Author created successfully!')
        setShowForm(false)
        fetchAuthors()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete author "${name}"? This will affect any posts using this author.`)) {
      const { error } = await supabase
        .from('blog_authors')
        .delete()
        .eq('id', id)
      
      if (error) {
        setError('Failed to delete: ' + error.message)
      } else {
        setSuccess('Author deleted successfully!')
        fetchAuthors()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Author Management</h1>
          <p className="text-sm text-white/40 mt-1">Add and manage blog authors</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition"
        >
          <Plus size={16} />
          Add Author
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

      {/* Author Form Modal - Compact Version */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-lg p-5 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Author' : 'Add New Author'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Eleanor Vance"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Editor at Large"
                />
              </div>
              
              {/* Avatar Image - Using ImageUploader */}
              <div>
                <ImageUploader
                  currentImageUrl={formData.avatar_url || null}
                  onImageUploaded={(url) => setFormData({...formData, avatar_url: url})}
                  onImageRemoved={() => setFormData({...formData, avatar_url: null})}
                  folder="authors"
                  label="Avatar Image"
                  aspectRatio="square"
                  size="sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="Design critic and curator with 15 years exploring the intersection of space and emotion..."
                />
              </div>
              
              <div className="flex gap-2 pt-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-white text-black py-1.5 rounded text-sm font-medium hover:bg-white/90"
                >
                  Save Author
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-1.5 border border-white/20 rounded text-sm text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authors Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : authors.length === 0 ? (
          <div className="p-8 text-center text-white/40">No authors yet. Click "Add Author" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Avatar</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Name</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden md:table-cell">Role</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                  <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-white/5">
                    <td className="px-3 py-2">
                      {author.avatar_url ? (
                        <img src={author.avatar_url} alt={author.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs">
                          {author.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{author.name}</p>
                      <p className="text-xs text-white/40 truncate max-w-[200px] md:hidden">{author.role}</p>
                    </td>
                    <td className="px-3 py-2 text-sm text-white/60 hidden md:table-cell">{author.role || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        author.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {author.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => handleEdit(author)} className="p-1 text-blue-400 hover:text-blue-300 mr-1">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(author.id, author.name)} className="p-1 text-red-400 hover:text-red-300">
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
    </div>
  )
}