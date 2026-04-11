import { AuthGuard } from '@/components/auth/AuthGuard'
import { TopNav } from '@/components/layout/TopNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { createClient } from '@/lib/supabase/server'

export default async function StudyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  return (
    <AuthGuard>
      <TopNav />
      <div className='flex flex-1'>
        <Sidebar isAdmin={isAdmin} />
        <main className='flex-1 min-w-0 pb-16 sm:pb-0'>
          {children}
        </main>
      </div>
      <BottomTabBar />
    </AuthGuard>
  )
}
