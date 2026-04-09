import { AuthGuard } from '@/components/auth/AuthGuard'
import { TopNav } from '@/components/layout/TopNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <TopNav />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 min-w-0 pb-16 sm:pb-0'>
          {children}
        </main>
      </div>
      <BottomTabBar />
    </AuthGuard>
  )
}
