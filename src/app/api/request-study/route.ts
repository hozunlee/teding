import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: streakData } = await supabase
    .from('streaks')
    .select('longest_streak')
    .eq('user_id', user.id)
    .single()

  if ((streakData?.longest_streak ?? 0) < 5) {
    return Response.json({ error: 'streak_too_short', longestStreak: streakData?.longest_streak ?? 0 }, { status: 403 })
  }

  const { videoId, videoUrl, videoTitle, videoDuration, thumbnailUrl, userMessage } = await req.json() as {
    videoId: string
    videoUrl: string
    videoTitle?: string
    videoDuration?: string
    thumbnailUrl?: string
    userMessage?: string
  }

  const serviceClient = createServiceClient()
  const { data, error } = await serviceClient
    .from('video_requests')
    .insert({
      user_id: user.id,
      video_id: videoId,
      video_url: videoUrl,
      video_title: videoTitle ?? null,
      video_duration: videoDuration ?? null,
      thumbnail_url: thumbnailUrl ?? null,
      user_message: userMessage ?? null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'already_requested' }, { status: 409 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true, id: data.id }, { status: 201 })
}
