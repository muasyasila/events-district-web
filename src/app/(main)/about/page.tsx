import { Metadata } from 'next'
import AboutClient from './aboutclient'

export const metadata: Metadata = {
  title: 'Contact | Events District',
  description: 'Get in touch with us to start planning your extraordinary event. We\'d love to hear about your vision.',
}

export default function AboutPage() {
  return < AboutClient/>
}
