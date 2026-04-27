export const dynamic = 'force-dynamic'
import { getAuthedClient } from '@/lib/supabase/api-auth'

export async function GET(req: Request) {
  const { supabase, user } = await getAuthedClient(req)
  if (!user) return Response.json({ history: [], loggedIn: false })

  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select(`
      date,
      step1_completed_at,
      step2_completed_at,
      step3_completed_at,
      step4_completed_at,
      video_id,
      daily_comment
    `)
    .eq('user_id', user.id)
    .not('step1_completed_at', 'is', null)
    .order('date', { ascending: false })
    .limit(5)

  if (progressError) {
    console.error('[api/history] progress error:', progressError)
    return Response.json({ error: progressError.message }, { status: 500 })
  }

  if (!progressData || progressData.length === 0) {
    return Response.json({ history: [], loggedIn: true })
  }

  const videoIds = progressData.map(p => p.video_id)
  const { data: videosData, error: videosError } = await supabase
    .from('daily_videos')
    .select('video_id, title, date')
    .in('video_id', videoIds)

  if (videosError) {
    console.error('[api/history] videos error:', videosError)
    return Response.json({ error: videosError.message }, { status: 500 })
  }

  const videoMap = new Map(videosData?.map(v => [v.video_id, { title: v.title, date: v.date }]))
  const history = progressData.map(p => {
    const videoInfo = videoMap.get(p.video_id)
    return {
      ...p,
      date: videoInfo?.date || p.date, // Use the actual video date for linking
      daily_videos: {
        title: videoInfo?.title || '제목 없음'
      }
    }
  })

  return Response.json({ history, loggedIn: true })
}
