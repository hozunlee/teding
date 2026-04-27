export const dynamic = 'force-dynamic'
import { getAuthedClient } from '@/lib/supabase/api-auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { supabase, user } = await getAuthedClient(req)
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
