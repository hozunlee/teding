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

  const { searchParams } = new URL(req.url)
  const statusParam = searchParams.get('status') ?? 'pending'
  const filterByStatus = statusParam !== 'all'
  const validStatus = (['pending', 'scheduled', 'rejected'] as const).includes(
    statusParam as 'pending' | 'scheduled' | 'rejected'
  )
    ? (statusParam as 'pending' | 'scheduled' | 'rejected')
    : 'pending'

  const serviceClient = createServiceClient()

  let query = serviceClient
    .from('video_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (filterByStatus) {
    query = query.eq('status', validStatus)
  }

  const { data: requests, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!requests?.length) return Response.json({ requests: [] })

  const userIds = [...new Set(requests.map(r => r.user_id))]
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, nickname')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p.nickname]))

  const result = requests.map(r => ({
    ...r,
    nickname: profileMap.get(r.user_id) ?? r.user_id.slice(0, 8),
  }))

  return Response.json({ requests: result })
}
