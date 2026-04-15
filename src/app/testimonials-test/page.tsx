'use client'

import { useEffect, useState } from 'react'

export default function TestimonialsTestPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Loading API...</div>
  if (error) return <div className="p-8 text-red-500">Error: {JSON.stringify(error)}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testimonials API Response</h1>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}