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
  const month = searchParams.get('month') // YYYY-MM
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: 'month required (YYYY-MM)' }, { status: 400 })
  }

  const [year, m] = month.split('-').map(Number)
  const lastDay = new Date(year, m, 0).getDate()
  const startDate = `${month}-01`
  const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

  const serviceClient = createServiceClient()
  const { data } = await serviceClient
    .from('daily_videos')
    .select('date')
    .gte('date', startDate)
    .lte('date', endDate)

  return Response.json({ dates: (data ?? []).map(d => d.date) })
}
