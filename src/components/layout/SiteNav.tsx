'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function SiteNav({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <nav className='hidden lg:flex'>
      <NavigationMenu>
        <NavigationMenuList className='gap-2'>
          <NavigationMenuItem>
            <Link href='/' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                홈
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/study' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                오늘 학습
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/archive' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                보고또보고
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/guide' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                가이드
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isAdmin && (
            <NavigationMenuItem>
              <Link href='/admin' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  어드민
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
