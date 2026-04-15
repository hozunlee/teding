import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TeddingLogo } from './TeddingLogo'
import { LoginButton } from './LoginButton'
import { SignOutButton } from './SignOutButton'
import { MobileNav } from './MobileNav'
import type { Database } from '@/types/database'
import { SiteNav } from './SiteNav'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type StreakRow = Database['public']['Tables']['streaks']['Row']

export async function SiteHeader() {
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
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center'>
            <TeddingLogo className='text-lg' />
          </Link>
          
          <SiteNav isAdmin={isAdmin} />
        </div>

        <div className='flex items-center gap-4'>
          {user ? (
            <div className='flex items-center gap-4'>
              <div className='hidden sm:flex items-center gap-4'>
                <div className='flex items-center gap-2 text-sm'>
                  {streak > 0 && (
                    <span className='flex items-center gap-1 text-[var(--brand-orange)] font-medium'>
                      <span>🔥</span>
                      <span>{streak}일</span>
                    </span>
                  )}
                  <span className='font-medium'>
                    {nickname ?? user.email?.split('@')[0]}
                  </span>
                </div>
              </div>
              
              <div className='hidden lg:flex items-center'>
                <SignOutButton />
              </div>
              <div className='lg:hidden flex items-center'>
                <MobileNav 
                  isAdmin={isAdmin} 
                  email={user.email} 
                  nickname={nickname} 
                />
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <LoginButton />
              <div className='lg:hidden flex items-center'>
                <MobileNav />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
