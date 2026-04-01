import { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Our Services | Events District',
  description: 'Explore our comprehensive range of event decor and design services for weddings, corporate events, social celebrations, and more.',
}

export default function ServicesPage() {
  return <ServicesClient />
}