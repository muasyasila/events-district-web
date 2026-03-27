'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Clock, CheckCircle, XCircle, History, Save, X } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import { getAuthors, getBlogCategories, saveBlogPost, deleteBlogPost, getAllPosts, restorePostVersion, getPostVersions } from '@/app/actions/blog'
import type { BlogPost, BlogPostVersion } from '@/app/actions/blog'

const gradientOptions = [
  'from-amber-900/20 via-transparent to-transparent',
  'from-indigo-900/20 via-transparent to-transparent',
  'from-emerald-900/20 via-transparent to-transparent',
  'from-rose-900/20 via-transparent to-transparent',
  'from-teal-900/20 via-transparent to-transparent',
]

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [authors, setAuthors] = useState<Array<{ name: string; bio: string; avatar_url: string; role: string }>>([])
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [versions, setVersions] = useState<BlogPostVersion[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    status: 'draft',
    gradient: gradientOptions[0],
    tags: [],
    insights: []
  })
  const [tagInput, setTagInput] = useState('')
  const [insightInput, setInsightInput] = useState('')
  const [versionNote, setVersionNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const fetchPosts = async () => {
    setLoading(true)
    const data = await getAllPosts()
    setPosts(data)
    setLoading(false)
  }

  const fetchAuthors = async () => {
    const data = await getAuthors()
    setAuthors(data)
  }

  const fetchCategories = async () => {
    const data = await getBlogCategories()
    setCategories(data)
  }

  const fetchVersions = async (postId: string) => {
    const data = await getPostVersions(postId)
    setVersions(data)
  }

  useEffect(() => {
    fetchPosts()
    fetchAuthors()
    fetchCategories()
  }, [])

  const handleNewPost = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      category: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      author: authors[0]?.name || '',
      read_time: '5 min read',
      status: 'draft',
      gradient: gradientOptions[0],
      tags: [],
      insights: []
    })
    setTagInput('')
    setInsightInput('')
    setVersionNote('')
    setShowEditor(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      featured_image_url: post.featured_image_url,
      author: post.author,
      read_time: post.read_time,
      status: post.status,
      gradient: post.gradient,
      tags: post.tags || [],
      insights: post.insights || []
    })
    setTagInput('')
    setInsightInput('')
    setVersionNote('')
    setShowEditor(true)
  }

  const handleViewVersions = async (postId: string) => {
    setSelectedPostId(postId)
    await fetchVersions(postId)
    setShowVersions(true)
  }

  const handleRestoreVersion = async (versionId: string, versionNumber: number) => {
    const note = prompt(`Enter a note for restoring version ${versionNumber}:`, `Restored to version ${versionNumber}`)
    if (note && selectedPostId) {
      const result = await restorePostVersion(selectedPostId, versionId, note)
      if (result.success) {
        setSuccess(`Restored to version ${versionNumber}`)
        await fetchVersions(selectedPostId)
        await fetchPosts()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to restore version')
      }
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tag)
    })
  }

  const handleAddInsight = () => {
    if (insightInput.trim() && !formData.insights?.includes(insightInput.trim())) {
      setFormData({
        ...formData,
        insights: [...(formData.insights || []), insightInput.trim()]
      })
      setInsightInput('')
    }
  }

  const handleRemoveInsight = (insight: string) => {
    setFormData({
      ...formData,
      insights: (formData.insights || []).filter(i => i !== insight)
    })
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.category || !formData.author) {
      setError('Please fill in title, content, category, and author')
      return
    }

    setError(null)
    
    if (!formData.slug && formData.title) {
      formData.slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    if (!formData.gradient) {
      formData.gradient = gradientOptions[0]
    }

    const result = await saveBlogPost(formData, versionNote || (editingPost ? 'Updated post' : 'Initial version'))
    
    if (result.success) {
      setSuccess('Post saved successfully!')
      setShowEditor(false)
      fetchPosts()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to save post')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      const result = await deleteBlogPost(id)
      if (result.success) {
        setSuccess('Post deleted successfully!')
        fetchPosts()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to delete post')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> Published</span>
      case 'draft':
        return <span className="flex items-center gap-1 text-yellow-400 text-xs"><Clock size={12} /> Draft</span>
      case 'archived':
        return <span className="flex items-center gap-1 text-gray-400 text-xs"><XCircle size={12} /> Archived</span>
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-sm text-white/40 mt-1">Create, edit, and manage blog posts with version history</p>
        </div>
        <button
          onClick={handleNewPost}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error/Success Messages - INSIDE MODAL */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 text-green-400 rounded text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                    placeholder="The Architecture of Silence"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                    placeholder="the-architecture-of-silence"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Auto-generated from title if left empty</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Category *</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name} className="bg-black text-white">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Author *</label>
                  <select
                    value={formData.author || ''}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px'
                    }}
                  >
                    <option value="">Select Author</option>
                    {authors.map(author => (
                      <option key={author.name} value={author.name} className="bg-black text-white">{author.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.read_time || ''}
                    onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Status</label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published' | 'archived'})}
                    className="w-full px-3 py-1.5 text-sm bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px'
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Card Gradient</label>
                  <div className="flex gap-2 flex-wrap">
                    {gradientOptions.map(gradient => (
                      <button
                        key={gradient}
                        onClick={() => setFormData({...formData, gradient})}
                        className={`w-10 h-10 rounded border-2 transition ${
                          formData.gradient === gradient ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ background: `linear-gradient(to top, ${gradient.split(' ')[0]}, transparent)` }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="A short summary of the post..."
                />
              </div>

              {/* Featured Image */}
              <div>
                <ImageUploader
                  currentImageUrl={formData.featured_image_url || null}
                  onImageUploaded={(url) => setFormData({...formData, featured_image_url: url})}
                  onImageRemoved={() => setFormData({...formData, featured_image_url: null})}
                  folder="blog-posts"
                  label="Featured Image"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition"
                    type="button"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {formData.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400" type="button">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Key Insights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={insightInput}
                    onChange={(e) => setInsightInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInsight()}
                    className="flex-1 px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                    placeholder="Add a key insight..."
                  />
                  <button
                    onClick={handleAddInsight}
                    className="px-3 py-1.5 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition"
                    type="button"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.insights?.map((insight, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-sm text-white/80">{insight}</span>
                      <button
                        onClick={() => handleRemoveInsight(insight)}
                        className="text-red-400 hover:text-red-300"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/40 mt-1">
                  Add 3-4 key insights that summarize the main takeaways
                </p>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Content *</label>
                <RichTextEditor
                  content={formData.content || ''}
                  onChange={(content) => setFormData({...formData, content})}
                />
              </div>

              {/* Version Note */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Change Note (for version history)</label>
                <input
                  type="text"
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  placeholder="e.g., Updated pricing section, Fixed typo, Added new images"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded text-sm font-medium hover:bg-white/90 transition"
                >
                  <Save size={14} />
                  Save Post
                </button>
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-1.5 border border-white/20 text-white rounded text-sm hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Version History</h2>
              <button
                onClick={() => {
                  setShowVersions(false)
                  setVersions([])
                  setSelectedPostId(null)
                }}
                className="p-2 text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {versions.length === 0 ? (
              <div className="text-center text-white/40 py-8">No version history available</div>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div key={version.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-white/60 text-xs">Version {version.version_number}</span>
                        <p className="text-white text-sm mt-1">{version.change_note}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(version.id, version.version_number)}
                        className="px-2 py-0.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 transition"
                      >
                        Restore
                      </button>
                    </div>
                    <div className="text-white/40 text-[10px] mt-2">
                      Saved by {version.created_by} on {new Date(version.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-white/40">No posts yet. Click "New Post" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Title</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Category</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden md:table-cell">Author</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden sm:table-cell">Views</th>
                  <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5">
                    <td className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{post.title}</p>
                      <p className="text-xs text-white/40 truncate max-w-[200px] md:hidden">{post.author}</p>
                    </td>
                    <td className="px-3 py-2 text-sm text-white/60">{post.category}</td>
                    <td className="px-3 py-2 text-sm text-white/60 hidden md:table-cell">{post.author}</td>
                    <td className="px-3 py-2">{getStatusBadge(post.status)}</td>
                    <td className="px-3 py-2 text-sm text-white/60 hidden sm:table-cell">{post.views || 0}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleViewVersions(post.id)}
                        className="p-1 text-purple-400 hover:text-purple-300 mr-1"
                        title="Version History"
                      >
                        <History size={14} />
                      </button>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-1 text-blue-400 hover:text-blue-300 mr-1"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
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
        Total posts: {posts.length}
      </div>
    </div>
  )
}