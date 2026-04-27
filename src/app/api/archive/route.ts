export const dynamic = 'force-dynamic'
import { getAuthedClient } from '@/lib/supabase/api-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getKSTDate } from '@/lib/utils'

export async function GET(req: Request) {
  const { supabase, user } = await getAuthedClient(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseService = createServiceClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '0')
  const category = searchParams.get('category') ?? 'latest'
  const today = getKSTDate()
  const limit = 10
  const from = page * limit
  const to = from + limit - 1

  // 아카이브 뷰는 타인의 진행률 합계(completion_count)를 포함하므로 
  // RLS 우회를 위해 supabaseService를 사용합니다.
  let query = supabaseService
    .from('archive_videos_view')
    .select('*', { count: 'exact' })
    .lte('date', today) // 내일 영상 노출 방지

  // 정렬 및 필터링
  switch (category) {
    case 'easy':
      query = query.lte('avg_difficulty', 2).order('date', { ascending: false })
      break
    case 'normal':
      query = query.gt('avg_difficulty', 2).lte('avg_difficulty', 4).order('date', { ascending: false })
      break
    case 'hard':
      query = query.gt('avg_difficulty', 4).order('date', { ascending: false })
      break
    case 'completed':
      query = query.order('completion_count', { ascending: false }).order('date', { ascending: false })
      break
    case 'latest':
    default:
      query = query.order('date', { ascending: false })
      break
  }

  const { data: videos, count, error } = await query.range(from, to)
  if (error) {
    console.error('Archive Fetch Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!videos || videos.length === 0) {
    return Response.json({ videos: [], hasMore: false })
  }

  const videoIds = videos.map((v) => v.video_id)

  // 상세 데이터 병렬 페치 (Service Role 사용으로 RLS 우회)
  const [
    { data: completions },
    { data: comments },
    { data: myUploads },
  ] = await Promise.all([
    supabaseService.from('user_progress').select('video_id, user_id').in('video_id', videoIds).not('completed_at', 'is', null),
    supabaseService.from('user_progress').select('video_id, daily_comment, user_id').in('video_id', videoIds).not('daily_comment', 'is', null),
    supabase.from('user_uploads').select('video_id, file_url').in('video_id', videoIds).eq('user_id', user.id),
  ])

  // 완료자 닉네임을 위한 프로필 페치 (Service Role 사용)
  const completerUserIds = [...new Set((completions ?? []).map((c) => c.user_id))]
  const { data: profiles } = completerUserIds.length > 0
    ? await supabaseService.from('profiles').select('id, nickname').in('id', completerUserIds)
    : { data: [] }
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]))

  // 데이터 가공
  const result = videos.map((video) => {
    const videoCompletions = (completions ?? [])
      .filter((c) => c.video_id === video.video_id)
      .map((c) => profileMap.get(c.user_id) ?? '익명')

    const videoComments = (comments ?? [])
      .filter((c) => c.video_id === video.video_id)
      .map((c) => ({
        text: c.daily_comment!,
        isMine: c.user_id === user.id,
      }))

    const myUpload = (myUploads ?? []).find((u) => u.video_id === video.video_id)

    return {
      ...video,
      completers: videoCompletions,
      comments: videoComments,
      myUploadUrl: myUpload?.file_url ?? null,
    }
  })

  return Response.json({
    videos: result,
    hasMore: count ? to < count - 1 : false,
  })
}
