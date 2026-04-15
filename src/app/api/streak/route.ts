import { createClient } from '@/lib/supabase/server'
import { getKSTDate } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return Response.json({ streak: data ?? null })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const today = getKSTDate()
  const yesterday = getKSTDate(new Date(Date.now() - 86_400_000))

  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!streak) {
    await supabase.from('streaks').insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    })
    return Response.json({ current_streak: 1, longest_streak: 1 })
  }

  if (streak.last_study_date === today) {
    return Response.json({
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
    })
  }

  const newCurrent = streak.last_study_date === yesterday ? streak.current_streak + 1 : 1
  const newLongest = Math.max(newCurrent, streak.longest_streak)

  await supabase.from('streaks').update({
    current_streak: newCurrent,
    longest_streak: newLongest,
    last_study_date: today,
    updated_at: new Date().toISOString(),
  }).eq('user_id', user.id)

  return Response.json({ current_streak: newCurrent, longest_streak: newLongest })
}
