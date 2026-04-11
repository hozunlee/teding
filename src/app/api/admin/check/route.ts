import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = !!user?.email && user.email === process.env.ADMIN_EMAIL

  return Response.json({ isAdmin })
}
