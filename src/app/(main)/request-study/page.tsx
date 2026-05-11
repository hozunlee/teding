import { createClient } from '@/lib/supabase/server'
import { RequestStudyClient } from './RequestStudyClient'

export default async function RequestStudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='mb-4 text-5xl'>🔒</div>
        <p className='text-xl font-semibold'>로그인이 필요합니다</p>
        <p className='mt-2 text-sm text-muted-foreground'>
          로그인 후 영상 조르기를 이용할 수 있습니다.
        </p>
      </div>
    )
  }

  const { data: streakData } = await supabase
    .from('streaks')
    .select('longest_streak')
    .eq('user_id', user.id)
    .single()

  const longestStreak = streakData?.longest_streak ?? 0

  if (longestStreak < 5) {
    return (
      <div className='mx-auto max-w-lg'>
        <div className='mb-6 flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>최장 스트릭 5일 달성 해금</p>
          <a
            href='https://www.youtube.com/@TEDEd/playlists'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-muted-foreground hover:text-[var(--brand-orange)] underline underline-offset-2 transition-colors'
          >
            TED-Ed 플레이리스트 →
          </a>
        </div>
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='mb-4 text-5xl'>🌱</div>
          <p className='text-xl font-semibold'>아직 잠겨 있어요</p>
          <p className='mt-2 text-sm text-muted-foreground'>
            5일 연속 스트릭을 달성하면 영상 조르기 기능이 열립니다.
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            현재 최장 스트릭: {longestStreak}일 / 5일
          </p>
          <div className='mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-[var(--brand-orange)] transition-all'
              style={{ width: `${Math.min(100, (longestStreak / 5) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return <RequestStudyClient />
}
