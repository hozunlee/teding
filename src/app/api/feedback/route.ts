import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceClient = createServiceClient()

  const { data: feedbacks, error } = await serviceClient
    .from('feedback')
    .select('id, title, body, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!feedbacks?.length) return Response.json({ feedbacks: [] })

  const feedbackIds = feedbacks.map((f) => f.id)
  const { data: comments } = await serviceClient
    .from('feedback_comments')
    .select('id, feedback_id, body, created_at')
    .in('feedback_id', feedbackIds)
    .order('created_at', { ascending: true })

  const commentsByFeedback = (comments ?? []).reduce<Record<string, typeof comments>>((acc, c) => {
    if (!c) return acc
    if (!acc[c.feedback_id]) acc[c.feedback_id] = []
    acc[c.feedback_id]!.push(c)
    return acc
  }, {})

  const result = feedbacks.map((f) => ({
    ...f,
    comments: commentsByFeedback[f.id] ?? [],
  }))

  return Response.json({ feedbacks: result })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const title = (body.title ?? '').trim()
  const content = (body.body ?? '').trim()

  if (title.length < 1 || title.length > 100) {
    return Response.json({ error: '제목을 입력해주세요' }, { status: 400 })
  }
  if (content.length < 1 || content.length > 2000) {
    return Response.json({ error: '내용을 입력해주세요' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  const { error } = await serviceClient.from('feedback').insert({
    user_id: user.id,
    title,
    body: content,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true }, { status: 201 })
}
