import { TopNav } from '@/components/layout/TopNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { createClient } from '@/lib/supabase/server'

// 학습 가이드는 비로그인 사용자도 접근 가능 — AuthGuard 없음
export default async function GuideLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  return (
    <>
      <TopNav />
      <div className='flex flex-1'>
        {user && <Sidebar isAdmin={isAdmin} />}
        <main className='flex-1 min-w-0 pb-16 sm:pb-0'>
          {children}
        </main>
      </div>
      {user && <BottomTabBar />}
    </>
  )
}
