'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Save, X, Trash2, ImageIcon } from 'lucide-react'

type SetupType = 'theater' | 'restaurant'
type TierType = 'essential' | 'signature' | 'luxury'
type ScalingRule = 'per_person' | 'per_table' | 'fixed' | 'per_car' | 'per_maid'

interface InventoryItem {
  id: string
  name: string
  category_code: string
  setup_type: SetupType
  tier: TierType
  base_cost: number
  scaling_rule: ScalingRule
  base_quantity: number
  primary_image_url: string | null
  is_active: boolean
  sort_order: number
}

export default function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Array<{ code: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({})
  const [filterSetup, setFilterSetup] = useState<SetupType>('theater')
  const [filterTier, setFilterTier] = useState<TierType | 'all'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    setup_type: 'theater',
    tier: 'essential',
    scaling_rule: 'fixed',
    base_quantity: 1,
    is_active: true
  })
  
  const supabase = createClient()

  const fetchItems = async () => {
    setLoading(true)
    let query = supabase
      .from('inventory_items')
      .select('*')
      .order('sort_order', { ascending: true })
    
    query = query.eq('setup_type', filterSetup)
    
    if (filterTier !== 'all') {
      query = query.eq('tier', filterTier)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('code, name')
      .order('sort_order', { ascending: true })
    
    if (data) setCategories(data)
  }

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [filterSetup, filterTier])

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setEditForm(item)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingId || !editForm) return
    
    const { error } = await supabase
      .from('inventory_items')
      .update({
        name: editForm.name,
        category_code: editForm.category_code,
        base_cost: editForm.base_cost,
        scaling_rule: editForm.scaling_rule,
        base_quantity: editForm.base_quantity,
        is_active: editForm.is_active,
        sort_order: editForm.sort_order
      })
      .eq('id', editingId)
    
    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      setEditingId(null)
      fetchItems()
    }
  }

  const addItem = async () => {
    if (!newItem.name || !newItem.category_code || !newItem.base_cost) {
      alert('Please fill in name, category, and price')
      return
    }
    
    const { error } = await supabase
      .from('inventory_items')
      .insert([{
        name: newItem.name,
        category_code: newItem.category_code,
        setup_type: newItem.setup_type,
        tier: newItem.tier,
        base_cost: newItem.base_cost,
        scaling_rule: newItem.scaling_rule,
        base_quantity: newItem.base_quantity || 1,
        is_active: newItem.is_active !== false,
        sort_order: items.length + 1
      }])
    
    if (error) {
      alert('Error adding item: ' + error.message)
    } else {
      setShowAddForm(false)
      setNewItem({
        setup_type: 'theater',
        tier: 'essential',
        scaling_rule: 'fixed',
        base_quantity: 1,
        is_active: true
      })
      fetchItems()
    }
  }

  const deleteItem = async (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
      
      if (error) {
        alert('Error deleting: ' + error.message)
      } else {
        fetchItems()
      }
    }
  }

  const scalingRuleOptions: { value: ScalingRule; label: string }[] = [
    { value: 'fixed', label: 'Fixed (1 unit)' },
    { value: 'per_person', label: 'Per Person (scales with guests)' },
    { value: 'per_table', label: 'Per Table (scales with tables)' },
    { value: 'per_car', label: 'Per Car (scales with cars)' },
    { value: 'per_maid', label: 'Per Maid (scales with bridal party)' }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-sm text-white/40 mt-1">Edit prices, add items, manage your catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition"
        >
          <Plus size={16} />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Setup Type</label>
          <select
            value={filterSetup}
            onChange={(e) => setFilterSetup(e.target.value as SetupType)}
            className="px-3 py-2 bg-black border border-white/20 rounded text-sm text-white focus:outline-none focus:border-white"
          >
            <option value="theater">Theater</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Tier</label>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value as TierType | 'all')}
            className="px-3 py-2 bg-black border border-white/20 rounded text-sm text-white focus:outline-none focus:border-white"
          >
            <option value="all">All Tiers</option>
            <option value="essential">Essential</option>
            <option value="signature">Signature</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        
        <button
          onClick={() => {
            setFilterSetup('theater')
            setFilterTier('all')
          }}
          className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Item</h2>
              <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white"
                  placeholder="e.g., 100 Spandex Chairs"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Category *</label>
                  <select
                    value={newItem.category_code || ''}
                    onChange={(e) => setNewItem({...newItem, category_code: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.code}: {cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Base Cost (KES) *</label>
                  <input
                    type="number"
                    value={newItem.base_cost || ''}
                    onChange={(e) => setNewItem({...newItem, base_cost: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white"
                    placeholder="e.g., 6000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Setup Type</label>
                  <select
                    value={newItem.setup_type}
                    onChange={(e) => setNewItem({...newItem, setup_type: e.target.value as SetupType})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  >
                    <option value="theater">Theater</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Tier</label>
                  <select
                    value={newItem.tier}
                    onChange={(e) => setNewItem({...newItem, tier: e.target.value as TierType})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  >
                    <option value="essential">Essential</option>
                    <option value="signature">Signature</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Scaling Rule</label>
                  <select
                    value={newItem.scaling_rule}
                    onChange={(e) => setNewItem({...newItem, scaling_rule: e.target.value as ScalingRule})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  >
                    {scalingRuleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Base Quantity</label>
                  <input
                    type="number"
                    value={newItem.base_quantity}
                    onChange={(e) => setNewItem({...newItem, base_quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={addItem}
                  className="flex-1 bg-white text-black py-2 rounded font-medium hover:bg-white/90"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-white/20 rounded hover:bg-white/5 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-white/40">No items found. Click "Add New Item" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Item</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Price (KES)</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Scaling</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    {editingId === item.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-sm text-white"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.category_code || ''}
                            onChange={(e) => setEditForm({...editForm, category_code: e.target.value})}
                            className="px-2 py-1 bg-white/5 border border-white/20 rounded text-sm text-white"
                          >
                            {categories.map(cat => (
                              <option key={cat.code} value={cat.code}>{cat.code}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.base_cost || 0}
                            onChange={(e) => setEditForm({...editForm, base_cost: parseInt(e.target.value)})}
                            className="w-24 px-2 py-1 bg-white/5 border border-white/20 rounded text-sm text-white"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.scaling_rule || 'fixed'}
                            onChange={(e) => setEditForm({...editForm, scaling_rule: e.target.value as ScalingRule})}
                            className="px-2 py-1 bg-white/5 border border-white/20 rounded text-sm text-white"
                          >
                            {scalingRuleOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editForm.is_active}
                              onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                              className="rounded"
                            />
                            <span className="text-xs text-white/60">{editForm.is_active ? 'Active' : 'Inactive'}</span>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={saveEdit} className="p-1 text-green-400 hover:text-green-300 mr-2">
                            <Save size={16} />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-white/40 hover:text-white">
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{item.name}</span>
                            {item.primary_image_url && (
                              <ImageIcon size={12} className="text-white/40" />
                            )}
                          </div>
                          <div className="text-xs text-white/40 mt-1">
                            {item.setup_type} / {item.tier}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/80">{item.category_code}</td>
                        <td className="px-4 py-3 font-mono text-sm text-white">{item.base_cost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-white/60">
                          {item.scaling_rule === 'per_person' && 'Per Person'}
                          {item.scaling_rule === 'per_table' && 'Per Table'}
                          {item.scaling_rule === 'fixed' && 'Fixed'}
                          {item.scaling_rule === 'per_car' && 'Per Car'}
                          {item.scaling_rule === 'per_maid' && 'Per Maid'}
                          {item.base_quantity > 1 && ` (x${item.base_quantity})`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/10 text-white/40'
                          }`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => startEdit(item)} className="p-1 text-blue-400 hover:text-blue-300 mr-2">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteItem(item.id, item.name)} className="p-1 text-red-400 hover:text-red-300">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-white/30 text-center">
        Total items: {items.length}
      </div>
    </div>
  )
}