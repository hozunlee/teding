import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import { getKSTDate } from '@/lib/utils'

type ProgressInsert = Database['public']['Tables']['user_progress']['Insert']

interface ProgressBody {
  videoId: string
  step?: 1 | 2 | 3 | 4
  knownSentences?: string[]
  quizResults?: Record<string, string>
}

interface FeedbackBody {
  videoId: string
  difficulty_rating?: 1 | 3 | 5
  daily_comment?: string | null
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as ProgressBody
  const { videoId, step, knownSentences, quizResults } = body
  const today = getKSTDate()
  const now = new Date().toISOString()

  const update: ProgressInsert = {
    user_id: user.id,
    video_id: videoId,
    date: today,
    ...(step === 1 && { step1_completed_at: now }),
    ...(step === 2 && { step2_completed_at: now }),
    ...(step === 3 && { step3_completed_at: now }),
    ...(step === 4 && { step4_completed_at: now, completed_at: now }),
    ...(knownSentences !== undefined && { known_sentences: knownSentences }),
    ...(quizResults !== undefined && { quiz_results: quizResults }),
  }

  const { error } = await supabase.from('user_progress').upsert(update, {
    onConflict: 'user_id,video_id',
  })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId, difficulty_rating, daily_comment } = await req.json() as FeedbackBody

  const { error } = await supabase
    .from('user_progress')
    .update({
      ...(difficulty_rating !== undefined && { difficulty_rating }),
      ...(daily_comment !== undefined && { daily_comment: daily_comment ?? null }),
    })
    .eq('user_id', user.id)
    .eq('video_id', videoId)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
