import { Metadata } from 'next'
import PicnicQuoteClient from './PicnicQuoteClient'

export const metadata: Metadata = {
  title: 'Picnic Date Quote | Events District',
  description: 'Plan the perfect romantic picnic with our curated packages. From intimate sunset dates to luxury proposals, create unforgettable moments.',
}

export default function PicnicQuotePage() {
  return <PicnicQuoteClient />
}