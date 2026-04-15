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

export function SiteNav({ isAdmin, isLoggedIn }: { isAdmin?: boolean; isLoggedIn?: boolean }) {
  const { open: openAuth } = useAuthModal()

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
                render={<button type="button" />}
              >
                보고또보고
              </NavigationMenuLink>
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
