import { AuthGuard } from '@/components/auth/AuthGuard'
import { TopNav } from '@/components/layout/TopNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className='flex min-h-screen flex-col'>
        <TopNav />
        <main className='flex-1'>{children}</main>
      </div>
    </AuthGuard>
  )
}
