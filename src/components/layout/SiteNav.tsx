'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { useAuthModal } from '@/lib/store/auth-modal'

export function SiteNav({
  isAdmin,
  isLoggedIn,
  longestStreak = 0,
}: {
  isAdmin?: boolean
  isLoggedIn?: boolean
  longestStreak?: number
}) {
  const { open: openAuth } = useAuthModal()
  const requestUnlocked = isLoggedIn && longestStreak >= 5

  return (
    <nav className='hidden lg:flex'>
      <NavigationMenu>
        <NavigationMenuList className='gap-2'>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href='/' />}
            >
              홈
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href='/guide' />}
            >
              가이드
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href='/study' />}
            >
              오늘 학습
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {isLoggedIn ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href='/archive' />}
              >
                보고또보고
              </NavigationMenuLink>
            ) : (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={(e) => {
                  e.preventDefault()
                  openAuth('지난 학습을 다시 하고 싶다면 먼저 로그인하세요!')
                }}
                render={<button type='button' />}
              >
                보고또보고
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem>
            {requestUnlocked ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href='/request-study' />}
              >
                영상 조르기
              </NavigationMenuLink>
            ) : (
              <div className='relative group'>
                <span
                  className={`${navigationMenuTriggerStyle()} opacity-50 cursor-not-allowed select-none pointer-events-none`}
                >
                  영상 조르기 🔒
                </span>
                <div className='absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 bg-foreground text-background text-xs rounded-[4px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50'>
                  5일 이상이면 열려요!
                </div>
              </div>
            )}
          </NavigationMenuItem>
          {isAdmin && (
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href='/admin' />}
              >
                어드민
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
