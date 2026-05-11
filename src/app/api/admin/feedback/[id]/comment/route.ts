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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const content = (body.body ?? '').trim()

  if (content.length < 1 || content.length > 1000) {
    return Response.json({ error: '댓글은 1~1000자 사이여야 합니다' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  const { error } = await serviceClient.from('feedback_comments').insert({
    feedback_id: id,
    body: content,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true }, { status: 201 })
}
