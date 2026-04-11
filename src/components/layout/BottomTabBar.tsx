'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/home',
    label: '홈',
    icon: (active: boolean) => (
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill={active ? 'currentColor' : 'none'}
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
    label: '학습',
    icon: (active: boolean) => (
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill={active ? 'currentColor' : 'none'}
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
    label: '가이드',
    icon: (active: boolean) => (
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill={active ? 'currentColor' : 'none'}
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
  {
    href: '/archive',
    label: '보고또보고',
    icon: () => (
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='1 4 1 10 7 10' />
        <path d='M3.51 15a9 9 0 1 0 .49-4.5' />
      </svg>
    ),
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-border bg-background'>
      <div className='flex items-center justify-around h-16'>
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className='flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors'
              style={{ color: active ? 'var(--brand-primary)' : undefined }}
            >
              <span className={active ? '' : 'text-muted-foreground'}>
                {tab.icon(active)}
              </span>
              <span className={active ? 'font-medium' : 'text-muted-foreground'}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
