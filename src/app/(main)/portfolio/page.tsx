import { Metadata } from 'next'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio | Events District',
  description: 'Explore our collection of stunning event designs. From intimate weddings to grand corporate galas, see how we transform spaces into unforgettable experiences.',
}

export default function PortfolioPage() {
  return <PortfolioClient />
}