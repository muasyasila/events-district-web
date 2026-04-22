import QuoteEngineServer from './QuoteEngineServer'

export const metadata = {
  title: 'Wedding Quote | Events District',
  description: 'Get an instant quote for your wedding with our dynamic pricing calculator',
}

export default function WeddingQuotePage() {
  return (
    <QuoteEngineServer 
      initialPax={100}
      initialSetup="theater"
    />
  )
}