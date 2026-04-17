import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getKSTDate } from '@/lib/utils'
import { RollingComment } from '@/components/archive/RollingComment'

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

function getDifficultyLabel(avg: number): string {
  if (avg <= 2) return '😌 쉬워요'
  if (avg <= 4) return '🔥 할만해요'
  return '💪 어려워요'
}

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const service = createServiceClient()
  const today = getKSTDate()

  const [
    { data: videos },
    { data: completions },
    { data: ratings },
    { data: allComments },
    { data: myUploads },
  ] = await Promise.all([
    service.from('daily_videos').select('*').order('date', { ascending: false }),
    service.from('user_progress').select('user_id, video_id').not('completed_at', 'is', null),
    service.from('user_progress').select('video_id, difficulty_rating').not('difficulty_rating', 'is', null),
    service.from('user_progress').select('video_id, daily_comment').not('daily_comment', 'is', null).neq('user_id', user.id),
    supabase.from('user_uploads').select('video_id, file_url').eq('user_id', user.id),
  ])

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

  // 난이도 통계 집계
  const difficultyMap = new Map<string, { sum: number; count: number }>()
  for (const r of ratings ?? []) {
    const curr = difficultyMap.get(r.video_id) ?? { sum: 0, count: 0 }
    difficultyMap.set(r.video_id, { sum: curr.sum + (r.difficulty_rating ?? 0), count: curr.count + 1 })
  }

  // 댓글 그룹핑
  const commentsMap = new Map<string, string[]>()
  for (const c of allComments ?? []) {
    if (!c.daily_comment) continue
    if (!commentsMap.has(c.video_id)) commentsMap.set(c.video_id, [])
    commentsMap.get(c.video_id)!.push(c.daily_comment)
  }

  // 내 학습지 맵
  const uploadsMap = new Map((myUploads ?? []).map((u) => [u.video_id, u.file_url]))

  const videoList = (videos ?? []).map((v) => ({
    ...v,
    completers: completionsByVideo.get(v.video_id) ?? [],
    difficultyStats: difficultyMap.get(v.video_id) ?? null,
    comments: commentsMap.get(v.video_id) ?? [],
    myUploadUrl: uploadsMap.get(v.video_id) ?? null,
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
            const diff = video.difficultyStats

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

                {/* 난이도 통계 */}
                {diff && diff.count > 0 && (
                  <p className='text-xs text-muted-foreground'>
                    {getDifficultyLabel(diff.sum / diff.count)}{' '}
                    <span className='opacity-60'>· {diff.count}명 평가</span>
                  </p>
                )}

                {/* 롤링 한 줄 평 */}
                {video.comments.length > 0 && (
                  <RollingComment comments={video.comments} />
                )}

                {/* 내 학습지 링크 */}
                {video.myUploadUrl && (
                  <a
                    href={video.myUploadUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] hover:underline'
                    onClick={(e) => e.stopPropagation()}
                  >
                    📄 내 학습지 보기
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
