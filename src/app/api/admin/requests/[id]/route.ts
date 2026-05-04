import { createClient, createServiceClient } from '@/lib/supabase/server'
import { registerDailyVideo } from '@/lib/admin-daily'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

async function isAdmin(req: Request): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email && user.email === ADMIN_EMAIL) return true

  const authHeader = req.headers.get('Authorization')
  if (authHeader && process.env.ADMIN_SECRET && authHeader === `Bearer ${process.env.ADMIN_SECRET}`) {
    return true
  }
  return false
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { action, scheduledDate } = await req.json() as {
    action: 'schedule' | 'reject'
    scheduledDate?: string
  }

  const serviceClient = createServiceClient()

  if (action === 'reject') {
    const { error } = await serviceClient
      .from('video_requests')
      .update({ status: 'rejected' })
      .eq('id', id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true })
  }

  if (action === 'schedule') {
    if (!scheduledDate) return Response.json({ error: 'scheduledDate required' }, { status: 400 })

    const { data: request, error: fetchError } = await serviceClient
      .from('video_requests')
      .select('video_id, video_title, video_duration')
      .eq('id', id)
      .single()

    if (fetchError || !request) return Response.json({ error: 'Request not found' }, { status: 404 })

    try {
      await registerDailyVideo({
        videoId: request.video_id,
        title: request.video_title ?? request.video_id,
        duration: request.video_duration ?? '5:00',
        date: scheduledDate,
        force: false,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[admin/requests/schedule]', message)
      return Response.json({ error: message }, { status: 500 })
    }

    const { error: updateError } = await serviceClient
      .from('video_requests')
      .update({ status: 'scheduled', scheduled_date: scheduledDate })
      .eq('id', id)

    if (updateError) return Response.json({ error: updateError.message }, { status: 500 })

    return Response.json({ ok: true, scheduledDate })
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 })
}
