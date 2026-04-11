import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const service = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: videos } = await service
    .from('daily_videos')
    .select('*')
    .order('date', { ascending: false })

  const { data: completions } = await service
    .from('user_progress')
    .select('user_id, video_id')
    .not('completed_at', 'is', null)

  const userIds = [...new Set((completions ?? []).map((c) => c.user_id))]

  const { data: profiles } = userIds.length > 0
    ? await service.from('profiles').select('id, nickname').in('id', userIds)
    : { data: [] }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]))

  const completionsByVideo = new Map<string, string[]>()
  for (const c of completions ?? []) {
    if (!completionsByVideo.has(c.video_id)) completionsByVideo.set(c.video_id, [])
    const nickname = profileMap.get(c.user_id) ?? '익명'
    completionsByVideo.get(c.video_id)!.push(nickname)
  }

  const videoList = (videos ?? []).map((v) => ({
    ...v,
    completers: completionsByVideo.get(v.video_id) ?? [],
  }))

  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      <h1 className='text-xl font-semibold mb-6'>보고또보고</h1>

      {videoList.length === 0 ? (
        <p className='text-muted-foreground text-sm'>아직 등록된 학습 영상이 없습니다.</p>
      ) : (
        <ul className='flex flex-col gap-3'>
          {videoList.map((video) => {
            const isToday = video.date === today
            const completedCount = video.completers.length
            const visibleNames = video.completers.slice(0, 5)
            const hiddenCount = completedCount - visibleNames.length

            return (
              <li
                key={video.id}
                className='rounded-xl border border-border bg-card p-4 flex flex-col gap-2'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-muted-foreground'>{formatDate(video.date)}</span>
                  {isToday && (
                    <span
                      className='text-xs font-medium px-1.5 py-0.5 rounded'
                      style={{ backgroundColor: 'var(--step-1)', color: 'var(--brand-primary)' }}
                    >
                      오늘
                    </span>
                  )}
                  <span className='text-xs text-muted-foreground ml-auto'>{video.duration}</span>
                </div>

                <Link
                  href={`/study?date=${video.date}&step=1`}
                  className='text-sm font-medium hover:underline line-clamp-2'
                >
                  {video.title}
                </Link>

                <div className='flex items-center gap-1.5 mt-1'>
                  <span className='text-xs font-medium' style={{ color: 'var(--brand-primary)' }}>
                    {completedCount}명 완료
                  </span>
                  {completedCount > 0 && (
                    <span className='text-xs text-muted-foreground'>
                      —{' '}
                      {visibleNames.join(', ')}
                      {hiddenCount > 0 && ` 외 ${hiddenCount}명`}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
