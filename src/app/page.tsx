
export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0A0A0A', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', fontStyle: 'italic' }}>Events District</h1>
      <p style={{ marginTop: '20px', fontSize: '18px' }}>Welcome to our new site! 🎉</p>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>We're setting things up. Check back soon!</p>
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/admin/login" style={{ color: '#888', textDecoration: 'none', border: '1px solid #888', padding: '8px 16px', borderRadius: '4px' }}>Admin Login</a>
        <a href="/quote" style={{ color: '#888', textDecoration: 'none', border: '1px solid #888', padding: '8px 16px', borderRadius: '4px' }}>Quote Engine</a>
      </div>
    </div>
  )
}
