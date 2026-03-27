import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Img,
} from '@react-email/components'

interface WelcomeEmailProps {
  name?: string
  checklistUrl: string
}

export default function WelcomeEmail({ name, checklistUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Wedding Planning Checklist is Ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-domain.com/logo.png"
            width="120"
            height="60"
            alt="Events District"
            style={logo}
          />
          
          <Text style={heading}>Hi {name || 'there'}! 👋</Text>
          
          <Text style={paragraph}>
            Thank you for downloading our Ultimate Wedding Planning Checklist. 
            We've put together everything you need to plan your perfect day without the stress.
          </Text>
          
          <Section style={buttonContainer}>
            <Link href={checklistUrl} style={button}>
              Download Your Checklist
            </Link>
          </Section>
          
          <Text style={paragraph}>
            This checklist includes:
          </Text>
          <ul style={list}>
            <li>12-Month Planning Timeline</li>
            <li>Budget Calculator Spreadsheet</li>
            <li>Vendor Comparison Tool</li>
            <li>Venue Visit Checklist</li>
            <li>Questions to Ask Your Florist & Caterer</li>
            <li>Day-Of Emergency Kit List</li>
          </ul>
          
          <Text style={paragraph}>
            Want to take the stress out of planning? Book a free consultation 
            and let our experts handle everything.
          </Text>
          
          <Section style={buttonContainer}>
            <Link href="https://your-domain.com/consultation" style={buttonSecondary}>
              Book Free Consultation →
            </Link>
          </Section>
          
          <Text style={footer}>
            Have questions? Just reply to this email. We're here to help!
            <br />
            <br />
            Warmly,
            <br />
            The Events District Team
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

const logo = {
  marginBottom: '30px',
}

const heading = {
  fontSize: '32px',
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

const list = {
  marginBottom: '20px',
  color: '#CCCCCC',
  lineHeight: '1.6',
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

const buttonSecondary = {
  backgroundColor: 'transparent',
  color: '#FFFFFF',
  padding: '12px 24px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  display: 'inline-block',
  border: '1px solid #FFFFFF',
}

const footer = {
  fontSize: '12px',
  color: '#666666',
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid #333333',
}