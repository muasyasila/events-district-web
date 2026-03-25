import QuoteEngineServer from './QuoteEngineServer'

export const metadata = {
  title: 'Quote Engine | Events District',
  description: 'Get an instant quote for your event with our dynamic pricing calculator',
}

export default function QuotePage() {
  return (
    <QuoteEngineServer 
      initialPax={100}
      initialSetup="theater"
    />
  )
}