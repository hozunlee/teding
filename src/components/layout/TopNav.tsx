import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MobileMenu } from './MobileMenu'
import type { Database } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type StreakRow = Database['public']['Tables']['streaks']['Row']

export async function TopNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let nickname: string | null = null
  let streak = 0
  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .single() as { data: Pick<ProfileRow, 'nickname'> | null }

    const { data: streakData } = await supabase
      .from('streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .single() as { data: Pick<StreakRow, 'current_streak'> | null }

    nickname = profileData?.nickname ?? null
    streak = streakData?.current_streak ?? 0
  }

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          <Link
            href={user ? '/home' : '/'}
            className='flex items-center gap-2 font-bold text-lg'
            style={{ color: 'var(--brand-primary)' }}
          >
            TED-fi
          </Link>
          
          {user && (
            <nav className='hidden md:flex items-center gap-6 text-sm ml-4'>
              <Link href='/home' className='text-muted-foreground hover:text-foreground transition-colors'>홈</Link>
              <Link href='/study' className='text-muted-foreground hover:text-foreground transition-colors'>학습</Link>
              <Link href='/guide' className='text-muted-foreground hover:text-foreground transition-colors'>가이드</Link>
            </nav>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {user ? (
            <>
              <div className='hidden sm:flex items-center gap-4 mr-2'>
                <div className='flex items-center gap-2 text-sm'>
                  {streak > 0 && (
                    <span className='flex items-center gap-1 text-amber-600 font-medium'>
                      <span>🔥</span>
                      <span>{streak}일</span>
                    </span>
                  )}
                  <span className='text-muted-foreground'>
                    {nickname ?? user.email?.split('@')[0]}
                  </span>
                </div>
              </div>
              
              <MobileMenu 
                isAdmin={isAdmin} 
                email={user.email} 
                nickname={nickname} 
              />
            </>
          ) : (
            <nav className='flex items-center gap-4 text-sm'>
              <Link
                href='/guide'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                학습 가이드
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
