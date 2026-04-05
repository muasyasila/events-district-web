import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, tier, total, pax, setup, itemsHtml, date } = await request.json()

    const { error } = await resend.emails.send({
      from: 'Events District <onboarding@resend.dev>',
      to: email,
      subject: `Your ${tier} Wedding Quote from Events District`,
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
            .summary { background-color: #1A1A1A; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .total { font-size: 24px; font-weight: bold; color: #FFFFFF; }
            .button { background-color: #FFFFFF; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 20px 0; border-radius: 30px; }
            .footer { font-size: 12px; color: #666666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Your ${tier} Wedding Quote</h1>
            
            <div class="summary">
              <p><strong>Event Details:</strong></p>
              <p>📅 Date: ${date}</p>
              <p>👥 Guest Count: ${pax} guests</p>
              <p>🪑 Layout: ${setup === 'theater' ? 'Theater Style' : 'Restaurant Style'}</p>
              <p>✨ Package: ${tier}</p>
              <p class="total">💰 Total: KES ${total.toLocaleString()}</p>
            </div>
            
            <h2>What's Included:</h2>
            ${itemsHtml}
            
            <div style="text-align: center;">
              <a href="https://eventsdistrict.com/contact" class="button">Book a Consultation →</a>
            </div>
            
            <p>Have questions about your quote? We're here to help! Simply reply to this email or call us at +254 768 842 000.</p>
            
            <p>We can't wait to help bring your vision to life!</p>
            
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

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending quote email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}