// quote/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Get a Quote | Events District',
  description: 'Choose your event type to get an instant quote',
}

export default function QuoteLandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Get a Quote</h1>
        <p className="text-foreground/60">Choose your event type below</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/quote/wedding" 
          className="group p-8 border rounded-2xl text-center hover:border-amber-500 transition-all hover:shadow-lg">
          <div className="text-5xl mb-4">💒</div>
          <h2 className="text-xl font-medium mb-2">Wedding</h2>
          <p className="text-sm text-foreground/50">Get wedding decor quote</p>
        </Link>
        
        <Link href="/quote/birthday"
          className="group p-8 border rounded-2xl text-center hover:border-amber-500 transition-all hover:shadow-lg">
          <div className="text-5xl mb-4">🎂</div>
          <h2 className="text-xl font-medium mb-2">Birthday</h2>
          <p className="text-sm text-foreground/50">Get birthday party quote</p>
        </Link>
        
        <Link href="/quote/graduation"
          className="group p-8 border rounded-2xl text-center hover:border-amber-500 transition-all hover:shadow-lg">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-xl font-medium mb-2">Graduation</h2>
          <p className="text-sm text-foreground/50">Get graduation quote</p>
        </Link>
        
        <Link href="/quote/picnic"
          className="group p-8 border rounded-2xl text-center hover:border-amber-500 transition-all hover:shadow-lg">
          <div className="text-5xl mb-4">🧺</div>
          <h2 className="text-xl font-medium mb-2">Picnic</h2>
          <p className="text-sm text-foreground/50">Get picnic quote</p>
        </Link>
      </div>
    </div>
  )
}