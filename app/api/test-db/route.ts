import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Test basic database connection
    const { data: previews, error: previewsError } = await supabaseAdmin
      .from('previews')
      .select('*')
      .limit(5)

    if (previewsError) {
      return NextResponse.json({ 
        error: 'Previews table error', 
        details: previewsError.message 
      }, { status: 500 })
    }

    // Test ideas table
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .limit(5)

    if (ideasError) {
      return NextResponse.json({ 
        error: 'Ideas table error', 
        details: ideasError.message 
      }, { status: 500 })
    }

    // Test clients table
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(5)

    if (clientsError) {
      return NextResponse.json({ 
        error: 'Clients table error', 
        details: clientsError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      previews: previews || [],
      ideas: ideas || [],
      clients: clients || [],
      message: 'Database connection successful'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: (error as Error).message 
    }, { status: 500 })
  }
}
