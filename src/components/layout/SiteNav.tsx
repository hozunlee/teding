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
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()} 
              render={<Link href='/archive' />}
            >
              보고또보고
            </NavigationMenuLink>
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
