'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Calendar, CheckCircle, XCircle, Download, Search, Filter, Eye } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  event_date: string | null
  event_type: string | null
  source: string | null
  status: 'new' | 'contacted' | 'converted' | 'lost'
  notes: string | null
  created_at: string
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    lost: 0
  })
  
  const supabase = createClient()

  const fetchLeads = async () => {
    setLoading(true)
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching leads:', error)
    } else {
      setLeads(data || [])
      
      // Calculate stats
      const allLeads = data || []
      setStats({
        total: allLeads.length,
        new: allLeads.filter(l => l.status === 'new').length,
        contacted: allLeads.filter(l => l.status === 'contacted').length,
        converted: allLeads.filter(l => l.status === 'converted').length,
        lost: allLeads.filter(l => l.status === 'lost').length
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [filterStatus, searchQuery])

  const updateStatus = async (id: string, newStatus: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      fetchLeads()
    }
  }

  const updateNotes = async () => {
    if (!selectedLead) return
    
    const { error } = await supabase
      .from('leads')
      .update({ notes: notes })
      .eq('id', selectedLead.id)
    
    if (error) {
      alert('Error saving notes: ' + error.message)
    } else {
      setShowNotesModal(false)
      setSelectedLead(null)
      setNotes('')
      fetchLeads()
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Event Date', 'Event Type', 'Source', 'Status', 'Notes', 'Date']
    const csvData = leads.map(lead => [
      lead.name || '',
      lead.email,
      lead.event_date || '',
      lead.event_type || '',
      lead.source || '',
      lead.status,
      lead.notes || '',
      new Date(lead.created_at).toLocaleDateString()
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'contacted': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      case 'converted': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      case 'lost': return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads Management</h1>
          <p className="text-sm text-white/40 mt-1">Track and manage your potential clients</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded hover:bg-white/20 transition"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-black border border-white/10 rounded-lg p-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-lg p-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">New</p>
          <p className="text-2xl font-bold text-green-400">{stats.new}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-lg p-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Contacted</p>
          <p className="text-2xl font-bold text-blue-400">{stats.contacted}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-lg p-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Converted</p>
          <p className="text-2xl font-bold text-purple-400">{stats.converted}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-lg p-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Lost</p>
          <p className="text-2xl font-bold text-gray-400">{stats.lost}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>
        
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        
        <button
          onClick={() => {
            setFilterStatus('all')
            setSearchQuery('')
          }}
          className="px-3 py-1.5 text-sm text-white/60 hover:text-white border border-white/20 rounded"
        >
          Reset
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-white/40">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Lead</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden md:table-cell">Event</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden lg:table-cell">Source</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white/40 hidden sm:table-cell">Date</th>
                  <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5">
                    <td className="px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-white">{lead.name || 'Anonymous'}</p>
                        <p className="text-xs text-white/40">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {lead.event_date && (
                        <div className="flex items-center gap-1 text-sm text-white/60">
                          <Calendar size={12} />
                          <span>{new Date(lead.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {lead.event_type && (
                        <p className="text-xs text-white/40 mt-1">{lead.event_type}</p>
                      )}
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell">
                      <span className="text-xs text-white/60">{lead.source || '-'}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      <span className="text-xs text-white/40">{formatDate(lead.created_at)}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedLead(lead)
                          setNotes(lead.notes || '')
                          setShowNotesModal(true)
                        }}
                        className="p-1 text-white/60 hover:text-white mr-1"
                        title="View Notes"
                      >
                        <Eye size={14} />
                      </button>
                      {lead.status === 'new' && (
                        <button
                          onClick={() => updateStatus(lead.id, 'contacted')}
                          className="p-1 text-blue-400 hover:text-blue-300 mr-1"
                          title="Mark Contacted"
                        >
                          <Mail size={14} />
                        </button>
                      )}
                      {(lead.status === 'new' || lead.status === 'contacted') && (
                        <button
                          onClick={() => updateStatus(lead.id, 'converted')}
                          className="p-1 text-green-400 hover:text-green-300 mr-1"
                          title="Mark Converted"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {(lead.status === 'new' || lead.status === 'contacted') && (
                        <button
                          onClick={() => updateStatus(lead.id, 'lost')}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Mark Lost"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-white/30 text-center">
        Total leads: {leads.length}
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedLead && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-lg p-5 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Lead Notes</h2>
              <button
                onClick={() => {
                  setShowNotesModal(false)
                  setSelectedLead(null)
                  setNotes('')
                }}
                className="text-white/40 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-1">Name:</p>
              <p className="text-white font-medium">{selectedLead.name || 'Anonymous'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-1">Email:</p>
              <p className="text-white font-medium">{selectedLead.email}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-1">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
                placeholder="Add notes about this lead..."
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={updateNotes}
                className="flex-1 bg-white text-black py-2 rounded text-sm font-medium hover:bg-white/90"
              >
                Save Notes
              </button>
              <button
                onClick={() => {
                  setShowNotesModal(false)
                  setSelectedLead(null)
                  setNotes('')
                }}
                className="px-4 py-2 border border-white/20 text-white rounded text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}