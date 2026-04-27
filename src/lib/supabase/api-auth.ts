import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { User, SupabaseClient } from '@supabase/supabase-js'

export async function getAuthedClient(req: Request): Promise<{
  supabase: SupabaseClient<Database>
  user: User | null
}> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (token) {
    const supabase = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      }
    )
    const { data: { user } } = await supabase.auth.getUser(token)
    return { supabase, user }
  }

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}
