export const dynamic = 'force-dynamic'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * 현재 요청을 보낸 사용자가 관리자인지 확인합니다.
 * @param req HTTP Request 객체
 * @returns 관리자 여부 (boolean)
 */
async function checkAdmin(req: Request): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email && user.email === ADMIN_EMAIL) return true

    const authHeader = req.headers.get('Authorization')
    if (authHeader && process.env.ADMIN_SECRET && authHeader === `Bearer ${process.env.ADMIN_SECRET}`) {
      return true
    }
    return false
  } catch (error) {
    console.error('Error checking admin permissions:', error)
    return false
  }
}

/**
 * 대기 중인 영상 조르기 요청 및 미답변 의견 피드백 목록을 최신순으로 통합 조회합니다.
 */
export async function GET(req: Request) {
  try {
    const hasAdminAccess = await checkAdmin(req)
    if (!hasAdminAccess) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const serviceClient = createServiceClient()

    // 1. 대기 중인 영상 조르기 요청 조회 (status = 'pending')
    const { data: requests, error: reqError } = await serviceClient
      .from('video_requests')
      .select('id, user_id, video_title, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (reqError) {
      return Response.json({ error: reqError.message }, { status: 500 })
    }

    // 2. 답변이 없는 의견 피드백 조회
    // 2-1. 전체 피드백 조회
    const { data: feedbacks, error: fbError } = await serviceClient
      .from('feedback')
      .select('id, user_id, title, created_at')
      .order('created_at', { ascending: false })

    if (fbError) {
      return Response.json({ error: fbError.message }, { status: 500 })
    }

    // 2-2. 이미 답변 댓글(feedback_comments)이 작성된 피드백 ID 목록 조회
    const { data: comments, error: commentError } = await serviceClient
      .from('feedback_comments')
      .select('feedback_id')

    if (commentError) {
      return Response.json({ error: commentError.message }, { status: 500 })
    }

    const commentedIds = new Set((comments ?? []).map((c) => c.feedback_id))
    
    // 2-3. 답변 댓글이 한 개도 달리지 않은 피드백 필터링
    const unansweredFeedbacks = (feedbacks ?? []).filter(
      (f) => !commentedIds.has(f.id)
    )

    // 3. 닉네임 매핑을 위한 프로필 대량 조회
    const requestUserIds = (requests ?? []).map((r) => r.user_id)
    const feedbackUserIds = unansweredFeedbacks.map((f) => f.user_id)
    const uniqueUserIds = [...new Set([...requestUserIds, ...feedbackUserIds])]

    let profileMap = new Map<string, string>()
    if (uniqueUserIds.length > 0) {
      const { data: profiles, error: profileError } = await serviceClient
        .from('profiles')
        .select('id, nickname')
        .in('id', uniqueUserIds)

      if (!profileError && profiles) {
        profileMap = new Map(profiles.map((p) => [p.id, p.nickname]))
      }
    }

    // 4. 통합 알림 아이템 구조로 포맷팅
    const requestItems = (requests ?? []).map((r) => ({
      id: r.id,
      type: 'request' as const,
      title: r.video_title ?? '유튜브 영상 요청',
      nickname: profileMap.get(r.user_id) ?? '사용자',
      createdAt: r.created_at,
    }))

    const feedbackItems = unansweredFeedbacks.map((f) => ({
      id: f.id,
      type: 'feedback' as const,
      title: f.title,
      nickname: profileMap.get(f.user_id) ?? '사용자',
      createdAt: f.created_at,
    }))

    // 5. 전체 아이템 생성일자 내림차순 최신순 정렬
    const items = [...requestItems, ...feedbackItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return Response.json({ items, count: items.length })
  } catch (error) {
    console.error('Error in GET notifications:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
