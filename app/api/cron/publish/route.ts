import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
import { fakePoster } from '@/lib/poster/fake'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you might want to add authentication)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all approved previews that are due for publishing
    const now = new Date().toISOString()
    
    const { data: duePreviews, error: fetchError } = await supabaseAdmin
      .from('previews')
      .select(`
        *,
        clients!inner(name, org_id),
        ideas!inner(title, description)
      `)
      .eq('status', 'approved')
      .lte('scheduled_at', now)
      .is('scheduled_at', 'not.null')

    if (fetchError) {
      console.error('Error fetching due previews:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch previews' }, { status: 500 })
    }

    if (!duePreviews || duePreviews.length === 0) {
      return NextResponse.json({ 
        message: 'No previews due for publishing',
        count: 0 
      })
    }

    console.log(`Processing ${duePreviews.length} previews for publishing`)

    // Process each preview
    const results = []
    
    for (const preview of duePreviews) {
      try {
        // Attempt to post to social media
        const postResult = await fakePoster.postToSocialMedia(preview)
        
        // Create publish record
        const { error: publishError } = await supabaseAdmin
          .from('publishes')
          .insert({
            preview_id: preview.id,
            published_at: now,
            status: postResult.success ? 'posted' : 'failed',
            result: postResult
          })

        if (publishError) {
          console.error('Error creating publish record:', publishError)
          results.push({
            previewId: preview.id,
            success: false,
            error: 'Failed to create publish record'
          })
          continue
        }

        // Update preview status to indicate it's been processed
        const { error: updateError } = await supabaseAdmin
          .from('previews')
          .update({ 
            status: postResult.success ? 'published' : 'failed',
            metadata: { 
              last_published: now,
              publish_result: postResult 
            }
          })
          .eq('id', preview.id)

        if (updateError) {
          console.error('Error updating preview status:', updateError)
        }

        results.push({
          previewId: preview.id,
          success: postResult.success,
          result: postResult
        })

      } catch (error) {
        console.error(`Error processing preview ${preview.id}:`, error)
        results.push({
          previewId: preview.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      message: 'Publishing job completed',
      total: results.length,
      successful: successCount,
      failed: failureCount,
      results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
