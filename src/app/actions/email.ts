'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Send welcome email with checklist
export async function sendChecklistEmail(email: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Events District <onboarding@resend.dev>',
      to: email,
      subject: 'Your Wedding Planning Checklist is Ready! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background-color: #0A0A0A; font-family: Georgia, serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0A0A0A; }
            h1 { font-size: 32px; font-style: italic; font-weight: normal; margin-bottom: 20px; color: #FFFFFF; }
            p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #CCCCCC; }
            .button { background-color: #FFFFFF; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 20px 0; }
            .footer { font-size: 12px; color: #666666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; }
            .checklist-items { background-color: #1A1A1A; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .checklist-items li { color: #CCCCCC; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hi ${name || 'there'}! 👋</h1>
            <p>Thank you for downloading our <strong>Ultimate Wedding Planning Checklist</strong>. We're so excited to help you plan your perfect day!</p>
            <div class="checklist-items">
              <p style="margin-bottom: 10px;"><strong>Your checklist includes:</strong></p>
              <ul>
                <li>📅 12-Month Planning Timeline</li>
                <li>💰 Budget Calculator Spreadsheet</li>
                <li>📋 Vendor Comparison Tool</li>
                <li>🏛️ Venue Visit Checklist</li>
                <li>💐 Questions to Ask Your Florist & Caterer</li>
                <li>📸 Questions to Ask Your Photographer</li>
                <li>🚨 Day-Of Emergency Kit List</li>
              </ul>
            </div>
            <div style="text-align: center;">
              <a href="https://your-domain.com/downloads/wedding-checklist.pdf" class="button">📥 Download Your Checklist</a>
            </div>
            <p>Have questions? We're here to help. Simply reply to this email or book a free consultation below.</p>
            <div style="text-align: center;">
              <a href="https://your-domain.com/consultation" style="color: #FFFFFF; border: 1px solid #FFFFFF; padding: 12px 24px; text-decoration: none; display: inline-block;">Book Free Consultation →</a>
            </div>
            <div class="footer">
              <p>Warmly,<br>The Events District Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Send follow-up email (week1, week2, month1, month2, month3)
export async function sendFollowUpEmail(
  email: string,
  stage: 'week1' | 'week2' | 'month1' | 'month2' | 'month3',
  name?: string,
  weddingDate?: string
) {
  try {
    let subject = ''
    let content = ''
    
    if (stage === 'week1') {
      subject = "A little secret about wedding planning... 🤫"
      content = `
        <h1>Hi ${name || 'there'}! 👋</h1>
        <p>I hope you've been enjoying your wedding planning checklist! Today, I want to share something most couples don't realize until it's too late...</p>
        <h2>The vendors you love? They book out FAST.</h2>
        <p>Like, 12-18 months fast. The best florists, photographers, and decor teams have calendars filling up way before you think they do.</p>
        <p>Here's the thing: <strong>you don't have to have everything figured out</strong> to reach out. We actually love when couples come to us early - it means we can build something truly special together.</p>
        <p>Think of it like this: would you rather rush through planning or enjoy every moment?</p>
        <p>Want to see if your date is still available? Let's chat - no pressure, just good conversation about your vision.</p>
      `
    } else if (stage === 'week2') {
      subject = "Pinterest vs. Reality (and why both can be beautiful) "
      content = `
        <h1>Hi ${name || 'there'}! </h1>
        <p>I bet your Pinterest board is full of gorgeous inspiration right now. (No judgment - mine too!)</p>
        <p>But here's something I've learned working with hundreds of couples: <strong>the most beautiful weddings aren't the ones that perfectly copy a Pinterest photo.</strong></p>
        <p>They're the ones that tell YOUR story.</p>
        <p>Maybe that means a family heirloom incorporated into your bouquet. A favorite childhood memory turned into a centerpiece. A color palette that reminds you of your first date.</p>
        <p>We don't just decorate venues - we help you find the details that make your wedding feel like YOU.</p>
        <p>What's one thing that's uniquely you? Reply and tell me - I'd love to hear it!</p>
      `
    } else if (stage === 'month1') {
      subject = "The moment it all clicks... 💡"
      content = `
        <h1>Hi ${name || 'there'}! 💡</h1>
        <p>I was thinking about you today. Planning a wedding is like assembling a puzzle with pieces you haven't seen yet.</p>
        <p>One day, you're overwhelmed by a thousand decisions. The next, something clicks and suddenly you can see the whole picture.</p>
        <p>That moment? It's magical.</p>
        <p>Whether you're still in the early stages or starting to see your vision come together, we'd love to help you get there.</p>
        <p>No pressure. Just a conversation about what you're dreaming up. <strong>And maybe a cup of coffee (virtual or real).</strong></p>
      `
    } else if (stage === 'month2') {
      subject = "A little check-in from your wedding planning friend 👋"
      content = `
        <h1>Hey ${name || 'there'}! 👋</h1>
        <p>I was scrolling through my calendar today and realized it's been a couple months since we last connected. Time flies when you're planning a wedding, right?</p>
        <p>I'm not here to sell you anything. I genuinely just want to know how things are going.</p>
        <p>Have you found your venue yet? Started talking to vendors? Or are you still in the "enjoying being engaged" phase (totally valid, by the way).</p>
        <p>Whatever stage you're at, I'm curious about one thing: <strong>what's the one element of your wedding you're most excited about?</strong></p>
        <p>Reply and let me know - I love hearing what makes each couple's celebration unique!</p>
      `
    } else {
      subject = "We miss you! (And a little wedding inspo) 💭"
      content = `
        <h1>Hi ${name || 'there'}! 💭</h1>
        <p>It's been a few months since we last checked in, and I was thinking about you and your wedding plans.</p>
        <p>Planning a wedding is a journey, not a race. Some couples knock everything out in a few months. Others take their time, enjoying every moment of being engaged.</p>
        <p><strong>Both are perfectly okay.</strong></p>
        <p>I'm not writing to rush you. I'm writing because I genuinely believe your wedding should be a reflection of YOU - not a checklist of things you "should" do.</p>
        <p>If you're still in the dreaming phase, here's some inspo to enjoy:</p>
        <ul>
          <li> 10 ways to make your ceremony feel uniquely yours</li>
          <li>💐 The meaning behind different flowers (and why they matter)</li>
          <li>🎨 How to choose a color palette that feels timeless</li>
        </ul>
        <p>And if you're ready to start turning dreams into reality, we're here when you are. No pressure, just warmth.</p>
        <p>Either way, I hope planning is bringing you joy. It should!</p>
      `
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Events District <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background-color: #0A0A0A; font-family: Georgia, serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0A0A0A; }
            h1 { font-size: 28px; font-style: italic; font-weight: normal; margin-bottom: 20px; color: #FFFFFF; }
            h2 { font-size: 20px; font-style: italic; margin: 20px 0 10px; color: #FFFFFF; }
            p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #CCCCCC; }
            ul { margin-bottom: 20px; color: #CCCCCC; }
            li { margin-bottom: 8px; }
            .button { background-color: #FFFFFF; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 20px 0; }
            .footer { font-size: 12px; color: #666666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; }
          </style>
        </head>
        <body>
          <div class="container">
            ${content}
            <div style="text-align: center;">
              <a href="https://your-domain.com/consultation" class="button">Let's Chat (No Pressure) →</a>
            </div>
            <div class="footer">
              <p>P.S. If you're not planning anymore or just want off this list, reply "unsubscribe" - no hard feelings!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Send notification to admin when someone fills contact form
export async function sendContactNotification(data: {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: string
  message: string
  howDidYouHear: string
}) {
  try {
    const { error } = await resend.emails.send({
      from: 'Events District <onboarding@resend.dev>',
      to: ['hello@eventsdistrict.com'],
      subject: `New Inquiry: ${data.eventType} from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background-color: #0A0A0A; font-family: Georgia, serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0A0A0A; }
            h1 { font-size: 24px; font-style: italic; font-weight: normal; margin-bottom: 20px; color: #FFFFFF; }
            h2 { font-size: 18px; font-style: italic; margin: 20px 0 10px; color: #FFFFFF; }
            p { font-size: 14px; line-height: 1.6; margin-bottom: 20px; color: #CCCCCC; }
            .info-box { background-color: #1A1A1A; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
            .value { font-size: 14px; color: #FFFFFF; }
            .footer { font-size: 11px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Inquiry from ${data.name}</h1>
            
            <div class="info-box">
              <div class="label">Event Type</div>
              <div class="value">${data.eventType}</div>
              <div style="margin-top: 15px;"></div>
              <div class="label">Event Date</div>
              <div class="value">${data.eventDate || 'Not specified'}</div>
              <div style="margin-top: 15px;"></div>
              <div class="label">Guest Count</div>
              <div class="value">${data.guestCount || 'Not specified'}</div>
            </div>
            
            <div class="info-box">
              <div class="label">Contact Information</div>
              <div class="value">${data.name}</div>
              <div class="value">${data.email}</div>
              <div class="value">${data.phone || 'Not provided'}</div>
            </div>
            
            <div class="info-box">
              <div class="label">How They Heard</div>
              <div class="value">${data.howDidYouHear || 'Not specified'}</div>
            </div>
            
            <div class="info-box">
              <div class="label">Message</div>
              <div class="value">${data.message.replace(/\n/g, '<br/>')}</div>
            </div>
            
            <div class="footer">
              <p>View this inquiry in your admin dashboard at /admin/leads</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('Admin notification error:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}

// Send auto-reply to client
export async function sendAutoReply(email: string, name: string) {
  try {
    const { error } = await resend.emails.send({
      from: 'Events District <onboarding@resend.dev>',
      to: email,
      subject: 'Thank You for Reaching Out!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background-color: #0A0A0A; font-family: Georgia, serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0A0A0A; }
            h1 { font-size: 28px; font-style: italic; font-weight: normal; margin-bottom: 20px; color: #FFFFFF; }
            p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #CCCCCC; }
            .button { background-color: #FFFFFF; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 20px 0; border-radius: 30px; }
            .footer { font-size: 12px; color: #666666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hi ${name} 👋</h1>
            
            <p>Thank you for reaching out to Events District! We're so excited to learn about your vision and help bring it to life.</p>
            
            <p>We've received your inquiry and will review it shortly. One of our design consultants will get back to you within <strong>24 hours</strong> to discuss your event in more detail.</p>
            
            <p>In the meantime, feel free to explore our <a href="https://your-domain.com/quote" style="color: #FFFFFF;">wedding quote calculator</a> to get an instant estimate for your special day.</p>
            
            <div style="text-align: center;">
              <a href="https://your-domain.com/quote" class="button">Get an Instant Quote →</a>
            </div>
            
            <p>If you have any urgent questions, feel free to reply to this email or call us at +254 700 000 000.</p>
            
            <p>We can't wait to create something extraordinary with you!</p>
            
            <p>Warmly,<br>The Events District Team</p>
            
            <div class="footer">
              <p>Events District | Atmosphere Engineering</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('Auto-reply error:', error)
    return { success: false, error: 'Failed to send auto-reply' }
  }
}

// Process automated follow-ups
export async function processAutomatedFollowUps() {
  const supabase = await createClient()
  
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['new', 'contacted'])
      .gte('created_at', new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    if (!leads) return { success: true, processed: 0 }
    
    let processed = 0
    
    for (const lead of leads) {
      const daysSinceSignup = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
      
      // Week 1 (Day 7)
      if (daysSinceSignup === 7 && !lead.email_sent_week1) {
        await sendFollowUpEmail(lead.email, 'week1', lead.name, lead.event_date)
        await supabase.from('leads').update({ email_sent_week1: true }).eq('id', lead.id)
        processed++
      }
      
      // Week 2 (Day 14)
      if (daysSinceSignup === 14 && !lead.email_sent_week2) {
        await sendFollowUpEmail(lead.email, 'week2', lead.name, lead.event_date)
        await supabase.from('leads').update({ email_sent_week2: true }).eq('id', lead.id)
        processed++
      }
      
      // Month 1 (Day 30)
      if (daysSinceSignup === 30 && !lead.email_sent_month1) {
        await sendFollowUpEmail(lead.email, 'month1', lead.name, lead.event_date)
        await supabase.from('leads').update({ email_sent_month1: true }).eq('id', lead.id)
        processed++
      }
      
      // Month 2 (Day 60)
      if (daysSinceSignup === 60 && !lead.email_sent_month2) {
        await sendFollowUpEmail(lead.email, 'month2', lead.name, lead.event_date)
        await supabase.from('leads').update({ email_sent_month2: true }).eq('id', lead.id)
        processed++
      }
      
      // Month 3 (Day 90)
      if (daysSinceSignup === 90 && !lead.email_sent_month3) {
        await sendFollowUpEmail(lead.email, 'month3', lead.name, lead.event_date)
        await supabase.from('leads').update({ email_sent_month3: true }).eq('id', lead.id)
        processed++
      }
    }
    
    return { success: true, processed }
  } catch (error) {
    console.error('Error processing follow-ups:', error)
    return { success: false, error: 'Failed to process follow-ups' }
  }
}