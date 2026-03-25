import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get counts
  const { count: inventoryCount } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
  
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
  
  const { count: newLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  
  // Get recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black border border-white/10 rounded-lg p-6">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Items</p>
          <p className="text-3xl font-bold text-white mt-2">{inventoryCount || 0}</p>
        </div>
        
        <div className="bg-black border border-white/10 rounded-lg p-6">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Leads</p>
          <p className="text-3xl font-bold text-white mt-2">{leadsCount || 0}</p>
        </div>
        
        <div className="bg-black border border-white/10 rounded-lg p-6">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">New Leads</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{newLeadsCount || 0}</p>
        </div>
      </div>
      
      {/* Recent Leads */}
      <div className="bg-black border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-semibold text-white">Recent Leads</h2>
        </div>
        <div className="divide-y divide-white/10">
          {recentLeads && recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div key={lead.id} className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{lead.email}</p>
                  <p className="text-sm text-white/40">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  lead.status === 'new' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/10 text-white/60'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-white/40">
              No leads yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}