import { Metadata } from 'next'
import BirthdayQuoteClient from './BirthdayQuoteClient'

export const metadata: Metadata = {
  title: 'Birthday Quote | Events District',
  description: 'Get an instant quote for your birthday celebration. Choose from our curated themes and create an unforgettable party experience.',
}

export default function BirthdayQuotePage() {
  return <BirthdayQuoteClient />
}