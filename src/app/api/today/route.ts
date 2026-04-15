import { createClient } from '@/lib/supabase/server'
import { getKSTDate } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const today = getKSTDate()

  const { data: video } = await supabase
    .from('daily_videos')
    .select('*')
    .eq('date', today)
    .single()

  if (!video) return Response.json({ video: null, cached: null })

  const [{ data: transcript }, { data: materials }] = await Promise.all([
    supabase.from('transcripts').select('id').eq('video_id', video.video_id).single(),
    supabase.from('learning_materials').select('id').eq('video_id', video.video_id).single(),
  ])

  return Response.json({
    video,
    cached: {
      transcript: !!transcript,
      materials: !!materials,
    },
  })
}
