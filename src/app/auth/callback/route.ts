import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 최초 로그인 시 프로필 자동 생성
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existing) {
          const nickname =
            (user.user_metadata?.full_name as string | undefined) ??
            (user.user_metadata?.name as string | undefined) ??
            user.email?.split('@')[0] ??
            '사용자'

          const avatarUrl =
            (user.user_metadata?.avatar_url as string | undefined) ?? null

          const role = user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user'

          await supabase.from('profiles').insert({
            id: user.id,
            nickname,
            avatar_url: avatarUrl,
            role,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
