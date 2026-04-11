import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId } = await params

  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('video_id', videoId)
    .single()

  return Response.json({ progress: data ?? null })
}
