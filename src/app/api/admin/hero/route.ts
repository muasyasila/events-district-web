import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json([])
    }
    
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (err) {
    console.error('POST error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...updates } = await request.json()
    
    const { data, error } = await supabase
      .from('hero_slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (err) {
    console.error('PUT error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}