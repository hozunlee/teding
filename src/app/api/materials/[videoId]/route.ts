import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId } = await params

  const { data, error } = await supabase
    .from('learning_materials')
    .select('*')
    .eq('video_id', videoId)
    .single()

  if (error || !data) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json({ materials: data })
}
