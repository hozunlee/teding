import { createClient, createServiceClient } from '@/lib/supabase/server'

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

export async function GET(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const serviceClient = createServiceClient()

  const { data: feedbackRows, error } = await serviceClient
    .from('feedback')
    .select('id, user_id, title, created_at')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!feedbackRows?.length) return Response.json({ feedbacks: [] })

  const userIds = [...new Set(feedbackRows.map((f) => f.user_id))]

  const [{ data: profiles }, { data: authUsers }] = await Promise.all([
    serviceClient.from('profiles').select('id, nickname').in('id', userIds),
    serviceClient.auth.admin.listUsers(),
  ])

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]))
  const emailMap = new Map(
    (authUsers?.users ?? []).map((u) => [u.id, u.email ?? ''])
  )

  const feedbacks = feedbackRows.map((f) => ({
    ...f,
    nickname: profileMap.get(f.user_id) ?? f.user_id.slice(0, 8),
    email: emailMap.get(f.user_id) ?? '',
  }))

  return Response.json({ feedbacks })
}
