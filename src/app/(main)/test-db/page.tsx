import { createClient } from '@/lib/supabase/server'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Database Connection Test</h1>
      
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error:</h2>
          <p>{error.message}</p>
        </div>
      )}
      
      {categories && (
        <div>
          <h2>✅ Connected! Categories found:</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat.code}>
                <strong>{cat.code}</strong>: {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <hr />
      
      <h3>Environment Check:</h3>
      <p>URL exists: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Yes' : '❌ No'}</p>
      <p>Key exists: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Yes' : '❌ No'}</p>
    </div>
  )
}