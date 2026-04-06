import { Metadata } from 'next'
import GraduationQuoteClient from './GraduationQuoteClient'

export const metadata: Metadata = {
  title: 'Graduation Quote | Events District',
  description: 'Celebrate your academic achievement with our graduation decor packages. From intimate gatherings to grand parties, we create unforgettable graduation celebrations.',
}

export default function GraduationQuotePage() {
  return <GraduationQuoteClient />
}