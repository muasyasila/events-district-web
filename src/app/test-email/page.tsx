'use client'

import { useState } from 'react'
import { sendChecklistEmail, sendFollowUpEmail } from '@/app/actions/email'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [stage, setStage] = useState('welcome')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    if (!email) {
      setStatus('Please enter an email address')
      return
    }
    
    setLoading(true)
    setStatus('Sending...')
    
    let result
    if (stage === 'welcome') {
      result = await sendChecklistEmail(email, name)
    } else {
      result = await sendFollowUpEmail(email, stage as any, name)
    }
    
    if (result.success) {
      setStatus(`✅ ${stage} email sent successfully! Check your inbox.`)
    } else {
      setStatus(`❌ Error: ${result.error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Test Email System</h1>
        <p className="text-white/60 text-sm mb-6">Send test emails to verify everything works</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-white"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Email Type</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
            >
              <option value="welcome">Welcome Email (with checklist)</option>
              <option value="week1">Week 1 - Wedding Secret</option>
              <option value="week2">Week 2 - Pinterest vs Reality</option>
              <option value="month1">Month 1 - The Moment It Clicks</option>
              <option value="month2">Month 2 - Check-in Friend</option>
              <option value="month3">Month 3 - We Miss You</option>
            </select>
          </div>
          
          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded font-medium hover:bg-white/90 disabled:opacity-50 mt-4"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
          
          {status && (
            <p className="mt-4 text-sm text-white/60 text-center whitespace-pre-wrap">{status}</p>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            These emails are sent using Resend. Check your spam folder if you don't see them.
          </p>
        </div>
      </div>
    </div>
  )
}