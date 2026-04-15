import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ history: [], loggedIn: false })

  // 1. 최근 학습 진행 기록 가져오기 (Step 1 이상 진행한 것)
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select(`
      date,
      step1_completed_at,
      step2_completed_at,
      step3_completed_at,
      step4_completed_at,
      video_id
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

  // 2. 해당 비디오들의 제목 정보 가져오기 (별도 쿼리)
  const videoIds = progressData.map(p => p.video_id)
  const { data: videosData, error: videosError } = await supabase
    .from('daily_videos')
    .select('video_id, title')
    .in('video_id', videoIds)

  if (videosError) {
    console.error('[api/history] videos error:', videosError)
    // 비디오 정보를 못 가져와도 일단 진행은 할 수 있게 빈 배열 처리하거나 에러 반환
    return Response.json({ error: videosError.message }, { status: 500 })
  }

  // 3. 데이터 결합
  const videoMap = new Map(videosData?.map(v => [v.video_id, v.title]))
  const history = progressData.map(p => ({
    ...p,
    daily_videos: {
      title: videoMap.get(p.video_id) || '제목 없음'
    }
  }))

  return Response.json({ history, loggedIn: true })
}
