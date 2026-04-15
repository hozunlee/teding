'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useAuthModal } from '@/lib/store/auth-modal'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navItems = [
  {
    href: '/',
    label: '홈',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
        <polyline points='9 22 9 12 15 12 15 22' />
      </svg>
    ),
  },
  {
    href: '/study',
    label: '오늘 학습',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polygon points='5 3 19 12 5 21 5 3' />
      </svg>
    ),
  },
  {
    href: '/archive',
    label: '보고또보고',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='1 4 1 10 7 10' />
        <path d='M3.51 15a9 9 0 1 0 .49-4.5' />
      </svg>
    ),
  },
  {
    href: '/guide',
    label: '학습 가이드',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <circle cx='12' cy='12' r='10' />
        <path d='M12 16v-4' />
        <path d='M12 8h.01' />
      </svg>
    ),
  },
]

export function MobileNav({ isAdmin, email, nickname }: { isAdmin?: boolean; email?: string; nickname?: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { open: openAuth } = useAuthModal()
  const isLoggedIn = !!email

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
    router.push('/')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={
          <Button variant='ghost' size='icon' className='lg:hidden'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='4' y1='12' x2='20' y2='12' />
              <line x1='4' y1='6' x2='20' y2='6' />
              <line x1='4' y1='18' x2='20' y2='18' />
            </svg>
          </Button>
        }
      />
      <SheetContent side='right' className='w-[75%] sm:w-[350px] bg-background/95 backdrop-blur-md p-0 border-l border-border/40'>
        <div className='flex flex-col h-full'>
          <SheetHeader className='p-6 text-left border-b border-border/40'>
            {isLoggedIn ? (
               <SheetTitle className='flex flex-col gap-1'>
                 <span className='text-xs font-mono uppercase tracking-widest text-muted-foreground'>Profile</span>
                 <span className='text-lg font-bold text-[var(--brand-magenta)]'>{nickname || email?.split('@')[0]}</span>
                 <span className='text-[10px] text-muted-foreground truncate'>{email}</span>
               </SheetTitle>
            ) : (
               <SheetTitle className='flex flex-col gap-2'>
                 <span className='text-lg font-bold text-foreground'>로그인이 필요합니다</span>
                 <Button onClick={() => { setOpen(false); openAuth(); }} className='w-full'>
                   로그인 및 회원가입
                 </Button>
               </SheetTitle>
            )}
           
          </SheetHeader>

          <nav className='flex flex-col gap-2 p-4 flex-1 overflow-y-auto'>
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const isArchive = item.href === '/archive'
              const disabled = !isLoggedIn && isArchive

              const content = (
                <div
                  className='flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all duration-200'
                  style={
                    active
                      ? {
                          backgroundColor: 'var(--brand-orange)',
                          color: '#ffffff',
                          fontWeight: '600',
                          boxShadow: 'var(--shadow-elegant)'
                        }
                      : { color: 'var(--dark-blue)' }
                  }
                >
                  <span className={active ? '' : disabled ? 'opacity-40' : 'text-muted-foreground'}>{item.icon}</span>
                  <span className={active ? 'flex-1' : disabled ? 'flex-1 opacity-40' : 'flex-1'}>{item.label}</span>
                  {active && <span className='h-1.5 w-1.5 rounded-full bg-white' />}
                </div>
              )

              if (disabled) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setOpen(false)
                      openAuth()
                    }}
                    className='w-full text-left'
                  >
                    {content}
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {content}
                </Link>
              )
            })}
            
            {isAdmin && (
              <Link
                href='/admin'
                onClick={() => setOpen(false)}
                className='flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all text-muted-foreground hover:text-[var(--brand-orange)]'
                style={pathname.startsWith('/admin') ? { backgroundColor: 'transparent', color: 'var(--brand-orange)', fontWeight: '600' } : undefined}
              >
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/>
                </svg>
                <span>어드민 관리</span>
              </Link>
            )}
          </nav>

          {isLoggedIn && (
            <div className='p-6 border-t border-border/40'>
              <Button
                variant='ghost'
                onClick={handleSignOut}
                className='w-full justify-start gap-4 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors'
              >
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                  <polyline points='16 17 21 12 16 7' />
                  <line x1='21' y1='12' x2='9' y2='12' />
                </svg>
                <span>로그아웃</span>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
