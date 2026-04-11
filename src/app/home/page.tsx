import { createClient } from '@/lib/supabase/server'
import { DailyVideoBanner } from '@/components/home/DailyVideoBanner'
import { StreakCard } from '@/components/home/StreakCard'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: video }, { data: streak }] = await Promise.all([
    supabase.from('daily_videos').select('*').eq('date', today).single(),
    supabase.from('streaks').select('*').eq('user_id', user!.id).single(),
  ])

  let cached = { transcript: false, materials: false }
  let startStep = 1

  if (video) {
    const [{ data: transcriptRow }, { data: materialsRow }, { data: progress }] =
      await Promise.all([
        supabase.from('transcripts').select('id').eq('video_id', video.video_id).single(),
        supabase.from('learning_materials').select('id').eq('video_id', video.video_id).single(),
        supabase
          .from('user_progress')
          .select('step1_completed_at,step2_completed_at,step3_completed_at,step4_completed_at')
          .eq('user_id', user!.id)
          .eq('video_id', video.video_id)
          .single(),
      ])

    cached = { transcript: !!transcriptRow, materials: !!materialsRow }

    if (progress) {
      if (!progress.step1_completed_at) startStep = 1
      else if (!progress.step2_completed_at) startStep = 2
      else if (!progress.step3_completed_at) startStep = 3
      else if (!progress.step4_completed_at) startStep = 4
      else startStep = 1 // 이미 완료 → 재학습 1부터
    }
  }

  return (
    <div className='container mx-auto max-w-2xl px-4 py-8 md:py-12'>
      <div className='mb-8 flex items-baseline justify-between'>
        <h1 className='text-[2.5rem] font-medium leading-[1.2] tracking-[-0.03em]'>오늘의 학습</h1>
        <p className='text-mono-label text-muted-foreground'>{today.replace(/-/g, '.')}</p>
      </div>

      <div className='flex flex-col gap-8'>
        {video ? (
          <DailyVideoBanner video={video} cached={cached} startStep={startStep} />
        ) : (
          <div className='flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground'>
            <p className='text-sm font-medium'>오늘의 영상이 아직 등록되지 않았습니다.</p>
            <p className='mt-1 text-xs'>관리자가 영상을 준비 중입니다. 잠시 후 다시 확인해주세요.</p>
          </div>
        )}

        <StreakCard
          currentStreak={streak?.current_streak ?? 0}
          longestStreak={streak?.longest_streak ?? 0}
          lastStudyDate={streak?.last_study_date ?? null}
        />

        <div className='flex flex-col gap-3'>
          <p className='text-mono-label px-1 text-muted-foreground'>최근 학습 기록</p>
          <div className='flex min-h-[100px] items-center justify-center rounded-lg border border-border bg-muted/10 p-8 text-center text-xs text-muted-foreground shadow-sm'>
            <div className='flex flex-col items-center gap-2'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' className='text-muted-foreground/50'>
                <path d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              학습 완료 기록이 이곳에 표시됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
