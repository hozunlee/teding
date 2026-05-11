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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const serviceClient = createServiceClient()

  const [{ data: feedbackRow, error: fbErr }, { data: comments, error: cmErr }] = await Promise.all([
    serviceClient.from('feedback').select('*').eq('id', id).single(),
    serviceClient.from('feedback_comments').select('*').eq('feedback_id', id).order('created_at', { ascending: true }),
  ])

  if (fbErr || !feedbackRow) return Response.json({ error: 'Not found' }, { status: 404 })
  if (cmErr) return Response.json({ error: cmErr.message }, { status: 500 })

  const [{ data: profile }, { data: authUser }] = await Promise.all([
    serviceClient.from('profiles').select('nickname').eq('id', feedbackRow.user_id).single(),
    serviceClient.auth.admin.getUserById(feedbackRow.user_id),
  ])

  const feedback = {
    ...feedbackRow,
    nickname: profile?.nickname ?? feedbackRow.user_id.slice(0, 8),
    email: authUser.user?.email ?? '',
    comments: comments ?? [],
  }

  return Response.json({ feedback })
}
