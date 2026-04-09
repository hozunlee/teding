'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    href: '/home',
    label: '홈',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
        <polyline points='9 22 9 12 15 12 15 22' />
      </svg>
    ),
  },
  {
    href: '/study',
    label: '오늘 학습',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polygon points='5 3 19 12 5 21 5 3' />
      </svg>
    ),
  },
  {
    href: '/guide',
    label: '학습 가이드',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10' />
        <path d='M12 16v-4' />
        <path d='M12 8h.01' />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <aside className='hidden lg:flex flex-col w-60 shrink-0 border-r border-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto'>
      <div className='flex flex-col h-full'>
        <nav className='flex flex-col gap-1 p-4 flex-1'>
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors'
                style={
                  active
                    ? {
                        backgroundColor: 'var(--step-1)',
                        color: 'var(--brand-primary)',
                        fontWeight: '500',
                      }
                    : undefined
                }
              >
                <span className={active ? '' : 'text-muted-foreground'}>{item.icon}</span>
                <span className={active ? '' : 'text-muted-foreground'}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className='p-4 border-t border-border'>
          <Button
            variant='ghost'
            onClick={handleSignOut}
            className='w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-foreground'
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <polyline points='16 17 21 12 16 7' />
              <line x1='21' y1='12' x2='9' y2='12' />
            </svg>
            로그아웃
          </Button>
        </div>
      </div>
    </aside>
  )
}
