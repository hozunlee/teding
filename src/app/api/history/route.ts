import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 최근 완료한 5개의 기록 가져오기 (daily_videos와 join)
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      date,
      completed_at,
      video_id,
      daily_videos!inner (
        title
      )
    `)
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(5)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ history: data })
}
