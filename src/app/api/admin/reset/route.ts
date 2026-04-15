import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getKSTDate } from '@/lib/utils'

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

export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { videoId } = await req.json() as { videoId?: string }

    const today = getKSTDate()

    let targetVideoId = videoId

    if (!targetVideoId) {
       const { data: todayVideo } = await supabase.from('daily_videos').select('video_id').eq('date', today).single()
       if (todayVideo) {
         targetVideoId = todayVideo.video_id
       }
    }

    if (targetVideoId) {
      await supabase.from('learning_materials').delete().eq('video_id', targetVideoId)
      await supabase.from('transcripts').delete().eq('video_id', targetVideoId)
    }

    await supabase.from('daily_videos').delete().eq('date', today)

    return Response.json({ ok: true, message: `오늘의 학습자료(${targetVideoId || '없음'})가 성공적으로 삭제/초기화되었습니다.` })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[admin/reset]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
