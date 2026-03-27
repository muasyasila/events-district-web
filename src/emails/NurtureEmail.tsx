import React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components'

interface NurtureEmailProps {
  name?: string
  stage: 'week1' | 'week2' | 'month1' | 'month2' | 'month3'
  weddingDate?: string
}

export default function NurtureEmail({ name, stage, weddingDate }: NurtureEmailProps) {
  const content = {
    week1: {
      subject: "A little secret about wedding planning... 🤫",
      preview: "The one thing no one tells you",
      heading: "The Secret Most Couples Don't Know",
      message: `Hi ${name || 'there'}!,

I hope you've been enjoying your wedding planning checklist! Today, I want to share something most couples don't realize until it's too late...

The vendors you love? They book out FAST. Like, 12-18 months fast. The best florists, photographers, and decor teams have calendars filling up way before you think they do.

Here's the thing: you don't have to have everything figured out to reach out. We actually love when couples come to us early - it means we can build something truly special together.

Think of it like this: would you rather rush through planning or enjoy every moment?

Want to see if your date is still available? Let's chat - no pressure, just good conversation about your vision.`,
      cta: "Let's Chat (No Pressure)",
      ctaLink: "/consultation"
    },
    week2: {
      subject: "Pinterest vs. Reality (and why both can be beautiful) ✨",
      preview: "Making your inspiration come alive",
      heading: "From Pinterest Board to Reality",
      message: `Hi ${name || 'there'}!,

I bet your Pinterest board is full of gorgeous inspiration right now. (No judgment - mine too!)

But here's something I've learned working with hundreds of couples: the most beautiful weddings aren't the ones that perfectly copy a Pinterest photo.

They're the ones that tell YOUR story.

Maybe that means a family heirloom incorporated into your bouquet. A favorite childhood memory turned into a centerpiece. A color palette that reminds you of your first date.

We don't just decorate venues - we help you find the details that make your wedding feel like YOU.

What's one thing that's uniquely you?`,
      cta: "Share Your Story →",
      ctaLink: "/consultation"
    },
    month1: {
      subject: "The moment it all clicks... 💡",
      preview: "When your vision becomes clear",
      heading: "The Magic Moment",
      message: `Hi ${name || 'there'}!,

I was thinking about you today. Planning a wedding is like assembling a puzzle with pieces you haven't seen yet.

One day, you're overwhelmed by a thousand decisions. The next, something clicks and suddenly you can see the whole picture.

That moment? It's magical.

Whether you're still in the early stages or starting to see your vision come together, we'd love to help you get there.

No pressure. Just a conversation about what you're dreaming up. And maybe a cup of coffee (virtual or real).`,
      cta: "Let's Dream Together →",
      ctaLink: "/consultation"
    },
    month2: {
      subject: "A little check-in from your wedding planning friend 👋",
      preview: "Just thinking about you",
      heading: "How's Planning Going?",
      message: `Hey ${name || 'there'}! 👋

I was scrolling through my calendar today and realized it's been a couple months since we last connected. Time flies when you're planning a wedding, right?

I'm not here to sell you anything. I genuinely just want to know how things are going.

Have you found your venue yet? Started talking to vendors? Or are you still in the "enjoying being engaged" phase (totally valid, by the way).

Whatever stage you're at, I'm curious about one thing: what's the one element of your wedding you're most excited about?

Reply and let me know - I love hearing what makes each couple's celebration unique!`,
      cta: "Reply to This Email →",
      ctaLink: "mailto:hello@eventsdistrict.com"
    },
    month3: {
      subject: "We miss you! (And a little wedding inspo) 💭",
      preview: "Some inspiration for your journey",
      heading: "Still Dreaming of Your Perfect Day?",
      message: `Hi ${name || 'there'}! 💭

It's been a few months since we last checked in, and I was thinking about you and your wedding plans.

Planning a wedding is a journey, not a race. Some couples knock everything out in a few months. Others take their time, enjoying every moment of being engaged.

Both are perfectly okay.

I'm not writing to rush you. I'm writing because I genuinely believe your wedding should be a reflection of YOU - not a checklist of things you "should" do.

If you're still in the dreaming phase, take your time. The right plans come together when they're meant to.

And if you're ready to start turning dreams into reality, we're here when you are. No pressure, just warmth.

Either way, I hope planning is bringing you joy. It should!`,
      cta: "Let's Chat Whenever You're Ready →",
      ctaLink: "/consultation"
    }
  }

  const emailContent = content[stage]

  return (
    <Html>
      <Head />
      <Preview>{emailContent.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>{emailContent.heading}</Text>
          
          <Text style={paragraph}>
            {emailContent.message.split('\n\n').map((para, i) => (
              <span key={i}>
                {para}
                <br />
                <br />
              </span>
            ))}
          </Text>
          
          <Section style={buttonContainer}>
            <Link href={`https://your-domain.com${emailContent.ctaLink}`} style={button}>
              {emailContent.cta}
            </Link>
          </Section>
          
          <Text style={footer}>
            P.S. If you're not planning anymore or just want off this list, reply "unsubscribe" - no hard feelings!
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0A0A0A',
  fontFamily: 'Georgia, serif',
  color: '#FFFFFF',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
}

const heading = {
  fontSize: '28px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  marginBottom: '20px',
  color: '#FFFFFF',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
  color: '#CCCCCC',
}

const buttonContainer = {
  margin: '30px 0',
}

const button = {
  backgroundColor: '#FFFFFF',
  color: '#000000',
  padding: '12px 24px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  display: 'inline-block',
}

const footer = {
  fontSize: '12px',
  color: '#666666',
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid #333333',
}