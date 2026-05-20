import { createClient } from '@/lib/supabase/server'
import { registerDailyVideo } from '@/lib/admin-daily'
import { getKSTDate } from '@/lib/utils'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

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

export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { videoId, title, duration, videoUrl, force = false, date: dateParam } = await req.json() as {
      videoId: string
      title: string
      duration: string
      videoUrl: string
      force?: boolean
      date?: string
    }

    const date = dateParam ?? getKSTDate()
    const { transcriptCached, materialsCached } = await registerDailyVideo({ videoId, title, duration, videoUrl, date, force })

    // 매월 1일인 경우 공휴일 자동 동기화 (백그라운드 처리)
    if (date.endsWith('-01')) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      fetch(`${appUrl}/api/admin/holidays/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date })
      }).catch(err => console.error('[admin/daily] Failed to trigger holiday sync:', err))
    }

    return Response.json({ ok: true, date, videoId, transcriptCached, materialsCached })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[admin/daily]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
